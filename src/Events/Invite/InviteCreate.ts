import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Invite } from 'discord.js';

export default class InviteCreateEvent extends BaseEvent {
	constructor() {
		super('inviteCreate');
	}
	async run(client: DiscordClient, invite: Invite) {
		//	console.log(invite);
	}
}
