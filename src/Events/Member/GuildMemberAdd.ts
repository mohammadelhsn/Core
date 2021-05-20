import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { GuildMember } from 'discord.js';

export default class GuildMemberAddEvent extends BaseEvent {
	constructor() {
		super('guildMemberAdd');
	}
	async run(client: DiscordClient, member: GuildMember) {}
}
