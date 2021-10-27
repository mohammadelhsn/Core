import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Role } from 'discord.js';

export default class RoleDeleteEvent extends BaseEvent {
	constructor() {
		super('roleDelete');
	}
	async run(client: DiscordClient, role: Role) {
		console.log(role);
	}
}
