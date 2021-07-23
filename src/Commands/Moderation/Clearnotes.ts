import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class ClearNotesCommand extends BaseCommand {
	constructor() {
		super(
			'clearnotes',
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
	): Promise<Message> {
		if (!message.member.hasPermission(['ADMINISTRATOR'])) {
			const embed = await this.ErrorEmbed.UserPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				perms: ['ADMINISTRATOR'],
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		const user = message.mentions.members.first();

		if (user) {
			const oldNotes = await this.Settings.Notes(message.guild.id);
			const newNotes = [];

			const usernotes = oldNotes.data.filter((note) => note.userid == user.id);

			if (usernotes.length == 0) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message:
						'There are notes for this user, so there is nothing to clear!',
				});

				const msg = await message.channel.send({ embed: embed });
				return msg.delete({ timeout: 10000 });
			}

			for (let note of oldNotes.data) {
				if (note.userid != user.id) newNotes.push(note);
			}

			const data = await new this.Schemas.Notes(newNotes);

			const con = await this.con.connect();

			try {
				await con.query(`BEGIN`);
				await con.query(
					`UPDATE Guilds SET notes = '${data.toString()}' WHERE guildid = '${
						message.guild.id
					}'`
				);
				await con.query(`COMMIT`);
			} catch (e) {
				console.log(e);
			} finally {
				con.release();
			}

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				success_message: `Successfully cleared all notes for ${this.Utils.Mentionuser(
					user.id
				)}`,
			});

			return message.channel.send({ embed: embed });
		}

		const newNotes = await new this.Schemas.Notes();

		const con = await this.con.connect();

		try {
			await con.query(`BEGIN`);
			await con.query(
				`UPDATE Guilds SET notes = '${newNotes.toString()}' WHERE guildid = '${
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
			success_message: `Successfully deleted all notes for this guild!`,
		});

		return message.channel.send({ embed: embed });
	}
}
