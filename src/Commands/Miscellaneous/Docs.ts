import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';
import axios from 'axios';

export default class DocsCommand extends BaseCommand {
	constructor() {
		super('docs', 'miscellaneous', []);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const query = args[0];

		if (!query) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Missing query',
			});
			const msg = await message.channel.send({ embed: errorEmbed });
			return msg.delete({ timeout: 10000 });
		}
		const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
			query
		)}`;

		const docFetch = await axios.get(url);
		const embed = docFetch.data;

		if (!embed || embed.error) {
			const errorEmbed = await this.ErrorEmbed.NoResult({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});
			const msg = await message.channel.send({ embed: errorEmbed });
			return msg.delete({ timeout: 10000 });
		}

		if (!message.guild) {
			return message.channel.send({ embed });
		}

		const msg = await message.channel.send({ embed });
		msg.react('🗑️');

		let react;

		try {
			react = await msg.awaitReactions(
				(reaction, user) =>
					reaction.emoji.name === '🗑️' && user.id === message.author.id,
				{ max: 1, time: 60000, errors: ['time'] }
			);
		} catch (error) {
			msg.reactions.removeAll();
		}

		if (react && react.first()) msg.delete();
	}
}
