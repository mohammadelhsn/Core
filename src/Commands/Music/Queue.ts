import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, User } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';

export default class QueueCommand extends BaseCommand {
	constructor() {
		super(
			'queue',
			'music',
			['q'],
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
		const lang = await this.Translator.Getlang(message.guild.id);

		const player = client.manager.get(message.guild.id);

		if (!player) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'There is nothing playing',
			});
			const msg = await message.channel.send({ embed: errorEmbed });
			return msg.delete({ timeout: 10000 });
		}

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		let index = 1;
		let string = '';
		if (player.queue.current)
			string += `**__Currently playing__**\n ${
				player.queue.current.title
			} - Requested by: \`${
				(player.queue.current.requester as User).tag
			}\`. | Duration: \`${prettyMilliseconds(
				player.queue.current.duration
			)}\` \n`;
		if (player.queue[0]) {
			string += `__**Rest of queue:**__\n ${player.queue
				.slice(0, 10)
				.map(
					(x) =>
						`**${index++})** ${x.title} - **Requested by ${
							(x.requester as User).username
						}**.`
				)
				.join('\n')}`;
		}

		const embed = await this.Embed.Base({
			iconURL: player.queue.current.thumbnail,
			text: this,
			title: `Queue for ${message.guild.name}`,
			description: string,
			image: player.queue.current.thumbnail,
			link: player.queue.current.uri,
		});
		return message.channel.send({ embed: embed });
	}
}
