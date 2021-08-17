import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class DelnoteCommand extends BaseCommand {
	constructor() {
		super(
			'delnote',
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
		const user = message.mentions.members.first();

		const identifier = args[1];

		if (!user) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'You have to mention a user!',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		if (!identifier) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'You must specifiy the identifier for the note',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		const notes = await this.Settings.Notes(message.guild.id);

		const index = notes.data.filter(
			(note) =>
				note.userid == user.id &&
				note.identifier.toLowerCase() == identifier.toLowerCase()
		);

		if (index.length == 0) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: "Oops, looks like this note doesn't exist!",
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		const newArray = [];

		for (let note of notes.data) {
			if (note != index[0]) newArray.push(note);
		}

		const newData = new this.Schemas.Notes(newArray);

		const con = await this.con.connect();

		try {
			await con.query(`BEGIN`);
			await con.query(
				`UPDATE Guilds SET notes = '${newData.toString()}' WHERE guildid = '${
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
			success_message: `Successfully deleted note ${identifier} on ${user.user.tag}`,
		});

		return message.channel.send({ embeds: [embed] });
	}
}
