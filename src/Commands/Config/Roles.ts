import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class RolesCommand extends BaseCommand {
	constructor() {
		super(
			'roles',
			'config',
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
		const toUpdate = args[0];
		const newValue =
			message.mentions.roles.first() ||
			message.guild.roles.cache.find((r) => r.name == args[1]) ||
			message.guild.roles.cache.find((r) => r.id == args[1]);

		if (!toUpdate) {
			const adminrole = await this.Settings.Adminrole(message.guild.id, true);
			const muterole = await this.Settings.Muterole(message.guild.id, true);
			const modrole = await this.Settings.Modrole(message.guild.id, true);
			const warningrole = await this.Settings.Warningrole(
				message.guild.id,
				true
			);

			const embed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				description: `Role settings for ${message.guild.name}`,
				fields: [
					{
						name: 'Admin role',
						value:
							adminrole == null
								? this.Emojis.off_switch
								: `${this.Emojis.on_switch} | ${this.Utils.Mentionrole(
										adminrole
								  )}`,
					},
					{
						name: 'Mute role',
						value:
							muterole == null
								? this.Emojis.off_switch
								: `${this.Emojis.on_switch} | ${this.Utils.Mentionrole(
										muterole
								  )}`,
					},
					{
						name: 'Mod role',
						value:
							modrole == null
								? this.Emojis.off_switch
								: `${this.Emojis.on_switch} | ${this.Utils.Mentionrole(
										modrole
								  )}`,
					},
					{
						name: 'Warning role',
						value:
							warningrole == null
								? this.Emojis.off_switch
								: `${this.Emojis.on_switch} | ${this.Utils.Mentionrole(
										warningrole
								  )}`,
					},
				],
			});

			return message.channel.send({ embed: embed });
		}

		if (
			toUpdate != 'admin' &&
			toUpdate != 'mod' &&
			toUpdate != 'warning' &&
			toUpdate != 'mute'
		) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				error_message: 'Not the right choice',
				text: this,
			});

			const msg: Message = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		const con = await this.con.connect();

		try {
			const current = await con.query(
				`SELECT roles FROM Guilds WHERE guildid = '${message.guild.id}'`
			);
			const data = new this.Schemas.Roles(current.rows[0].roles);
			const oldValue = new this.Schemas.Roles(current.rows[0].roles);

			if (toUpdate == 'mute') {
				if (newValue) {
					if (newValue.id == message.guild.id) {
						const embed = await this.ErrorEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
							error_message:
								'You cannot set the muterole to the @everyone role',
						});

						const msg = await message.channel.send({ embed: embed });
						return msg.delete({ timeout: 10000 });
					}

					if (data.data.muterole == newValue.id) {
						const embed = await this.ErrorEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
							error_message: 'Muterole is already set to that value!',
						});

						const msg = await message.channel.send({ embed: embed });
						return msg.delete({ timeout: 10000 });
					}

					data.data.muterole = newValue.id;

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET roles = '${data.toString()}' WHERE guildid = '${
							message.guild.id
						}'`
					);
					await con.query(`COMMIT`);

					const embed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `Successfully ${
							oldValue.data.muterole == null ? 'enabled' : 'updated'
						} muterole`,
						fields: [
							{
								name: 'Old value:',
								value: `${
									oldValue.data.muterole == null
										? '`Disabled`'
										: this.Utils.Mentionrole(oldValue.data.muterole)
								}`,
							},
							{
								name: 'New value',
								value: `${this.Utils.Mentionrole(data.data.muterole)}`,
							},
						],
					});

					return message.channel.send({ embed: embed });
				}
				if (data.data.muterole == null) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						error_message: 'Muterole is already disabled!',
					});

					const msg = await message.channel.send({ embed: embed });
					return msg.delete({ timeout: 10000 });
				}

				data.data.muterole = null;

				await con.query(`BEGIN`);
				await con.query(
					`UPDATE Guilds SET roles = '${data.toString()}' WHERE guildid = '${
						message.guild.id
					}'`
				);
				await con.query(`COMMIT`);

				const embed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `Successfully ${
						oldValue.data.muterole == null ? 'enabled' : 'updated'
					} muterole`,
					fields: [
						{
							name: 'Old value:',
							value: `${this.Utils.Mentionrole(oldValue.data.muterole)}`,
						},
						{
							name: 'New value',
							value: `\`Disabled\``,
						},
					],
				});

				return message.channel.send({ embed: embed });
			}
			if (toUpdate == 'admin') {
				if (newValue) {
					if (newValue.id == message.guild.id) {
						const embed = await this.ErrorEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
							error_message:
								'You cannot set the adminrole to the @everyone role',
						});

						const msg = await message.channel.send({ embed: embed });
						return msg.delete({ timeout: 10000 });
					}

					if (data.data.adminrole == newValue.id) {
						const embed = await this.ErrorEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
							error_message: 'Adminrole is already set to that value!',
						});

						const msg = await message.channel.send({ embed: embed });
						return msg.delete({ timeout: 10000 });
					}

					data.data.adminrole = newValue.id;

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET roles = '${data.toString()}' WHERE guildid = '${
							message.guild.id
						}'`
					);
					await con.query(`COMMIT`);

					const embed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `Successfully ${
							oldValue.data.adminrole == null ? 'enabled' : 'updated'
						} adminrole`,
						fields: [
							{
								name: 'Old value:',
								value: `${
									oldValue.data.adminrole == null
										? '`Disabled`'
										: this.Utils.Mentionrole(oldValue.data.adminrole)
								}`,
							},
							{
								name: 'New value',
								value: `${this.Utils.Mentionrole(data.data.adminrole)}`,
							},
						],
					});

					return message.channel.send({ embed: embed });
				}
				if (data.data.adminrole == null) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						error_message: 'Adminrole is already disabled!',
					});

					const msg = await message.channel.send({ embed: embed });
					return msg.delete({ timeout: 10000 });
				}

				data.data.adminrole = null;

				await con.query(`BEGIN`);
				await con.query(
					`UPDATE Guilds SET roles = '${data.toString()}' WHERE guildid = '${
						message.guild.id
					}'`
				);
				await con.query(`COMMIT`);

				const embed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `Successfully ${
						oldValue.data.adminrole == null ? 'enabled' : 'updated'
					} adminrole`,
					fields: [
						{
							name: 'Old value:',
							value: `${this.Utils.Mentionrole(oldValue.data.adminrole)}`,
						},
						{
							name: 'New value',
							value: `\`Disabled\``,
						},
					],
				});

				return message.channel.send({ embed: embed });
			}
			if (toUpdate == 'warning') {
				if (newValue) {
					if (newValue.id == message.guild.id) {
						const embed = await this.ErrorEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
							error_message:
								'You cannot set the warningrole to the @everyone role',
						});

						const msg = await message.channel.send({ embed: embed });
						return msg.delete({ timeout: 10000 });
					}

					if (data.data.warningrole == newValue.id) {
						const embed = await this.ErrorEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
							error_message: 'Warning role is already set to that value!',
						});

						const msg = await message.channel.send({ embed: embed });
						return msg.delete({ timeout: 10000 });
					}

					data.data.warningrole = newValue.id;

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET roles = '${data.toString()}' WHERE guildid = '${
							message.guild.id
						}'`
					);
					await con.query(`COMMIT`);

					const embed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `Successfully ${
							oldValue.data.warningrole == null ? 'enabled' : 'updated'
						} warning role`,
						fields: [
							{
								name: 'Old value:',
								value: `${
									oldValue.data.warningrole == null
										? '`Disabled`'
										: this.Utils.Mentionrole(oldValue.data.warningrole)
								}`,
							},
							{
								name: 'New value',
								value: `${this.Utils.Mentionrole(data.data.warningrole)}`,
							},
						],
					});

					return message.channel.send({ embed: embed });
				}
				if (data.data.warningrole == null) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						error_message: 'Warning role is already disabled!',
					});

					const msg = await message.channel.send({ embed: embed });
					return msg.delete({ timeout: 10000 });
				}

				data.data.warningrole = null;

				await con.query(`BEGIN`);
				await con.query(
					`UPDATE Guilds SET roles = '${data.toString()}' WHERE guildid = '${
						message.guild.id
					}'`
				);
				await con.query(`COMMIT`);

				const embed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `Successfully ${
						oldValue.data.warningrole == null ? 'enabled' : 'updated'
					} warning role`,
					fields: [
						{
							name: 'Old value:',
							value: `${this.Utils.Mentionrole(oldValue.data.warningrole)}`,
						},
						{
							name: 'New value',
							value: `\`Disabled\``,
						},
					],
				});

				return message.channel.send({ embed: embed });
			}
			if (toUpdate == 'mod') {
				if (newValue) {
					if (newValue.id == message.guild.id) {
						const embed = await this.ErrorEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
							error_message: 'You cannot set the modrole to the @everyone role',
						});

						const msg = await message.channel.send({ embed: embed });
						return msg.delete({ timeout: 10000 });
					}

					if (data.data.modrole == newValue.id) {
						const embed = await this.ErrorEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
							error_message: 'Mod role is already set to that value!',
						});

						const msg = await message.channel.send({ embed: embed });
						return msg.delete({ timeout: 10000 });
					}

					data.data.modrole = newValue.id;

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET roles = '${data.toString()}' WHERE guildid = '${
							message.guild.id
						}'`
					);
					await con.query(`COMMIT`);

					const embed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `Successfully ${
							oldValue.data.modrole == null ? 'enabled' : 'updated'
						} mod role`,
						fields: [
							{
								name: 'Old value:',
								value: `${
									oldValue.data.modrole == null
										? '`Disabled`'
										: this.Utils.Mentionrole(oldValue.data.modrole)
								}`,
							},
							{
								name: 'New value',
								value: `${this.Utils.Mentionrole(data.data.modrole)}`,
							},
						],
					});

					return message.channel.send({ embed: embed });
				}
				if (data.data.modrole == null) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						error_message: 'Mod role is already disabled!',
					});

					const msg = await message.channel.send({ embed: embed });
					return msg.delete({ timeout: 10000 });
				}

				data.data.modrole = null;

				await con.query(`BEGIN`);
				await con.query(
					`UPDATE Guilds SET roles = '${data.toString()}' WHERE guildid = '${
						message.guild.id
					}'`
				);
				await con.query(`COMMIT`);

				const embed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `Successfully ${
						oldValue.data.modrole == null ? 'enabled' : 'updated'
					} mod role`,
					fields: [
						{
							name: 'Old value:',
							value: `${this.Utils.Mentionrole(oldValue.data.modrole)}`,
						},
						{
							name: 'New value',
							value: `\`Disabled\``,
						},
					],
				});

				return message.channel.send({ embed: embed });
			}
		} finally {
			con.release();
		}
	}
}
