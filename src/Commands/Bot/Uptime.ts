import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

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
			['SEND_MESSAGES', 'EMBED_LINKS'],
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
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}
		const uptimeEmbed = await this.Embed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			title: `${client.user.username} uptime`,
			description: `I have been online for \`${this.Utils.Duration(
				client.uptime
			)}\``,
		});
		return message.channel.send({ embeds: [uptimeEmbed] });
	}
}
