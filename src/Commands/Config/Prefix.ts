import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message, Permissions } from 'discord.js';

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

		const oldPrefix = await this.Settings.Prefix(message.guild.id);

		const newPrefix = args[0];

		if (!newPrefix) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'Missing a required argument',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
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

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		const con = await this.con.connect();

		try {
			await con.query(`BEGIN`);
			await con.query(
				`UPDATE Guilds SET prefix = '${newPrefix}' WHERE guildId = '${message.guild.id}'`
			);
			await con.query(`COMMIT`);

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				success_message: 'Successfully updated the prefix!',
				fields: [
					{ name: 'Old prefix', value: `\`${oldPrefix}\`` },
					{ name: 'New prefix', value: `\`${newPrefix}\`` },
				],
			});

			return message.channel.send({ embeds: [embed] });
		} catch (error) {
			console.log(error);
		} finally {
			con.release();
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
