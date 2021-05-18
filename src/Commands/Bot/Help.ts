import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class HelpCommand extends BaseCommand {
	constructor() {
		super('help', 'bot', []);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {}
}
