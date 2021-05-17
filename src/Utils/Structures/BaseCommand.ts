import { Message } from 'discord.js';
//import DiscordClient from '../../client/client';
//import StateManager from '../StateManager';

export default abstract class BaseCommand {
	con = StateManager.con;
	constructor(
		private name: string,
		private category: string,
		private aliases: Array<string>
	) {}

	getName(): string {
		return this.name;
	}
	getCategory(): string {
		return this.category;
	}
	getAliases(): Array<string> {
		return this.aliases;
	}

	abstract run(
		client: DiscordClient,
		message: Message,
		args: Array<string> | null
	): Promise<void>;
}
