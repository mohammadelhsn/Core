import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Node } from 'erela.js';

export default class NodeErrorEvent extends BaseEvent {
	constructor() {
		super('nodeError');
	}
	async run(client: DiscordClient, node: Node, error: Error) {
		console.log(
			`Node ${node.options.identifier} had an error.\n${error.message}`
		);
	}
}
