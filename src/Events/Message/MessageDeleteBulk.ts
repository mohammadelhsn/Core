import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Collection, Message } from 'discord.js';

export default class MessageDeleteBulkEvent extends BaseEvent {
	constructor() {
		super('messageDeleteBulk');
	}
	async run(client: DiscordClient, messages: Collection<Message, Message>) {
		console.log(messages);
	}
}
