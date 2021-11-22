import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	Message,
	MessageFlags,
	Permissions,
	Interaction,
	CommandInteraction,
	MessageEmbed,
} from 'discord.js';
import BaseObj from '../../Utils/Structures/BaseObj';
import axios from 'axios';
import Responses from '../../Utils/Structures/Interfaces/Response';

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
		const guild = client.database.get(message.guild.id);

		console.log(guild.event_collection);
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
