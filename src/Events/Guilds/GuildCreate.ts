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
			await con.query(
				`INSERT INTO Guilds(guildid, welcome, leave, roles, logging, blacklisted, disableditems, moderations, protected, ranks, tags, notes, events) VALUES('${
					guild.id
				}', '${new Schemas.Welcome().toString()}', '${new Schemas.Leave().toString()}', '${new Schemas.Roles().toString()}', '${new Schemas.Logging().toString()}', '${new Schemas.Blacklisted().toString()}', '${new Schemas.Disabled().toString()}', '${new Schemas.Moderations().toString()}', '${new Schemas.Protected().toString()}', '${new Schemas.Ranks().toString()}', '${new Schemas.Tags().toString()}', '${new Schemas.Notes().toString()}', '${new Schemas.Events().toString()}')`
			);
			await con.query(`COMMIT`);
		} finally {
			con.release();
		}
	}
}
