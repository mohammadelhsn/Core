import DiscordClient from '../../Client/Client';
import BaseEvent from '../../Utils/Structures/BaseEvent';
import { Guild } from 'discord.js';

export default class GuildDeleteEvent extends BaseEvent {
	constructor() {
		super('guildDelete');
	}
	async run(client: DiscordClient, guild: Guild) {
		const con = await this.con.connect();

		try {
			await con.query(`BEGIN`);
			await con.query(`DELETE FROM Guilds WHERE guildid = '${guild.id}'`);
			await con.query(`COMMIT`);
			console.log('Guild removed!');
		} catch (error) {
			console.log(error);
		} finally {
			con.release();
		}
	}
}
