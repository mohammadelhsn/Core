import DiscordClient from '../../Client/Client';
import BaseEvent from '../../Utils/Structures/BaseEvent';
import { Guild } from 'discord.js';
import Schemas from '../../Utils/Schemas';

export default class GuildCreateEvent extends BaseEvent {
	constructor() {
		super('guildCreate');
	}
	async run(client: DiscordClient, guild: Guild) {
		const con = await this.con.connect();
		try {
			await con.query(`BEGIN`);
			// await con.query(
			// 	`INSERT`
			// )
			await con.query(
				`INSERT INTO GuildConfigurable(guildId) VALUES('${guild.id}')`
			);
			await con.query(
				`INSERT INTO GuildLogging(guildId) VALUES('${guild.id}')`
			);
			await con.query(
				`INSERT INTO welcomesystem(guildId) VALUES('${guild.id}')`
			);
			await con.query(`INSERT INTO leavesystem(guildId) VALUES('${guild.id}')`);
			await con.query(`INSERT INTO serverroles(guildId) VALUES('${guild.id}')`);
			await con.query(`INSERT INTO guildstats(guildId) VALUES('${guild.id}')`);
			await con.query(`COMMIT`);
			console.log('New guild added');
		} catch (error) {
			console.log(error);
		} finally {
			con.release();
		}
	}
}
