import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class ShuffleCommand extends BaseCommand {
	constructor() {
		super(
			'shuffle',
			'music',
			[],
			'',
			'Toggle shuffle on and off for the queue',
			'',
			[],
			[],
			['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT'],
			['CONNECT'],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				error_message: 'You must be in a voice channel',
				text: this,
			});

			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return msg.delete({ timeout: 10000 });
		}

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				message: message,
				command: this,
			});
		}

		const player = client.manager.players.get(message.guild.id);
		if (!player) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'There are no active players at the moment',
			});

			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return this.Utils.Delete(msg);
		}

		if (voiceChannel.id !== player.options.voiceChannel) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: "You're not in the bots voice channel",
			});

			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return this.Utils.Delete(msg);
		}
		//🔁

		try {
			player.queue.shuffle();
		} catch (e) {
			console.log(e);

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});
			return message.channel.send({ embeds: [errEmbed] });
		}

		const successEmbed = await this.SuccessEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			text: this,
			success_message: '```Successfully shuffled the queue! 🔀```',
		});

		return message.channel.send({ embeds: [successEmbed] });
	}
}
