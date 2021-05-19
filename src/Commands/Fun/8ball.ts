import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';
import axios from 'axios';

export default class EightBallCommand extends BaseCommand {
	constructor() {
		super(
			'8ball',
			'fun',
			[],
			'',
			'',
			'',
			[],
			[],
			[],
			[],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const question = args.join(' ');
		const guild = client.database.get(message.guild.id);

		if (!question) {
			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'Missing a required argument',
			});

			const msg = await message.channel.send({ embed: errEmbed });
			return msg.delete({ timeout: 10000 });
		}
		if (question) {
			if (args[0] == 'help') {
				return await this.HelpEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					command: this,
					message: message,
				});
			}
			try {
				const res = await axios.get(
					`https://nekos.life/api/v2/8ball?text=${question}`
				);
				const data = res.data;

				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: '8ball command',
					description: guild.Strings.NekosLife,
					fields: [{ name: 'Response', value: `\`${data.response}\`` }],
					image: data.url,
				});

				return message.channel.send({ embed: embed });
			} catch (e) {
				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
				});
				return message.channel.send({ embed: embed });
			}
		}
	}
}
