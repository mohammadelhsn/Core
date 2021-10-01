import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class LoopCommand extends BaseCommand {
	constructor() {
		super(
			'loop',
			'music',
			[],
			'',
			'Starts looping the current song',
			'',
			[],
			[],
			['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT'],
			['CONNECT'],
			true,
			false,
			false,
			3000,
			'WIP'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'You must be in a voice channel',
			});
			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return msg.delete({ timeout: 1000 });
		}

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		const player = client.manager.players.get(message.guild.id);

		if (!player) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
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

		if (player.trackRepeat == false) {
			try {
				player.setTrackRepeat(true);

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					success_message: '```Successfully enabled loop! 🔁```',
				});
				return message.channel.send({ embeds: [successEmbed] });
			} catch (e) {
				console.log(e);

				const errEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});
				return message.channel.send({ embeds: [errEmbed] });
			}
		} else {
			try {
				player.setTrackRepeat(false);

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					success_message: '```Successfully disabled loop! 🔁```',
				});
				return message.channel.send({ embeds: [successEmbed] });
			} catch (e) {
				console.log(e);

				const errEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});
				return message.channel.send({ embeds: [errEmbed] });
			}
		}
	}
}
