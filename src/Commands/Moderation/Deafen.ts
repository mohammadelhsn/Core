import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, Permissions } from 'discord.js';

export default class DeafenCommand extends BaseCommand {
	constructor() {
		super(
			'deafen',
			'moderation',
			[],
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
	async run(
		client: DiscordClient,
		message: Message,
		args: string[]
	): Promise<Message | void> {
		if (
			!message.member.permissions.has([
				Permissions.FLAGS.DEAFEN_MEMBERS || Permissions.FLAGS.ADMINISTRATOR,
			])
		) {
			const embed = await this.ErrorEmbed.UserPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				perms: ['DEAFEN_MEMBERS', 'ADMINISTRATOR'],
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		if (
			!message.guild.me.permissions.has(['DEAFEN_MEMBERS' || 'ADMINISTRATOR'])
		) {
			const embed = await this.ErrorEmbed.UserPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				perms: ['DEAFEN_MEMBERS', 'ADMINISTRATOR'],
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		const user = message.mentions.members.first();

		const reason = args.slice(1).join(' ') || 'No reason given.';

		if (user.id == message.author.id) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'You cannot deafen yourself!',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		if (user.id == client.user.id) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'I cannot deafen myself with this command. ',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		const { serverDeaf, channelId } = user.voice;

		if (!channelId || channelId == null) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'This user is not in a voice channel!',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		try {
			await user.voice.setDeaf(!serverDeaf, reason);
		} catch (e) {
			const embed = await this.ErrorEmbed.UnexpectedError({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		} finally {
			if (user.voice.deaf == true) {
				const embed = await this.SuccessEmbed.Base({
					iconURL: user.user.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `Successfully deafened ${user.user.tag}`,
				});

				return message.channel.send({ embeds: [embed] });
			}

			if (user.voice.deaf == false) {
				const embed = await this.SuccessEmbed.Base({
					iconURL: user.user.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `Successfully un-deafened ${user.user.tag}`,
				});

				return message.channel.send({ embeds: [embed] });
			}
		}
	}
}
