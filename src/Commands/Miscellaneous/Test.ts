import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, MessageFlags, Permissions } from 'discord.js';

export default class TesstCommand extends BaseCommand {
	constructor() {
		super(
			'tesst',
			'miscellaneous',
			[],
			'',
			'A simple testing command',
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
		const msg = await message.channel.send({ content: 'This is a test' });
		msg.timeout();
		console.log(msg.content);
	}
}
