import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { GuildChannel, DMChannel } from 'discord.js';

export default class ChannelCreateEvent extends BaseEvent {
	constructor() {
		super('channelCreate');
	}
	async run(client: DiscordClient, channel: GuildChannel | DMChannel) {
		if (channel.type == 'dm') return;
	}
}
