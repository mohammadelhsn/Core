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
		if (oldChannel.type == 'dm' || newChannel.type == 'dm') return;
	}
}
