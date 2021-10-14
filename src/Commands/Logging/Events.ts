import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message, Permissions } from 'discord.js';

export default class EventsCommand extends BaseCommand {
	constructor() {
		super(
			'events',
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
		const todo = args.slice(0, 2).join(' ');
		const mention = message.mentions.channels.first();

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

		const con = await this.con.connect();
		try {
			const res = await con.query(
				`SELECT events FROM Guilds WHERE guildid = '${message.guild.id}'`
			);
			if (res.rows.length == 0) return;
			const { data } = new this.Schemas.Events(res.rows[0].events);

			if (!todo) {
				const channelEvents = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Events command',
					description: 'Channel events settings',
					fields: [
						{
							name: 'Channel create',
							value: `${
								data.channelCreate.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.channelCreate.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
						{
							name: 'Channel delete',
							value: `${
								data.channelDelete.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.channelDelete.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
						{
							name: 'Channel update',
							value: `${
								data.channelUpdate.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.channelUpdate.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
					],
				});

				const emojiEvents = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Events command',
					description: 'Emoji events settings',
					fields: [
						{
							name: 'Emoji create',
							value: `${
								data.emojiCreate.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.emojiCreate.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
						{
							name: 'Emoji delete',
							value: `${
								data.emojiDelete.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.emojiDelete.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
						{
							name: 'Emoji update',
							value: `${
								data.emojiUpdate.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.emojiUpdate.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
					],
				});

				const memberEvents = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Events command',
					description: 'Member events settings',
					fields: [
						{
							name: 'Ban add',
							value: `${
								data.guildBanAdd.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.guildBanAdd.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
						{
							name: 'Ban remove',
							value: `${
								data.guildBanRemove.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.guildBanRemove.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
						{
							name: 'Member join',
							value: `${
								data.guildMemberAdd.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.guildMemberAdd.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
						{
							name: 'Member leave',
							value: `${
								data.guildMemberRemove.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.guildMemberRemove.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
						{
							name: 'Member update',
							value: `${
								data.guildMemberUpdate.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.guildMemberUpdate.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
					],
				});

				const messageEvents = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Events command',
					description: 'Message events settings',
					fields: [
						{
							name: 'Message delete',
							value: `${
								data.messageDelete.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.messageDelete.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
						{
							name: 'Message edit',
							value: `${
								data.messageUpdate.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.messageUpdate.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
						{
							name: 'Bulk delete',
							value: `${
								data.messageDeleteBulk.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.messageDeleteBulk.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
					],
				});

				const voiceEvents = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Events command',
					description: 'Voice events settings',
					fields: [
						{
							name: 'VC join',
							value: `${
								data.voiceMemberJoin.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.voiceMemberJoin.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
						{
							name: 'VC leave',
							value: `${
								data.voiceMemberLeave.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.voiceMemberLeave.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
						{
							name: 'VC move',
							value: `${
								data.voiceMemberMoved.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.voiceMemberMoved.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
					],
				});

				const miscEvents = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Events command',
					description: 'Miscellaneous events settings',
					fields: [
						{
							name: 'Guild update',
							value: `${
								data.guildUpdate.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.guildUpdate.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
						{
							name: 'Invite create',
							value: `${
								data.inviteCreate.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.inviteCreate.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
						{
							name: 'Invite delete',
							value: `${
								data.inviteDelete.enabled == true
									? `${
											this.Emojis.on_switch
									  } | Value: ${this.Utils.Mentionchannel(
											data.inviteDelete.channel
									  )}`
									: `${this.Emojis.off_switch} | Value: \`Disabled\``
							}`,
						},
					],
				});

				return await this.Utils.Paginate(
					message,
					{ timeout: 600000 },
					channelEvents,
					emojiEvents,
					memberEvents,
					messageEvents,
					voiceEvents,
					miscEvents
				);
			}
			if (todo.toLowerCase() == 'channel create') {
				const oldValue = {
					channel: data.channelCreate.channel,
					enabled: data.channelCreate.enabled,
				};
				if (mention) {
					try {
						data.channelCreate.enabled = true;
						data.channelCreate.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} channel create settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.channelCreate.enabled = false;
					data.channelCreate.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled channel create settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'channel delete') {
				const oldValue = {
					channel: data.channelDelete.channel,
					enabled: data.channelDelete.enabled,
				};
				if (mention) {
					try {
						data.channelDelete.enabled = true;
						data.channelDelete.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} channel delete settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.channelDelete.enabled = false;
					data.channelDelete.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled channel delete settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'channel update') {
				const oldValue = {
					channel: data.channelUpdate.channel,
					enabled: data.channelUpdate.enabled,
				};
				if (mention) {
					try {
						data.channelUpdate.enabled = true;
						data.channelUpdate.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} channel update settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.channelUpdate.enabled = false;
					data.channelUpdate.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled channel update settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'emoji create') {
				const oldValue = {
					channel: data.emojiCreate.channel,
					enabled: data.emojiCreate.enabled,
				};
				if (mention) {
					try {
						data.emojiCreate.enabled = true;
						data.emojiCreate.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} emoji create settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.emojiCreate.enabled = false;
					data.emojiCreate.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled emoji create settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'emoji delete') {
				const oldValue = {
					channel: data.emojiDelete.channel,
					enabled: data.emojiDelete.enabled,
				};
				if (mention) {
					try {
						data.emojiDelete.enabled = true;
						data.emojiDelete.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} emoji delete settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.emojiDelete.enabled = false;
					data.emojiDelete.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled emoji delete settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'emoji update') {
				const oldValue = {
					channel: data.emojiUpdate.channel,
					enabled: data.emojiUpdate.enabled,
				};
				if (mention) {
					try {
						data.emojiUpdate.enabled = true;
						data.emojiUpdate.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} emoji update settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.emojiUpdate.enabled = false;
					data.emojiUpdate.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled emoji update settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'ban add') {
				const oldValue = {
					channel: data.guildBanAdd.channel,
					enabled: data.guildBanAdd.enabled,
				};
				if (mention) {
					try {
						data.guildBanAdd.enabled = true;
						data.guildBanAdd.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} ban add settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.guildBanAdd.enabled = false;
					data.guildBanAdd.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled ban add settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'ban remove') {
				const oldValue = {
					channel: data.guildBanRemove.channel,
					enabled: data.guildBanRemove.enabled,
				};
				if (mention) {
					try {
						data.guildBanRemove.enabled = true;
						data.guildBanRemove.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} ban remove settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.guildBanRemove.enabled = false;
					data.guildBanRemove.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled ban remove settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'member join') {
				const oldValue = {
					channel: data.guildMemberAdd.channel,
					enabled: data.guildMemberAdd.enabled,
				};
				if (mention) {
					try {
						data.guildMemberAdd.enabled = true;
						data.guildMemberAdd.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} member add settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.guildMemberAdd.enabled = false;
					data.guildMemberAdd.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled member add settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'member leave') {
				const oldValue = {
					channel: data.guildMemberRemove.channel,
					enabled: data.guildMemberRemove.enabled,
				};
				if (mention) {
					try {
						data.guildMemberRemove.enabled = true;
						data.guildMemberRemove.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} member leave settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.guildMemberRemove.enabled = false;
					data.guildMemberRemove.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled member leave settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'member update') {
				const oldValue = {
					channel: data.guildMemberUpdate.channel,
					enabled: data.guildMemberUpdate.enabled,
				};
				if (mention) {
					try {
						data.guildMemberUpdate.enabled = true;
						data.guildMemberUpdate.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} member update settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.guildMemberUpdate.enabled = false;
					data.guildMemberUpdate.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled member update settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'guild update') {
				const oldValue = {
					channel: data.guildUpdate.channel,
					enabled: data.guildUpdate.enabled,
				};
				if (mention) {
					try {
						data.guildUpdate.enabled = true;
						data.guildUpdate.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} guild update settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.guildUpdate.enabled = false;
					data.guildUpdate.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled guild update settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'invite create') {
				const oldValue = {
					channel: data.inviteCreate.channel,
					enabled: data.inviteCreate.enabled,
				};
				if (mention) {
					try {
						data.inviteCreate.enabled = true;
						data.inviteCreate.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} invite create settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.inviteCreate.enabled = false;
					data.inviteCreate.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled invite create settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'invite delete') {
				const oldValue = {
					channel: data.inviteDelete.channel,
					enabled: data.inviteDelete.enabled,
				};
				if (mention) {
					try {
						data.inviteDelete.enabled = true;
						data.inviteDelete.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} invite delete settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.inviteDelete.enabled = false;
					data.inviteDelete.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled invite delete settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'message delete') {
				const oldValue = {
					channel: data.messageDelete.channel,
					enabled: data.messageDelete.enabled,
				};
				if (mention) {
					try {
						data.messageDelete.enabled = true;
						data.messageDelete.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} message delete settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.messageDelete.enabled = false;
					data.messageDelete.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled message delete settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'message edit') {
				const oldValue = {
					channel: data.messageUpdate.channel,
					enabled: data.messageUpdate.enabled,
				};
				if (mention) {
					try {
						data.messageUpdate.enabled = true;
						data.messageUpdate.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} message edit settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.messageUpdate.enabled = false;
					data.messageUpdate.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled message edit settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'bulk delete') {
				const oldValue = {
					channel: data.messageDeleteBulk.channel,
					enabled: data.messageDeleteBulk.enabled,
				};
				if (mention) {
					try {
						data.messageDeleteBulk.enabled = true;
						data.messageDeleteBulk.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} bulk delete settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.messageDeleteBulk.enabled = false;
					data.messageDeleteBulk.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled bulk delete settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'vc join') {
				const oldValue = {
					channel: data.voiceMemberJoin.channel,
					enabled: data.voiceMemberJoin.enabled,
				};
				if (mention) {
					try {
						data.voiceMemberJoin.enabled = true;
						data.voiceMemberJoin.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} vc join settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.voiceMemberJoin.enabled = false;
					data.voiceMemberJoin.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled vc join settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'vc leave') {
				const oldValue = {
					channel: data.voiceMemberLeave.channel,
					enabled: data.voiceMemberLeave.enabled,
				};
				if (mention) {
					try {
						data.voiceMemberLeave.enabled = true;
						data.voiceMemberLeave.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} vc leave settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.voiceMemberLeave.enabled = false;
					data.voiceMemberLeave.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled vc leave settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'vc move') {
				const oldValue = {
					channel: data.voiceMemberMoved.channel,
					enabled: data.voiceMemberMoved.enabled,
				};
				if (mention) {
					try {
						data.voiceMemberMoved.enabled = true;
						data.voiceMemberMoved.channel = mention.id;

						const newData = new this.Schemas.Events(data).toString();

						await con.query(`BEGIN`);
						await con.query(
							`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
						);
						await con.query(`COMMIT`);
					} catch (error) {
						console.log(error);
					}
					const successEmbed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `\`\`\`Successfully ${
							oldValue.channel == null ? 'enabled' : 'updated'
						} vc move settings\`\`\``,
						fields: [
							{
								name: 'Old value',
								value: `${
									oldValue.channel == null
										? `\`Disabled\``
										: this.Utils.Mentionchannel(oldValue.channel)
								}`,
								inline: true,
							},
							{
								name: 'New value',
								value: this.Utils.Mentionchannel(mention.id),
								inline: true,
							},
						],
					});
					return message.channel.send({ embeds: [successEmbed] });
				}

				if (data.channelCreate.enabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
						error_message: 'This event is already disabled!',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				try {
					data.voiceMemberMoved.enabled = false;
					data.voiceMemberMoved.channel = null;

					const newData = new this.Schemas.Events(data).toString();

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET events = '${newData}' WHERE guildid = '${message.guild.id}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				}

				const successEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `\`\`\`Successfully disabled vc move settings\`\`\``,
					fields: [
						{
							name: 'Old value',
							value: `${this.Utils.Mentionchannel(oldValue.channel)}`,
							inline: true,
						},
						{ name: 'New value', value: `\`Disabled\``, inline: true },
					],
				});

				return message.channel.send({ embeds: [successEmbed] });
			}
			if (todo.toLowerCase() == 'list') {
				const channelEvents = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Events command | Channel Events',
					description:
						"These are the events. To configure it's settings, put the events name where it says event name: `events EVENT NAME #mention` or `events EVENT NAME` to disable. Example: `events ban add`",
					fields: [
						{
							name: 'Channel create',
							value:
								'Will send logs to specified channel when a channel is created',
						},
						{
							name: 'Channel delete',
							value:
								'Will send logs to specified channel when a channel is deleted',
						},
						{
							name: 'Channel update',
							value:
								'Will send logs to specified channel when a channel is edited (name, type etc...)',
						},
					],
				});

				const emojiEvents = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Events command | Emoji events',
					description:
						"These are the events. To configure it's settings, put the events name where it says event name: `events EVENT NAME #mention` or `events EVENT NAME` to disable. Example: `events ban add`",
					fields: [
						{
							name: 'Emoji create',
							value:
								'Will send logs to specified channel when an emoji is created',
						},
						{
							name: 'Emoji delete',
							value:
								'Will send logs to specified channel when an emoji is deleted',
						},
						{
							name: 'Emoji update',
							value:
								'Will send logs to specified channel when an emoji is updated (name, etc..)',
						},
					],
				});

				const memberEvents = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Events command | Member events',
					description:
						"These are the events. To configure it's settings, put the events name where it says event name: `events EVENT NAME #mention` or `events EVENT NAME` to disable. Example: `events ban add`",
					fields: [
						{
							name: 'Ban add',
							value:
								'Will send logs to specified channel when a user is banned from the guild',
						},
						{
							name: 'Ban remove',
							value:
								'Will send logs to specified channel when a user is unbanned from the guild',
						},
						{
							name: 'Member join',
							value:
								'Will send logs to specified channel when a new member joins the guild (It logs joins, this does NOT welcome them, to configure welcomes do `welcomes`)',
						},
						{
							name: 'Member leave',
							value:
								'Will send logs to specified channel when a user leaves the guild (It logs leaves, this does NOT say goodbye to the user, to configure that do `goodbyes`)',
						},
						{
							name: 'Member update',
							value:
								'Will send logs to specified channel when a user is updated (new role added, nickname changed etc...)',
						},
					],
				});

				const messageEvents = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Events command | Message events',
					description:
						"These are the events. To configure it's settings, put the events name where it says event name: `events EVENT NAME #mention` or `events EVENT NAME` to disable. Example: `events ban add`",
					fields: [
						{
							name: 'Message delete',
							value:
								'Will send logs to specified channel when a message is deleted',
						},
						{
							name: 'Message edit',
							value:
								'Will send logs to specified channel when a message is edited',
						},
						{
							name: 'Bulk delete',
							value:
								'Will send logs to specified channel when a bulk amount of messages are deleted',
						},
					],
				});

				const voiceEvents = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Events command | Voice events',
					description:
						"These are the events. To configure it's settings, put the events name where it says event name: `events EVENT NAME #mention` or `events EVENT NAME` to disable. Example: `events ban add`",
					fields: [
						{
							name: 'VC join',
							value:
								'Will send logs to specified channel when a user joins a VC',
						},
						{
							name: 'VC leave',
							value:
								'Will send logs to specified channel when a user leaves a VC',
						},
						{
							name: 'VC move',
							value:
								'Will send logs to specified channel when a user is moved from one VC to another.',
						},
					],
				});

				const miscEvents = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Events command | Miscellaneous events',
					description:
						"These are the events. To configure it's settings, put the events name where it says event name: `events EVENT NAME #mention` or `events EVENT NAME` to disable. Example: `events ban add`",
					fields: [
						{
							name: 'Guild update',
							value:
								'Will send logs to specified channel when guild settings are changed',
						},
						{
							name: 'Invite create',
							value:
								'Will send logs to specified channel when an invite is created',
						},
						{
							name: 'Invite delete',
							value:
								'Will send logs to specified channel when an invite is deleted',
						},
					],
				});

				return await this.Utils.Paginate(
					message,
					{ timeout: 600000 },
					channelEvents,
					emojiEvents,
					memberEvents,
					messageEvents,
					voiceEvents,
					miscEvents
				);
			}
		} finally {
			con.release();
		}

		return await this.HelpEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			message: message,
			command: this,
		});
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
