import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class TesstCommand extends BaseCommand {
	constructor() {
		super('tesst', 'miscellaneous', []);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const guild = args[0];

		if (!guild) {
			return message.channel.send("You're forgetting the argument!!");
		}

		const index = client.guilds.cache.get(guild);

		return await index.leave();
	}
}
