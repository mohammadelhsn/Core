import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class UptimeCommand extends BaseCommand {
	constructor() {
		super(
			'uptime',
			'bot',
			[],
			'',
			"Sends the bot's uptime",
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
		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL(),
				command: this,
				accessor: message,
			});
		}
		const uptimeEmbed = await this.Embed.Base({
			accessor: message,
			text: this,
			title: `${client.user.username} uptime`,
			description: `I have been online for \`${this.Utils.Duration(
				client.uptime
			)}\``,
		});
		return message.channel.send({ embeds: [uptimeEmbed] });
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const uptimeEmbed = await this.Embed.Base({
			accessor: interaction,
			text: this,
			title: `${client.user.username} uptime`,
			description: `I have been online for \`${this.Utils.Duration(
				client.uptime
			)}\``,
		});
		return interaction.reply({ embeds: [uptimeEmbed] });
	}
}
