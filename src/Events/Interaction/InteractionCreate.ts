import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Interaction } from 'discord.js';

export default class Event extends BaseEvent {
	constructor() {
		super('interactionCreate');
	}
	async run(client: DiscordClient, interaction: Interaction) {
		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);
			// @ts-ignore
			await command.slash(interaction);
		}
	}
}
