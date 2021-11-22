import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { GuildChannel, DMChannel, TextChannel } from 'discord.js';

export default class ChannelCreateEvent extends BaseEvent {
	constructor() {
		super('channelCreate');
	}
	async run(client: DiscordClient, channel: GuildChannel) {
		if (channel.type.toLowerCase() == 'dm') return;

		const { guild } = channel;

		const cache = client.database.get(guild.id);

		if (cache.Events.channelCreate.isEnabled() == false) return;

		const log = (await cache.Events.channelCreate.Get()).channel;

		if (log == null) return;

		const embed = await this.Embed.Base({
			iconURL: guild.iconURL({ dynamic: true }),
			title: 'New action',
			text: 'Channel create',
			description: 'Event: `Channel created`',
			fields: [
				{ name: 'Channel name', value: `\`${channel.name}\`` },
				{
					name: 'Channel type',
					value: `\`${this.Utils.Capitalize(channel.type)}\``,
				},
				{ name: 'Channel ID', value: `${channel.id}` },
				{
					name: 'Created at',
					value: `\`${channel.createdAt.toLocaleString('en-CA', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}\``,
				},
			],
		});

		return await log.send({ embeds: [embed] });
	}
}
