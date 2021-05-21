import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';
import API from '@processversion/api-wrapper';

export default class RobloxCommand extends BaseCommand {
	constructor() {
		super(
			'roblox',
			'miscellaneous',
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
		const username = args.join(' ');

		if (!username) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Please mention a user to search!',
			});
			const msg = await message.channel.send({ embed: errorEmbed });
			return msg.delete({ timeout: 10000 });
		}

		try {
			const api = new API(process.env.MY_API);
			const { data } = await api.Roblox(username);

			if (data.isBanned == true) {
				const embed = this.Embed.Base({
					iconURL: data.profile_url,
					title: `${data.username} | Account status: Banned`,
					description: data.bio,
					text: this,
					fields: [{ name: 'Join date', value: data.pastNames }],
				});

				return message.channel.send({ embed: embed });
			}

			const embed = this.Embed.Base({
				iconURL: data.profile_url,
				title: `${data.username} | Status: Not banned`,
				description: data.bio,
				text: this,
				fields: [
					{ name: 'Past usernames', value: data.pastNames },
					{ name: 'Friends', value: data.friends },
					{ name: 'Followers', value: data.followers },
					{ name: 'Following', value: data.following },
					{ name: 'Age', value: data.age },
					{ name: 'Join date', value: data.joinDate },
				],
				link: data.profile_url,
			});
			return message.channel.send({ embed: embed });
		} catch (e) {
			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});
			return message.channel.send({ embed: errEmbed });
		}
	}
}
