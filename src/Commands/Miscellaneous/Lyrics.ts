import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, Util } from 'discord.js';
import axios from 'axios';

export default class LyricsCommand extends BaseCommand {
	constructor() {
		super(
			'lyrics',
			'miscellaneous',
			[],
			'<song name>',
			'Get the lyrics for any song',
			'',
			[],
			[],
			['SEND_MESSAGES', 'EMBED_LINKS'],
			[],
			true,
			false,
			false,
			3000,
			'WIP'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		// Endpoint: https://some-random-api.ml/lyrics?title=

		const song = args.join('%20');
		if (!song) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Must include a song name!',
			});
			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return msg.delete({ timeout: 10000 });
		}

		const res = await axios.get(
			`https://some-random-api.ml/lyrics?title=${song}`
		);
		const body = res.data;

		if (!body.title) {
			const errorEmbed = await this.ErrorEmbed.NoResult({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});
			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return this.Utils.Delete(msg);
		}

		const songEmbed = await this.Embed.Base({
			iconURL: body.thumbnail.genius ? body.thumbnail.genius : null,
			text: this,
			title: `${body.title} lyrics`,
			description: `Author: ${body.author}`,
			link: body.links.genius ? body.links.genius : null,
		});

		Util.splitMessage(body.lyrics);

		return message.channel.send({
			content: `\`\`\`${body.lyrics}\`\`\``,
			embeds: [songEmbed],
		});
	}
}
