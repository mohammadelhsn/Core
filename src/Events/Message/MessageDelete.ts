import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class MessageDeleteEvent extends BaseEvent {
	constructor() {
		super('messageDelete');
	}
	async run(client: DiscordClient, message: Message) {
		const guild = message.guild;
	}
}
