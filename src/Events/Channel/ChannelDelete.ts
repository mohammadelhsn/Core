import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { GuildChannel, DMChannel } from 'discord.js';

export default class ChannelDeleteEvent extends BaseEvent {
	constructor() {
		super('channelDelete');
	}
	async run(client: DiscordClient, channel: GuildChannel | DMChannel) {
		if (channel.type == 'dm') return;
	}
}
