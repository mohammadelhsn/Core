import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, AwaitMessagesOptions } from 'discord.js';

export default class LeavesCommand extends BaseCommand {
	constructor() {
		super(
			'leaves',
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
	async run(
		client: DiscordClient,
		message: Message,
		args: string[]
	): Promise<Message | void> {
		const todo = args[0];

		const leave = await this.Settings.LeaveSystem(message.guild.id, true);
		const data = new this.Schemas.Leave(leave);

		if (!todo) {
			const embed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				description: `Current settings for ${message.guild.name}`,
				fields: [
					{
						name: 'Enabled?',
						value:
							leave.isenabled == true
								? this.Emojis.on_switch
								: this.Emojis.off_switch,
					},
					{
						name: 'Media?',
						value:
							leave.media == null ? 'N/A' : this.Utils.Capitalize(leave.media),
					},
					{
						name: 'Channel',
						value:
							leave.channel == null
								? 'N/A'
								: this.Utils.Mentionchannel(leave.channel),
					},
					{
						name: 'Message',
						value: leave.message == null ? 'N/A' : leave.message,
					},
				],
			});

			return message.channel.send({ embeds: [embed] });
		}

		if (todo.toLowerCase() == 'enable') {
			if (data.data.isenabled == true) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message: 'Leave system is already enabled!',
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			let timedOut = false;

			const isFromAuthor = (m) => m.author.id == message.author.id;

			const options: AwaitMessagesOptions = {
				filter: isFromAuthor,
				max: 1,
				time: 60000,
			};

			const tEmbed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				description:
					'What type of media would you like to use? `image` or `text`?',
			});

			await message.channel.send({ embeds: [tEmbed] });

			const firstColl = await message.channel.awaitMessages(options);

			if (firstColl.size == 0 || !firstColl.first().content) timedOut = true;

			const media = firstColl.first().content;

