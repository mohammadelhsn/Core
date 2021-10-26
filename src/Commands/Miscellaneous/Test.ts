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
	async run(client: DiscordClient, message: Message, args: string[]) {}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
