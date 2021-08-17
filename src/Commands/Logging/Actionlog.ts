import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, Permissions } from 'discord.js';

export default class ActionlogCommand extends BaseCommand {
	constructor() {
		super(
			'actionlog',
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
				id: message.guild.id,
				text: this,
				perms: ['MANAGE_GUILD', 'ADMINISTRATOR'],
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		const toConfigure = args[0];

		const actionlog = await this.Channels.Actionlog(message.guild.id, true);

		if (!toConfigure) {
			const embed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				description: 'Actionlog current settings',
				fields: [
					{
						name: 'Enabled?',
						value:
							actionlog == null
								? this.Emojis.off_switch
								: this.Emojis.on_switch,
					},
					{
						name: 'Value',
						value:
							actionlog == null
								? '`N/A`'
								: this.Utils.Mentionchannel(actionlog),
					},
				],
			});

			return message.channel.send({ embeds: [embed] });
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

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			if (actionlog != null) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					error_message:
						"Action log is already enabled, use 'actionlog update #mention' instead!",
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT logging FROM Guilds WHERE guildid = '${message.guild.id}'`
				);
				if (res.rows.length == 0) return;
				const { data } = new this.Schemas.Logging(res.rows[0].logging);

				data.actionlog = mention.id;

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

				return message.channel.send({ embeds: [embed] });
			} finally {
				con.release();
			}

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				success_message: '```Successfully updated actionlog!```',
				fields: [
					{ name: 'Old value', value: '`Disabled`' },
					{ name: 'New value', value: this.Utils.Mentionchannel(mention.id) },
				],
			});

			return message.channel.send({ embeds: [embed] });
		}
		if (toConfigure.toLowerCase().includes('disable')) {
			if (actionlog == null) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					error_message:
						'Actionlog is already disabled, use !actionlog enable to enable it!',
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT logging FROM Guilds WHERE guildid = '${message.guild.id}'`
				);
				if (res.rows.length == 0) return;
				const { data } = new this.Schemas.Logging(res.rows[0].logging);

				data.actionlog = null;

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

				return message.channel.send({ embeds: [embed] });
			} finally {
				con.release();
			}

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				success_message: '```Successfully updated action-log```',
				fields: [
					{ name: 'Old value', value: this.Utils.Mentionchannel(actionlog) },
					{ name: 'New value', value: '`Disabled`' },
				],
			});

			return message.channel.send({ embeds: [embed] });
		}
		if (toConfigure.toLowerCase().includes('update')) {
			if (actionlog == null) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					error_message:
						"Actionlog is disabled! Use 'actionlog enable #mention' to enable it!",
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}
			const mention = message.mentions.channels.first();

			if (!mention) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					error_message: 'You are missing the required mention!',
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT logging FROM Guilds WHERE guildid = '${message.guild.id}'`
				);
				if (res.rows.length == 0) return;
				const { data } = new this.Schemas.Logging(res.rows[0].logging);

				data.actionlog = mention.id;

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

				return message.channel.send({ embeds: [embed] });
			} finally {
				con.release();
			}

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				success_message: '```Successfully updated action-log```',
				fields: [
					{ name: 'Old value', value: this.Utils.Mentionchannel(actionlog) },
					{ name: 'New value', value: this.Utils.Mentionchannel(mention.id) },
				],
			});

			return message.channel.send({ embeds: [embed] });
		}

		return await this.HelpEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			message: message,
			command: this,
		});
	}
}
