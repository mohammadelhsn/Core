import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	CommandInteraction,
	Message,
	MessageEmbed,
	ReactionCollectorOptions,
} from 'discord.js';

export default class TestCommand extends BaseCommand {
	constructor() {
		super(
			'test',
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
			false,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
