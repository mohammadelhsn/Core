import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, CommandInteraction } from 'discord.js';

export default class DeleteGuildCommand extends BaseCommand {
	constructor() {
		super(
			'deleteguild',
			'owner',
			['dg'],
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
