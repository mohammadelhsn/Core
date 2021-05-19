import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Node } from 'erela.js';

export default class NodeConnectEvent extends BaseEvent {
	constructor() {
		super('nodeConnect');
	}
	async run(client: DiscordClient, node: Node) {
		console.log(`Node ${node.options.identifier} connected`);
	}
}
