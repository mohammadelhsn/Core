import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';
import axios from 'axios';

export default class GoogleCommand extends BaseCommand {
	constructor() {
		super(
			'google',
			'miscellaneous',
			['search'],
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
		const key = process.env.GOOGLE_KEY;
		const csx = process.env.GOOGLE_CSX;
		const query = args.join('%20');
		let result;

		if (query.toLowerCase() === 'help') {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		if (!query) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'You are missing the required query',
			});
			const msg = await message.channel.send({ embed: errorEmbed });
			return msg.delete({ timeout: 10000 });
		}

		const href = await search(query);

		if (!href) {
			const errorEmbed = await this.ErrorEmbed.NoResult({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});
			const msg = await message.channel.send({ embed: errorEmbed });
			return msg.delete({ timeout: 10000 });
		}

		const embed = await this.Embed.Base({
			iconURL: href.pagemap.cse_thumbnail
				? href.pagemap.cse_thumbnail[0].src
				: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			title: href.title,
			description: href.snippet,
			link: href.link,
		});
		return message.channel.send({ embed: embed });

		async function search(query) {
			const { data } = await axios.get(
				`https://www.googleapis.com/customsearch/v1?key=${key}&cx=${csx}&q=${query}&safe=off`
			);

			if (!data.items) return null;
			return data.items[0];
		}
	}
}
