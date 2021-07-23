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
		const embed = await this.Embed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			title: 'Changelog command',
			description: `${client.version} changelog`,
			fields: [
				{ name: 'Additions', value: `` },
				{ name: 'Modifications', value: `` },
				{ name: 'Removals', value: `` },
			],
		});

		return message.channel.send({ embed: embed });
	}
}
