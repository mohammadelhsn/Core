import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class PingCommand extends BaseCommand {
	constructor() {
		super(
			'ping',
			'bot',
			[],
			'',
			"Sends the bot's ping",
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

		const embed = await this.Embed.Base({
			iconURL: client.user.displayAvatarURL({ dynamic: true }),
			text: this,
			title: `${client.user.tag} ping`,
			description: '`Pinging...`',
		});

		const m = await message.channel.send({ embed: embed });

		const ping = m.createdTimestamp - message.createdTimestamp;

		const newEmbed = this.Embed.Base({
			iconURL: client.user.displayAvatarURL({ dynamic: true }),
			text: this,
			title: `Ping command`,
			description: `${client.user.tag} ping`,
			fields: [
				{ name: 'Latency', value: `\`${ping}\`` },
				{ name: 'Websocket ping', value: `\`${client.ws.ping}\`` },
			],
		});

		return m.edit(newEmbed);
	}
}
