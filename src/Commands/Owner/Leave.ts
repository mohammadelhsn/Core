import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class TesstCommand extends BaseCommand {
	constructor() {
		super('tesst', 'miscellaneous', []);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const guild = args[0];

		const index = client.guilds.cache.get(guild);

		console.log(index.channels.cache.first().createInvite());

		//index.leave();
	}
}
