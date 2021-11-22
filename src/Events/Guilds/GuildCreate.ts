import DiscordClient from '../../Client/Client';
import BaseEvent from '../../Utils/Structures/BaseEvent';
import { Guild, TextChannel } from 'discord.js';
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
				`INSERT INTO Guilds(guildid, welcome, leave, roles, logging, blacklisted, disableditems, moderations, protected, ranks, tags, notes, events, timers, reminders) VALUES('${
					guild.id
				}', '${new Schemas.Welcome().toString()}', '${new Schemas.Leave().toString()}', '${new Schemas.Roles().toString()}', '${new Schemas.Logging().toString()}', '${new Schemas.Blacklisted().toString()}', '${new Schemas.Disabled().toString()}', '${new Schemas.Moderations().toString()}', '${new Schemas.Protected().toString()}', '${new Schemas.Ranks().toString()}', '${new Schemas.Tags().toString()}', '${new Schemas.Notes().toString()}', '${new Schemas.Events().toString()}', '${new Schemas.Timers().toString()}', '${new Schemas.Reminders().toString()}')`
			);
			await con.query(`COMMIT`);
		} finally {
			con.release();
		}

		const logs = client.channels.cache.get('774251956184416258') as TextChannel;

		const embed = this.Embed.Base({
			iconURL: guild.icon
				? guild.iconURL({ dynamic: true })
				: client.user.displayAvatarURL({ dynamic: true }),
			text: 'Core guilds',
			title: 'Core guilds',
			description: `New guild added`,
			fields: [
				{ name: 'Guild name', value: `\`${guild.name}\`` },
				{ name: 'Guild ID', value: `\`${guild.id}\`` },
				{
					name: 'Guild owner',
					value: `\`${(await guild.fetchOwner()).user.tag}\``,
				},
				{ name: 'Guild owner ID', value: `\`${guild.ownerId}\`` },
				{ name: 'Guild membercount', value: `\`${guild.memberCount}\`` },
			],
			accessor: null,
		});

		return logs.send({ embeds: [embed] });
	}
}
