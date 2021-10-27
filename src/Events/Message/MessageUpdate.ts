import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class MessageUpdateEvent extends BaseEvent {
	constructor() {
		super('messageUpdate');
	}
	async run(client: DiscordClient, oldMessage: Message, newMessage: Message) {
		console.log(newMessage);
		console.log(oldMessage);
	}
}
