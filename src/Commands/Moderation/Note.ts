import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, Permissions } from 'discord.js';

export default class NoteCommand extends BaseCommand {
	constructor() {
		super(
			'note',
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
				Permissions.FLAGS.MANAGE_GUILD || Permissions.FLAGS.ADMINISTRATOR,
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

		if (!identifier) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'You must specify some identifier to use for this note',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		const notes = await this.Settings.Notes(message.guild.id);

		for (let n of notes.data) {
			if (
				n.identifier.toLowerCase() == identifier.toLowerCase() &&
				n.userid == user.id
			) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message:
						'A note with this identifier already exists for this user',
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}
		}

		const content = args.slice(2).join(' ');

		if (!content) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'You must include some content for the note!',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		const note = {
			userid: user.id,
			identifier: identifier,
			content: content,
		};

		notes.data.push(note);

		const con = await this.con.connect();

		try {
			await con.query(`BEGIN`);
			await con.query(
				`UPDATE Guilds SET notes = '${notes.toString()}' WHERE guildid = '${
					message.guild.id
				}'`
			);
			await con.query(`COMMIT`);
		} finally {
			con.release();
		}

		const embed = await this.SuccessEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			id: message.guild.id,
			success_message: 'Successfully created a note!',
			fields: [
				{ name: 'Identifier', value: identifier },
				{ name: 'Content', value: content },
			],
		});

		return message.channel.send({ embeds: [embed] });
	}
}
