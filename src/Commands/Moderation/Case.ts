import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, TextChannel, Permissions } from 'discord.js';
import moment from 'moment';

export default class CaseCommand extends BaseCommand {
	constructor() {
		super(
			'case',
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
	async run(client: DiscordClient, message: Message, args: string[]) {
		if (
			!message.member.permissions.has([
				Permissions.FLAGS.BAN_MEMBERS || Permissions.FLAGS.ADMINISTRATOR,
			])
		) {
			const embed = await this.ErrorEmbed.UserPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				perms: ['BAN_MEMBERS', 'ADMINISTRATOR'],
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		const caseNumber = parseInt(args[0]);
		const reason = args.slice(1).join(' ');

		if (!caseNumber) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'Specify a case number!',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		if (reason) {
			const moderation = await this.Moderation.FetchModeration(
				message.guild.id,
				caseNumber
			);

			if (!moderation) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message: 'There is no moderation with this case number',
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			const modlog = moderation.modlog;
			const publicmodlog = moderation.publicmodlog;
			const msgid = moderation.messageId;
			const pmsgid = moderation.publicMessageId;

			moderation.reason = reason;
			moderation.lastupdated = Date.now();
			moderation.updateby = message.author.id;

			let dbUpdated = false;
			let modlogUpdated: string | boolean = 'Disabled';
			let pmUpdated: string | boolean = 'Disabled';
			let mnew = 'N/A';
			let pmNew = 'N/A';

			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT moderations FROM Guilds WHERE guildid = '${message.guild.id}'`
				);
				const data = await new this.Schemas.Moderations(
					res.rows[0].moderations
				);

				for (var c of data.data) {
					if (c.caseNumber == caseNumber) {
						c.reason = reason;
						c.lastupdated = Date.now();
						c.updateby = message.author.id;
					}
				}

				await con.query(`BEGIN`);
				await con.query(
					`UPDATE Guilds SET moderations = '${data.toString()}' `
				);
				await con.query(`COMMIT`);

				dbUpdated = true;

				if (modlog != null) {
					const mChannel = client.channels.cache.get(modlog) as TextChannel;
					const msg = await mChannel.messages.fetch({
						around: msgid,
						limit: 1,
					});

					if (!msg) {
						const embed = await this.ErrorEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
							error_message: 'I cannot find the stored message!',
						});

						const msg = await message.channel.send({ embeds: [embed] });
						return this.Utils.Delete(msg);
					}

					const embed = msg.first().embeds[0];

					if (!embed) {
						const embed = await this.ErrorEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
							error_message: 'The moderation embedd cannot be found!',
						});

						const msg = await message.channel.send({ embeds: [embed] });
						return this.Utils.Delete(msg);
					}

					embed.fields[2].value = reason;

					msg.first().edit({ embeds: [embed] });

					mnew = reason;

					modlogUpdated = true;
				}

				if (publicmodlog != null) {
					const mChannel = client.channels.cache.get(
						publicmodlog
					) as TextChannel;
					const msg = await mChannel.messages.fetch({
						around: pmsgid,
						limit: 1,
					});

					if (!msg) {
						const embed = await this.ErrorEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
							error_message: 'I cannot find the stored message!',
						});

						const msg = await message.channel.send({ embeds: [embed] });
						return this.Utils.Delete(msg);
					}

					const embed = msg.first().embeds[0];

					if (!embed) {
						const embed = await this.ErrorEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
							error_message: 'The moderation embedd cannot be found!',
						});

						const msg = await message.channel.send({ embeds: [embed] });
						return this.Utils.Delete(msg);
					}

					embed.fields[2].value = reason;

					msg.first().edit({ embeds: [embed] });

					pmUpdated = true;

					pmNew = reason;
				}

				const embed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `Successfully updated case #${caseNumber}`,
					fields: [
						{
							name: 'Database',
							value:
								dbUpdated == true
									? this.Emojis.success_emoji
									: this.Emojis.error_emoji,
						},
						{
							name: 'Modlog message',
							value: `${
								typeof modlogUpdated == 'string'
									? `${this.Emojis.error_emoji} | ${mnew}`
									: `${this.Emojis.success_emoji} | ${mnew}`
							}`,
						},
						{
							name: 'Publicmodlog',
							value: `${
								typeof pmUpdated == 'string'
									? `${this.Emojis.error_emoji} | ${pmNew}`
									: `${this.Emojis.success_emoji} | ${pmNew}`
							}`,
						},
					],
				});

				return message.channel.send({ embeds: [embed] });
			} finally {
				con.release();
			}
		}

		const moderation = await this.Moderation.FetchModeration(
			message.guild.id,
			caseNumber
		);

		const modlog = moderation.modlog;
		const publicmodlog = moderation.publicmodlog;
		const msgId = moderation.messageId;
		const pMsgid = moderation.publicMessageId;

		let m = 'N/A';
		let pm = 'N/A';

		if (modlog != null)
			m = `[JUMP TO MESSAGE](https://discord.com/channels/${message.guild.id}/${modlog}/${msgId})`;
		if (publicmodlog != null)
			pm = `[JUMP TO MESSAGE](https://discord.com/channels/${message.guild.id}/${modlog}${pMsgid}})`;

		const user = (await client.users.fetch(moderation.user)) || null;

		const embed = this.Embed.Base({
			iconURL: user
				? user.displayAvatarURL({ dynamic: true })
				: message.guild.iconURL({ dynamic: true }),
			text: this,
			title: `Case command`,
			description: `Case #${caseNumber}`,
			fields: [
				{
					name: 'Moderation type',
					value: this.Utils.Capitalize(moderation.moderation),
				},
				{
					name: 'Reason',
					value:
						moderation.reason == null ? 'No reason given' : moderation.reason,
				},
				{
					name: 'Moderator',
					value: `${
						moderation.moderatorId == null
							? 'Unknown'
							: `${this.Utils.Mentionuser(moderation.moderatorId)} - (${
									moderation.moderatorId
							  })`
					}`,
				},
				{
					name: 'User',
					value: user == null ? `N/A` : `${user.tag} - (${user.id})`,
				},
				{
					name: 'Last updated by',
					value: `${this.Utils.Mentionuser(moderation.updateby)} - (${
						moderation.updateby
					})`,
				},
				{
					name: 'Moderation date',
					value: `${moment(moderation.moderationdate).format(
						'MMMM Do YYYY, h:mm:ss a'
					)}`,
				},
				{
					name: 'Last updated at',
					value: `${moment(moderation.lastupdated).format(
						'MMMM Do YYYY, h:mm:ss a'
					)}`,
				},
				{ name: 'Modlog message', value: m },
				{ name: 'Public modlog message', value: pm },
			],
		});

		return message.channel.send({ embeds: [embed] });
	}
}
