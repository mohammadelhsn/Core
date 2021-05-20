import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import {} from 'discord.js';

export default class ErrorEvent extends BaseEvent {
	constructor() {
		super('error');
	}
	async run(client: DiscordClient, error: Error) {
		console.log(error);
	}
}
