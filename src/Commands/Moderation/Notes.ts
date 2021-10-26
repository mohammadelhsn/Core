import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message, Permissions } from 'discord.js';

export default class NotesCommand extends BaseCommand {
	constructor() {
		super(
			'notes',
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
				Permissions.FLAGS.ADMINISTRATOR || Permissions.FLAGS.MANAGE_GUILD,
			])
		) {
			const embed = await this.ErrorEmbed.UserPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				perms: ['MANAGE_GUILD', 'ADMINISTRATOR'],
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		if (!args[0]) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'You must specify a user!',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		const user =
			message.mentions.members.first() ||
			message.guild.members.cache.find((u) => u.id == args[0]) ||
			message.guild.members.cache.find((u) => u.user.username == args[0]) ||
			message.guild.members.cache.find((u) => u.nickname == args[0]);

		if (!user) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: "I couldn't find this user!",
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		const identifier = args[1];

		const notes = await this.Settings.Notes(message.guild.id);

		if (identifier) {
			const filtered = notes.data.filter(
				(note) =>
					note.identifier.toLowerCase() == identifier.toLowerCase() &&
					note.userid == user.id
			);

			if (filtered.length > 0) {
				const index = filtered[0];

				const noted = message.guild.members.cache.get(index.userid);

				const embed = this.Embed.Base({
					iconURL: noted.user.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Notes command | ${identifier}`,
					description: `Content: ${index.content}`,
				});

				return message.channel.send({ embeds: [embed] });
			}

			if (filtered.length == 0) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message:
						"I couldn't find this note for this user with this identifier",
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}
		}

		const filtered = notes.data.filter((note) => note.userid == user.id);

		const embeds = [];

		const noted = message.guild.members.cache.get(user.id);

		if (filtered.length == 1) {
			const note = filtered[0];

			const embed = this.Embed.Base({
				iconURL: noted.user.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `Notes command | ${note.identifier}`,
				description: `Content: ${note.content}`,
			});

			return message.channel.send({ embeds: [embed] });
		}

		if (filtered.length == 0) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: "I couldn't find any notes for this user!",
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		for (let note of filtered) {
			const embed = this.Embed.Base({
				iconURL: noted.user.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `Notes command | ${note.identifier}`,
				description: `Content: ${note.content}`,
			});

			embeds.push(embed);
		}

		return await this.Utils.Paginate({
			accessor: message,
			embeds: embeds,
			timeout: 600000,
		});
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
