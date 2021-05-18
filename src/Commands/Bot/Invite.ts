import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class InviteCommand extends BaseCommand {
	constructor() {
		super('invite', 'bot', []);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {}
}
