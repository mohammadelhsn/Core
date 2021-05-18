import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class ChangelogCommand extends BaseCommand {
	constructor() {
		super('changelog', 'bot', []);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		// nothing to put here yet unfortunately
	}
}
