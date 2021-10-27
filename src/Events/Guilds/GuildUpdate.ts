import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Guild } from 'discord.js';

export default class GuildUpdateEvent extends BaseEvent {
	constructor() {
		super('guildUpdate');
	}
	async run(client: DiscordClient, oldGuild: Guild, newGuild: Guild) {
		console.log(oldGuild);
		console.log(newGuild);
	}
}
