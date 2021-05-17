//import BaseEvent from '../../Utils/Structures/BaseEvent';
//import DiscordClient from '../../Client/Client';

export default class ReadyEvent extends BaseEvent {
	constructor() {
		super('ready');
	}
	async run(client: DiscordClient) {
		console.log('Bot has logged in.');
	}
}
