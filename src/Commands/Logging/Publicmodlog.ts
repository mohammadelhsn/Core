import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class PublicModlogCommand extends BaseCommand {
	constructor() {
		super(
			'publicmodlog',
			'logging',
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
			'WIP'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		if (!message.member.hasPermission(['MANAGE_GUILD' || 'ADMINISTRATOR'])) {
			const embed = await this.ErrorEmbed.UserPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		const toConfigure = args[0];

		const publicmodlog = await this.Channels.Publicmodlog(
			message.guild.id,
			true
		);

		if (!toConfigure) {
			const embed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				description: 'Publicmodlog current settings',
				fields: [
					{
						name: 'Enabled?',
						value:
							publicmodlog == null
								? this.Emojis.off_switch
								: this.Emojis.on_switch,
					},
					{
						name: 'Value',
						value:
							publicmodlog == null
								? '`N/A`'
								: this.Utils.Mentionchannel(publicmodlog),
					},
				],
			});

			return message.channel.send({ embed: embed });
		}

		if (toConfigure.toLowerCase().includes('enable')) {
			const mention = message.mentions.channels.first();

			if (!mention) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					error_message: 'You are missing the required mention!',
				});

				const msg = await message.channel.send({ embed: embed });
				return msg.delete({ timeout: 10000 });
			}

			if (publicmodlog != null) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					error_message:
						"Public mod log is already enabled, use 'publicmodlog update #mention' instead!",
				});

				const msg = await message.channel.send({ embed: embed });
				return msg.delete({ timeout: 10000 });
			}

			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT logging FROM Guilds WHERE guildid = '${message.guild.id}'`
				);
				if (res.rows.length == 0) return;
				const { data } = new this.Schemas.Logging(res.rows[0].logging);

				data.publicmodlog = mention.id;

				const newData = new this.Schemas.Logging(data).toString();

				await con.query(`BEGIN`);
				await con.query(
					`UPDATE Guilds SET Logging = '${newData}' WHERE guildid = '${message.guild.id}'`
				);
				await con.query(`COMMIT`);
			} catch (error) {
				if (typeof error == 'object') return;
				console.log(error);

				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return message.channel.send({ embed: embed });
			} finally {
				con.release();
			}

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				success_message: '```Successfully updated publicmodlog!```',
				fields: [
					{ name: 'Old value', value: '`Disabled`' },
					{ name: 'New value', value: this.Utils.Mentionchannel(mention.id) },
				],
			});

			return message.channel.send({ embed: embed });
		}
		if (toConfigure.toLowerCase().includes('disable')) {
			if (publicmodlog == null) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					error_message:
						"Publicmodlog is already disabled, use 'publicmodlog enable #mention' to enable it!",
				});

				const msg = await message.channel.send({ embed: embed });
				return msg.delete({ timeout: 10000 });
			}

			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT logging FROM Guilds WHERE guildid = '${message.guild.id}'`
				);
				if (res.rows.length == 0) return;
				const { data } = new this.Schemas.Logging(res.rows[0].logging);

				data.publicmodlog = null;

				const newData = new this.Schemas.Logging(data).toString();

				await con.query(`BEGIN`);
				await con.query(
					`UPDATE Guilds SET Logging = '${newData}' WHERE guildid = '${message.guild.id}'`
				);
				await con.query(`COMMIT`);
			} catch (error) {
				if (typeof error == 'object') return;
				console.log(error);

				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return message.channel.send({ embed: embed });
			} finally {
				con.release();
			}

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				success_message: '```Successfully updated public mod log```',
				fields: [
					{ name: 'Old value', value: this.Utils.Mentionchannel(publicmodlog) },
					{ name: 'New value', value: '`Disabled`' },
				],
			});

			return message.channel.send({ embed: embed });
		}
		if (toConfigure.toLowerCase().includes('update')) {
			if (publicmodlog == null) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					error_message:
						"Public mod log is disabled! Use 'publicmodlog enable #mention' to enable it!",
				});

				const msg = await message.channel.send({ embed: embed });
				return msg.delete({ timeout: 10000 });
			}
			const mention = message.mentions.channels.first();

			if (!mention) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					error_message: 'You are missing the required mention!',
				});

				const msg = await message.channel.send({ embed: embed });
				return msg.delete({ timeout: 10000 });
			}

			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT logging FROM Guilds WHERE guildid = '${message.guild.id}'`
				);
				if (res.rows.length == 0) return;
				const { data } = new this.Schemas.Logging(res.rows[0].logging);

				data.publicmodlog = mention.id;

				const newData = new this.Schemas.Logging(data).toString();

				await con.query(`BEGIN`);
				await con.query(
					`UPDATE Guilds SET Logging = '${newData}' WHERE guildid = '${message.guild.id}'`
				);
				await con.query(`COMMIT`);
			} catch (error) {
				if (typeof error == 'object') return;
				console.log(error);

				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return message.channel.send({ embed: embed });
			} finally {
				con.release();
			}

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				success_message: '```Successfully updated public mod log```',
				fields: [
					{ name: 'Old value', value: this.Utils.Mentionchannel(publicmodlog) },
					{ name: 'New value', value: this.Utils.Mentionchannel(mention.id) },
				],
			});

			return message.channel.send({ embed: embed });
		}

		return await this.HelpEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			message: message,
			command: this,
		});
	}
}
