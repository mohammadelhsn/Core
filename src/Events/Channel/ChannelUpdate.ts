import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { DMChannel, GuildChannel } from 'discord.js';

export default class ChannelUpdateEvent extends BaseEvent {
	constructor() {
		super('channelUpdate');
	}
	async run(
		client: DiscordClient,
		oldChannel: DMChannel | GuildChannel,
		newChannel: DMChannel | GuildChannel
	) {
		if (oldChannel.type == 'DM' || newChannel.type == 'DM') return;

		const { guild } = newChannel;

		const { channelUpdate } = await this.Settings.Events(guild.id);

		if (channelUpdate.enabled == false) return;
	}
}
