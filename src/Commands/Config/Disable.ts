import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class DisableCommand extends BaseCommand {
	constructor() {
		super(
			'disable',
			'config',
			[],
			'',
			'',
			'',
			[],
			[],
			[],
			[],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		// prettier-ignore
		const categories = {
			aww: 'aww',
			bot: 'bot',
			canvas: 'canvas',
			config: 'config',
			facts: 'facts',
			fun: 'fun',
			logging: 'logging',
			manager: 'manager',
			memes: 'memes',
			miscellaneous: 'miscellaneous',
			moderation: 'moderation',
			music: 'music',
			owner: 'owner',
			'reaction images': 'reaction images',
			'server utilities': 'server utilities',
		};
		//["music", "owner", "reaction images", "server utilities"]

		const toDisable = args.join(' ');

		const value: BaseCommand | string =
			client.commands.get(toDisable) ||
			client.commands.get(client.aliases.get(toDisable)) ||
			categories[`${toDisable}`];

		if (!value) {
			console.log("Specified thing doesn't exist!");
		}

		console.log(value);
	}
}
