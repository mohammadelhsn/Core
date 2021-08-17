import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class ChangelogCommand extends BaseCommand {
	constructor() {
		super(
			'changelog',
			'bot',
			[],
			'',
			'Sends an embed containing the most recent changes',
			'',
			[],
			[],
			['SEND_MESSAGES', 'EMBED_LINKS'],
			[],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const embed = await this.Embed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			title: 'Changelog command',
			description: `${client.version} changelog`,
			fields: [
				{ name: 'Additions', value: `Slash commands (WIP still)` },
				{ name: 'Modifications', value: `Discord.JS V13 updates!` },
				{ name: 'Removals', value: `` },
			],
		});

		return message.channel.send({ embeds: [embed] });
	}
}
