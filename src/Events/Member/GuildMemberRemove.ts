import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { GuildMember } from 'discord.js';

export default class GuildMemberRemoveEvent extends BaseEvent {
	constructor() {
		super('guildMemberRemove');
	}
	async run(client: DiscordClient, member: GuildMember) {
		const guild = member.guild;
	}
}
