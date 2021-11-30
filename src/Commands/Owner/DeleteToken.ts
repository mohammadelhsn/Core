import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, CommandInteraction } from 'discord.js';

export default class DeleteTokenCommand extends BaseCommand {
	constructor() {
		super(
			'deletetoken',
			'owner',
			['dt'],
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
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
