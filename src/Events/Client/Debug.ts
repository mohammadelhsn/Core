import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import {} from 'discord.js';

export default class Event extends BaseEvent {
	constructor() {
		super('debug');
	}
	async run(client: DiscordClient, info: string) {
		console.log(info);
	}
}
