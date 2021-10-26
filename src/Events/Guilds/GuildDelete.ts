import DiscordClient from '../../Client/Client';
import BaseEvent from '../../Utils/Structures/BaseEvent';
import { Guild, TextChannel } from 'discord.js';

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
		} catch (error) {
			console.log(error);
		} finally {
			con.release();
		}

		const logs = client.channels.cache.get('774251956184416258') as TextChannel;

		const embed = await this.Embed.Base({
			iconURL: guild.icon
				? guild.iconURL({ dynamic: true })
				: client.user.displayAvatarURL({ dynamic: true }),
			text: 'Core guilds',
			title: 'Core guilds',
			description: `Guild removed :(`,
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
