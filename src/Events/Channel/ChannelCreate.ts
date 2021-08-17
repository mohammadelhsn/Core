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

		const lang = await this.Translator.Getlang(guild.id);
		const { channelCreate } = await this.Settings.Events(guild.id);

		if (channelCreate.enabled == false) return;

		const log = (await client.channels.cache.get(
			channelCreate.channel
		)) as TextChannel;

		if (log == null) return;

		const cache = client.database.get(guild.id);

		const channels = [];

		const embed = await this.Embed.Base({
			iconURL: guild.iconURL({ dynamic: true }),
			title: this.Translator.Getstring(lang, 'new_action'),
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
					value: `\`${channel.createdAt.toLocaleString(lang, {
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
