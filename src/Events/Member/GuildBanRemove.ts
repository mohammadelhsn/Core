import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Guild, User } from 'discord.js';

export default class GuildBanRemoveEvent extends BaseEvent {
	constructor() {
		super('guildBanRemove');
	}
	async run(client: DiscordClient, guild: Guild, user: User) {
		///	console.log(guild);
		//	console.log(user);
	}
}
