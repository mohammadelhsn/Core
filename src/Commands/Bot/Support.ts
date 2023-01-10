import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class SupportCommand extends BaseCommand {
	constructor() {
		super(
			'support',
			'bot',
			[],
			'',
			'Sends an invite to the support server',
			'',
			[],
			[],
			['SendMessages', 'EmbedLinks'],
			[],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		return message.channel.send({ content: 'Support server WIP' });
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		return interaction.reply({ content: 'Support server WIP' });
	}
}
