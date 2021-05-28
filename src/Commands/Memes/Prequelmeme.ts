import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class PrequelmemeCommand extends BaseCommand {
	constructor() {
		super(
			'prequelmeme',
			'memes',
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
			'WIP'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {}
}