import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';
import Schemas from '../../Utils/Schemas';

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

		const con = await this.con.connect();

		try {
			await con.query(`BEGIN`);
			await con.query(
				`UDPATE Guilds SET moderations = '${new Schemas.Moderations()}' WHERE guildId = '837853708129009715'`
			);
			await con.query(`COMMIT`);
		} finally {
			con.release();
		}
	}
}
