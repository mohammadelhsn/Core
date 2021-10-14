import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	Message,
	TextChannel,
	Permissions,
	CommandInteraction,
} from 'discord.js';

export default class ClearCommand extends BaseCommand {
	constructor() {
		super(
			'clear',
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
	async run(client: DiscordClient, message: Message, args: string[]) {
		if (
			!message.member.permissions.has([
				Permissions.FLAGS.MANAGE_MESSAGES || Permissions.FLAGS.ADMINISTRATOR,
			])
		) {
			const embed = await this.ErrorEmbed.UserPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				perms: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return msg.delete({ timeout: 10000 });
		}

		if (
			!message.guild.me.permissions.has([
				Permissions.FLAGS.MANAGE_MESSAGES || Permissions.FLAGS.ADMINISTRATOR,
			])
		) {
			const embed = await this.ErrorEmbed.ClientPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				perms: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		if (!args[0] || isNaN(parseInt(args[0]))) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'You must provide a number!',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		const toClear = parseInt(args[0]);
		const mention = message.mentions.members.first();
		let reason = mention ? args.slice(2).join(' ') : args.slice(1).join(' ');

		if (!reason) reason = 'No reason given';

		if (toClear > 100) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'The max amount of messages is 100',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		if (mention) {
			const messages = await message.channel.messages.fetch({ limit: 100 });
			const toDelete: Message[] = [];

			const filtered = messages.filter((m) => m.author.id == mention.user.id);
			filtered.forEach((msg) => toDelete.push(msg));
			const deleting = toDelete.slice(0, toClear);

			try {
				await (message.channel as TextChannel).bulkDelete(deleting, true);
			} finally {
				const embed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `Successfully deleted ${toDelete.length} message(s)`,
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}
		}
		const messages = await message.channel.messages.fetch({ limit: 100 });
		const toDelete: Message[] = [];

		messages.forEach((m) => toDelete.push(m));

		const deleting = toDelete.slice(0, toClear);

		try {
			await (message.channel as TextChannel).bulkDelete(deleting, true);
		} finally {
			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				success_message: `Successfully deleted ${toDelete.length} message(s)`,
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
