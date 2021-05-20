import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Role } from 'discord.js';

export default class RoleUpdateEvent extends BaseEvent {
	constructor() {
		super('roleUpdate');
	}
	async run(client: DiscordClient, oldRole: Role, newRole: Role) {}
}
