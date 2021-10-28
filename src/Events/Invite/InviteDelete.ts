import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Invite } from 'discord.js';

export default class InviteDeleteEvent extends BaseEvent {
	constructor() {
		super('inviteDelete');
	}
	async run(client: DiscordClient, invite: Invite) {
		//	console.log(invite);
	}
}
