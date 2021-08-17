import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { GuildChannel, DMChannel, TextChannel } from 'discord.js';

export default class ChannelDeleteEvent extends BaseEvent {
	constructor() {
		super('channelDelete');
	}
	async run(client: DiscordClient, channel: GuildChannel | DMChannel) {
		if (channel.type == 'DM') return;

		const { guild } = channel;

		const lang = await this.Translator.Getlang(guild.id);

		const { channelDelete } = await this.Settings.Events(guild.id);

		if (channelDelete.enabled == false) return;

		const log = (await client.channels.cache.get(
			channelDelete.channel
		)) as TextChannel;

		if (log == null) return;

		const embed = await this.Embed.Base({
			iconURL: guild.iconURL({ dynamic: true }),
			title: this.Translator.Getstring(lang, 'new_action'),
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
					value: `\`${new Date().toLocaleString(lang, {
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
