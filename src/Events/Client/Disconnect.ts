import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import {} from 'discord.js';

export default class DisconnectEvent extends BaseEvent {
	constructor() {
		super('disconnect');
	}
	async run(client: DiscordClient) {
		//	console.log('Client disconnected from the websocket');
	}
}
