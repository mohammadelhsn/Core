import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, MessageEmbed } from 'discord.js';

export default class TesstCommand extends BaseCommand {
	constructor() {
		super('tesst', 'miscellaneous', []);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const colour = this.Colour.Set();

		console.log(colour);

		const embed = new MessageEmbed().setDescription('a').setColor(colour);

		return message.channel.send({ embed: embed });
	}
}
