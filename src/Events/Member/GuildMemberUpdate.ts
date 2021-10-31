import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { GuildMember } from 'discord.js';

export default class GuildMemberUpdateEvent extends BaseEvent {
	constructor() {
		super('guildMemberUpdate');
	}
	async run(
		client: DiscordClient,
		oldMember: GuildMember,
		newMember: GuildMember
	) {
		const guild = newMember.guild;
	}
}
