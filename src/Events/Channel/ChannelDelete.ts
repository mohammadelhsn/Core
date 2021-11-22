import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { GuildChannel, DMChannel, TextChannel, Guild } from 'discord.js';

export default class ChannelDeleteEvent extends BaseEvent {
	constructor() {
		super('channelDelete');
	}
	async run(client: DiscordClient, channel: GuildChannel | DMChannel) {
		if (channel.type == 'DM') return;

		const { guild } = channel;

		const cache = await client.database.get(guild.id);

		if (cache.Events.channelDelete.isEnabled() == false) return;

		const log = (await cache.Events.channelDelete.Get()).channel;

		if (log == null) return;

		const embed = await this.Embed.Base({
			iconURL: guild.iconURL({ dynamic: true }),
			title: 'New action',
			text: 'Channel delete',
			description: 'Event: `Channel delete`',
			fields: [
				{ name: 'Channel name', value: `\`${channel.name}\`` },
				{
					name: 'Channel type',
					value: `\`${this.Utils.Capitalize(channel.type)}\``,
				},
				{ name: 'Channel ID', value: `\`${channel.id}\`` },
				{
					name: 'Deleted at',
					value: `\`${new Date().toLocaleString('en-CA', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}\``,
				},
			],
		});

		return log.send({ embeds: [embed] });
	}
}