			if (timedOut == false && media.toLowerCase() == 'cancel') {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message: 'Successfully cancelled selection',
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			if (
				timedOut == false &&
				media.toLowerCase() !== 'image' &&
				media.toLowerCase() !== 'text'
			) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message:
						'Only "image" and "text" are the supported medias as of now',
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			if (timedOut == false) data.data.media = media.toLowerCase();

			const mEmbed = this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				description:
					"Send the message you'd like the bot to send. See variables below",
				fields: [
					{ name: '{user}', value: `Replaced with username or mention` },
					{ name: '{server}', value: `Replaced with guild name` },
				],
			});

			await message.channel.send({ embeds: [mEmbed] });

			const secondColl = await message.channel.awaitMessages(options);

			if (secondColl.size == 0 || !secondColl.first().content) timedOut = true;

			const wmessage = secondColl.first().content;

			if (timedOut == false && wmessage.toLowerCase() == 'cancel') {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message: 'Successfully cancelled selection',
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			if (timedOut == false) {
				data.data.message = wmessage.replace(/'/g, "\\'");
			}

			const cEmbed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				description:
					"Mention the channel where you'd like the message to be sent!",
			});

			await message.channel.send({ embeds: [cEmbed] });

			const thirdColl = await message.channel.awaitMessages(options);

			if (thirdColl.size == 0 || !thirdColl.first().content) timedOut = true;

			const content = thirdColl.first().content;

			if (content.toLowerCase() == 'cancel') {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message: 'Successfully cancelled selection',
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			if (timedOut == false) {
				const mention =
					thirdColl.first().mentions.channels.first() ||
					message.guild.channels.cache.find(
						(ch) => ch.name.toLowerCase() == content.toLowerCase()
					) ||
					message.guild.channels.cache.find((ch) => ch.id == content);

				data.data.channel = mention.id;

				data.data.isenabled = true;
			}

			const con = await this.con.connect();

			try {
				await con.query(`BEGIN`);
				await con.query(
					`UPDATE Guilds SET leave = '${data.toString()}' WHERE guildid = '${
						message.guild.id
					}'`
				);
				await con.query(`COMMIT`);
			} finally {
				con.release();
			}

			if (timedOut == true) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					error_message: 'Command timed out or is cancelled',
					id: message.guild.id,
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				success_message: 'Successfully enabled leave system',
			});

			return message.channel.send({ embeds: [embed] });
		}
		if (todo.toLowerCase() == 'disable') {
			if (data.data.isenabled == false) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message: 'Leave system is already disabled!',
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			const con = await this.con.connect();

			data.data.channel = null;
			data.data.isenabled = false;
			data.data.media = null;
			data.data.message = null;

			try {
				await con.query(`BEGIN`);
				await con.query(
					`UPDATE Guilds SET leave = '${data.toString()}' WHERE guildid = '${
						message.guild.id
					}'`
				);
				await con.query(`COMMIT`);
			} finally {
				con.release();
			}

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				success_message: 'Successfully disabled leave system',
			});

			return message.channel.send({ embeds: [embed] });
		}
		if (todo.toLowerCase() == 'update') {
			const toUpdate = args[1];

			if (toUpdate == 'media') {
				if (data.data.isenabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						error_message:
							'Leave system is disabled, to enable use "leave enable"',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				let timedOut = false;

				const isFromAuthor = (m) => m.author.id == message.author.id;

				const options = {
					max: 1,
					time: 60000,
				};

				const tEmbed = await this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					description:
						'What type of media would you like to use? `image` or `text`?',
				});

				await message.channel.send({ embeds: [tEmbed] });

				const firstColl = await message.channel.awaitMessages(options);

				if (firstColl.size == 0 || !firstColl.first().content) timedOut = true;

				const media = firstColl.first().content;

				if (timedOut == false && media.toLowerCase() == 'cancel') {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						error_message: 'Successfully cancelled selection',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				if (
					timedOut == false &&
					media.toLowerCase() !== 'image' &&
					media.toLowerCase() !== 'text'
				) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						error_message:
							'Only "image" and "text" are the supported medias as of now',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				if (timedOut == false) data.data.media = media;

				if (timedOut == true) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						error_message: 'Command timed out or is cancelled',
						id: message.guild.id,
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				const con = await this.con.connect();

				try {
					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET leave = '${data.toString()}' WHERE guildid = '${
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
					success_message: `Successfully set media to \`${media}\``,
				});

				return message.channel.send({ embeds: [embed] });
			}
			if (toUpdate == 'channel') {
				if (data.data.isenabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						error_message:
							'Leave system is disabled, to enable use "leave enable"',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				let timedOut = false;

				const isFromAuthor = (m) => m.author.id == message.author.id;

				const options: AwaitMessagesOptions = {
					filter: isFromAuthor,
					max: 1,
					time: 60000,
				};

				const cEmbed = await this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					description:
						"Mention the channel where you'd like the message to be sent!",
				});

				await message.channel.send({ embeds: [cEmbed] });

				const firstColl = await message.channel.awaitMessages(options);

				if (firstColl.size == 0 || !firstColl.first().content) timedOut = true;

				const content = firstColl.first().content;

				if (content.toLowerCase() == 'cancel') {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						error_message: 'Successfully cancelled selection',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				if (timedOut == false) {
					const mention =
						firstColl.first().mentions.channels.first() ||
						message.guild.channels.cache.find(
							(ch) => ch.name.toLowerCase() == content.toLowerCase()
						) ||
						message.guild.channels.cache.find((ch) => ch.id == content);

					data.data.channel = mention.id;
				}

				const con = await this.con.connect();

				try {
					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET leave = '${data.toString()}' WHERE guildid = '${
							message.guild.id
						}'`
					);
					await con.query(`COMMIT`);
				} finally {
					con.release();
				}

				if (timedOut == true) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						error_message: 'Command timed out or is cancelled',
						id: message.guild.id,
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				const embed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: 'Successfully updated leave system channel!',
				});

				return message.channel.send({ embeds: [embed] });
			}
			if (toUpdate == 'message') {
				if (data.data.isenabled == false) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						error_message:
							'Leave system is disabled, to enable use "leave enable"',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				let timedOut = false;

				const isFromAuthor = (m) => m.author.id == message.author.id;

				const options: AwaitMessagesOptions = {
					filter: isFromAuthor,
					max: 1,
					time: 60000,
				};

				const mEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					description:
						"Send the message you'd like the bot to send. See variables below",
					fields: [
						{ name: '{user}', value: `Replaced with username or mention` },
						{ name: '{server}', value: `Replaced with guild name` },
					],
				});

				await message.channel.send({ embeds: [mEmbed] });

				const firstColl = await message.channel.awaitMessages(options);

				if (firstColl.size == 0 || !firstColl.first().content) timedOut = true;

				const wmessage = firstColl.first().content;

				if (timedOut == false && wmessage.toLowerCase() == 'cancel') {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						error_message: 'Successfully cancelled selection',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				if (timedOut == false) {
					data.data.message = wmessage.replace(/'/g, "\\'");
				}

				const con = await this.con.connect();

				try {
					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET leave = '${data.toString()}' WHERE guildid = '${
							message.guild.id
						}'`
					);
					await con.query(`COMMIT`);
				} finally {
					con.release();
				}

				if (timedOut == true) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						error_message: 'Command timed out or is cancelled',
						id: message.guild.id,
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				const embed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: 'Successfully updated leave system message!',
				});

				return message.channel.send({ embeds: [embed] });
			}
			const embed = await this.ErrorEmbed.InvalidChoice({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}
	}
}
