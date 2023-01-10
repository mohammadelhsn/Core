import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class InviteCommand extends BaseCommand {
	constructor() {
		super(
			'invite',
			'bot',
			[],
			'',
			"Sends the bot's invite",
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
		const embed = await this.Embed.Base({
			iconURL: client.user.displayAvatarURL(),
			text: this,
			title: `${client.user.username} invite`,
			description: `[Invite me!](https://discord.com/oauth2/authorize?client_id=704034868547289089&permissions=4294438903&scope=bot%20applications.commands)`,
		});

		return message.reply({ embeds: [embed] });
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const embed = await this.Embed.Base({
			iconURL: client.user.displayAvatarURL(),
			text: this,
			title: `${client.user.username} invite`,
			description: `[Invite me!](https://discord.com/oauth2/authorize?client_id=704034868547289089&permissions=4294438903&scope=bot%20applications.commands)`,
		});

		return interaction.reply({ embeds: [embed] });
	}
}
