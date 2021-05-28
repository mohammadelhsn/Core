import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class RoleCommand extends BaseCommand {
	constructor() {
		super(
			'role',
			'moderation',
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
			'WIP'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {}
}