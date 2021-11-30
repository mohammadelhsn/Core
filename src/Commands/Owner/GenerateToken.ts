import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, CommandInteraction } from 'discord.js';
import axios, { AxiosResponse, AxiosError } from 'axios';

export default class GenerateTokenCommand extends BaseCommand {
	constructor() {
		super(
			'generatetoken',
			'owner',
			['gt'],
			'',
			'',
			'',
			[],
			[],
			[],
			[],
			true,
			true,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const user = message.mentions.members.first();

		if (user.user.bot) return;

		/**
		 * @author <https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php>
		 */
		function GenerateToken() {
			var dt = new Date().getTime();
			var uuid = 'xxxxxxxxxxxxyxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = (dt + Math.random() * 16) % 16 | 0;
				dt = Math.floor(dt / 16);
				return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
			});
			return uuid;
		}

		if (!user) {
			const embed = await this.ErrorEmbed.Base({
				error_message: 'Oops, you are missing a requried mention!',
				text: this,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
			});

			return await message.reply({ embeds: [embed] });
		}

		let data: AxiosResponse;

		try {
			data = await axios.get(
				`https://processversion.herokuapp.com/user?id=${user.id}`,
				{ headers: { Authorization: process.env.MY_API } }
			);
		} catch (error) {
			data = (error as AxiosError).response;
		}

		if (data.data.success == true && data.data != null) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				error_message:
					'This user has already been assigned a key and already exists in the database',
				id: message.guild.id,
			});

			return message.reply({ embeds: [embed] });
		}

		if (data.data.success == false && data.data.status == 404) {
			let key;
			while (true) {
				key = GenerateToken();

				const response = await axios.get(
					`https://processversion.herokuapp.com/keys?key=${key}`,
					{ headers: { Authorization: process.env.MY_API } }
				);
				const keyCheck = response.data;

				if (keyCheck.data == null) {
					break;
				}
			}

			const body = { id: user.id, key: key };

			await axios.post(`https://processversion.herokuapp.com/user`, body, {
				headers: {
					Authorization: process.env.MY_API,
					'Content-Type': 'application/json',
				},
			});

			const embed = await this.Embed.Base({
				title: 'API key',
				text: this,
				description:
					'Successfully generated your API key! Please note that when you first use your key, it will bind to that IP address',
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				fields: [
					{ name: 'API key', value: `||${body.key}||` },
					{ name: 'Need help?', value: `Contact ProcessVersion#4472` },
				],
			});

			try {
				user.send({ embeds: [embed] });
			} catch (error) {
				console.log(
					`I can't DM ${user.id} their key!\n\nTheir key is ${body.key}`
				);
			} finally {
				const embed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					success_message: 'Successfully generated token!',
					id: message.guild.id,
				});

				return message.reply({ embeds: [embed] });
			}
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
