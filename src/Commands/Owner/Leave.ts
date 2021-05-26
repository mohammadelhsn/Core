import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class TesstCommand extends BaseCommand {
	constructor() {
		super(
			'quit',
			'owner',
			[],
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
			'WIP'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {}
}
