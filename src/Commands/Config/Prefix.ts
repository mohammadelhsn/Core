import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class PrefixCommand extends BaseCommand {
	constructor() {
		super('prefix', 'config', []);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {}
}
