import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class TestCommand extends BaseCommand {
	constructor() {
		super('test', 'testing', []);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		message.channel.send('Test command works');

		const con = await this.con.connect();
		try {
			console.log(con);
		} catch (error) {
			console.log(error);
		} finally {
			con.release();
		}
	}
}
