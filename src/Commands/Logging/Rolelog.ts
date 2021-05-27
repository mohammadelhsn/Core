import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class RolelogCommand extends BaseCommand {
	constructor() {
		super(
			'rolelog',
			'logging',
			[],
			'',
			'Recieve logs on role creations / delete / update',
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
