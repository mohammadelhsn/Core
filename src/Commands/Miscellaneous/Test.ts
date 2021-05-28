import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class TesstCommand extends BaseCommand {
	constructor() {
		super('tesst', 'miscellaneous', []);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const test = await this.Moderation.InsertModeration(
			message.guild.id,
			'ban',
			2,
			message.author.id
		);
	}
}
