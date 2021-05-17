import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class PrefixCommand extends BaseCommand {
	constructor() {
		super(
			'prefix',
			'config',
			[],
			'',
			'',
			'',
			[],
			[],
			[],
			['MANAGE_MESSAGES'],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		if (!message.member.hasPermission(['MANAGE_MESSAGES' || 'ADMINISTRATOR'])) {
			const embed = await this.ErrorEmbed.UserPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		const newPrefix = args[0];

		if (!newPrefix) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'Missing a required argument',
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		if (newPrefix.toLowerCase() == 'help') {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		if (newPrefix.length > 3) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'Prefix is too long! The max length is 3!',
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		const con = await this.con.connect();

		try {
			await con.query(`BEGIN`);
			await con.query(
				`UPDATE guildconfigurable SET prefix = '${newPrefix}' WHERE guildId = '${message.guild.id}'`
			);
			await con.query(`COMMIT`);

			const prefix = await this.Settings.Prefix(message.guild.id);

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				success_message: 'Successfully updated the prefix!',
				fields: [
					{ name: 'Old prefix', value: `\`${prefix}\`` },
					{ name: 'New prefix', value: `\`${newPrefix}\`` },
				],
			});

			return message.channel.send({ embed: embed });
		} catch (error) {
			console.log(error);
		} finally {
			con.release();
		}
	}
}
