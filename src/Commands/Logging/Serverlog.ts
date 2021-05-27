import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class ServerlogCommand extends BaseCommand {
	constructor() {
		super(
			'serverlog',
			'logging',
			[],
			'',
			'Configure this to recieve logs on guild update (name, etc..)',
			'',
			[],
			[],
			[],
			[],
			true,
			false,
			false,
			3000,
			'WIP'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {}
}
