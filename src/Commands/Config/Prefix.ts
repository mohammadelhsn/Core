import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class PrefixCommand extends BaseCommand {
	constructor() {
		super('prefix', 'config', []);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const newPrefix = args[0];

		if (!newPrefix) {
			return message.channel.send('Oops, you must specifiy a new prefix!');
		}
	}
}
