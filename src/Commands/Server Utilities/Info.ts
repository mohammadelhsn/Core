import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	CommandInteraction,
	GuildMember,
	Message,
	UserFlags,
	Util,
} from 'discord.js';
import {
	APIInteractionGuildMember,
	InteractionResponseType,
} from 'discord-api-types';

export default class InfoCommand extends BaseCommand {
	constructor() {
		super(
			'info',
			'server utilities',
			[],
			'',
			'Get user, server, role or channel information',
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
		const sub = args[0];

		if (
			!sub ||
			(sub != 'channel' &&
				sub != 'role' &&
				sub != 'user' &&
				sub != 'server' &&
				sub != 'avatar' &&
				sub != 'membercount')
		) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'Pleace pick a valid choice!',
			});

			return message.channel.send({ embeds: [embed] });
		}

		if (sub == 'channel') {
			const mention =
				message.mentions.channels.first() ||
				message.guild.channels.cache.find((ch) => ch.name == args[1]) ||
				message.guild.channels.cache.find((ch) => ch.id == args[1]) ||
				message.channel;

			const name =
				mention.type == 'DM'
					? 'DM'
					: mention.isText()
					? mention.name
					: mention.isThread()
					? mention.name
					: mention.isVoice()
					? mention.name
					: 'Unknown';
			const id = mention.id;
			const type = this.Utils.ChannelType(mention);
			const createdAt = mention.createdAt.toString();

			const embed = this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Channel info',
				description: `${(
					await this.Utils.FetchChannel(id)
				).toString()} information`,
				fields: [
					{ name: 'Name', value: name },
					{ name: 'ID', value: id },
					{ name: 'Type', value: type },
					{ name: 'Created At', value: createdAt },
				],
			});

			return await message.channel.send({ embeds: [embed] });
		}

		if (sub == 'role') {
			const mention =
				message.mentions.roles.first() ||
				message.guild.roles.cache.find((role) => role.name == args[1]) ||
				message.guild.roles.cache.find((role) => role.id == args[1]);

			if (!mention) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message: 'Missing a role mention!',
				});

				return message.channel.send({ embeds: [embed] });
			}

			const name = mention.name;
			const id = mention.id;
			const color = mention.hexColor;
			const managed = mention.managed ? 'Yes' : 'No';
			const createdAt = mention.createdAt.toString();

			const embed = this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Role information',
				description: `${message.guild.roles.cache
					.find((r) => r.id == id)
					.toString()} information`,
				fields: [
					{ name: 'Name', value: name },
					{ name: 'ID', value: id },
					{ name: 'Managed?', value: managed },
					{ name: 'Created At', value: createdAt },
				],
			});
			embed.setColor(color);

			return message.channel.send({ embeds: [embed] });
		}

		if (sub == 'server') {
			const { guild } = message;

			const name = guild.name;
			const id = guild.id;
			const owner = (await this.Utils.FetchUser(guild.ownerId)).toString();
			const verified = guild.verified ? 'Yes' : 'No';
			const membercount = guild.memberCount;
			const humans = message.guild.members.cache.filter(
				(m) => !m.user.bot
			).size;
			const bots = message.guild.members.cache.filter((m) => m.user.bot).size;
			const createdAt = guild.createdAt.toString();
			const channels = guild.channels.cache.size;
			const text = guild.channels.cache.filter(
				(c) => c.type == 'GUILD_TEXT'
			).size;
			const voice = guild.channels.cache.filter(
				(c) => c.type == 'GUILD_VOICE'
			).size;
			const roles = guild.roles.cache.size;

			const embed = this.Embed.Base({
				iconURL: guild.iconURL({ dynamic: true }),
				text: this,
				title: `Serverinfo command`,
				description: `${name} information`,
				fields: [
					{ name: 'Guild ID', value: id },
					{ name: 'Owner', value: owner },
					{ name: 'Verified?', value: verified },
					{ name: 'Membercount', value: membercount.toString() },
					{ name: 'Human count', value: humans.toString() },
					{ name: 'Bot count', value: bots.toString() },
					{ name: 'Channel count', value: channels.toString() },
					{ name: 'Text channel(s)', value: text.toString() },
					{ name: 'Voice channel(s)', value: voice.toString() },
					{ name: 'Role count', value: roles.toString() },
					{ name: 'Created at', value: createdAt.toString() },
				],
			});

			return message.channel.send({ embeds: [embed] });
		}
		if (sub == 'user') {
			const user =
				message.mentions.members.first() ||
				message.guild.members.cache.find((u) => u.user.id == args[1]) ||
				message.guild.members.cache.find((u) => u.user.username == args[1]) ||
				message.guild.members.cache.find(
					(u) => u.nickname != null && u.nickname == args[1]
				);

			if (!user && !args[1]) {
				const u = message.member;

				const roles = `${u.roles.cache.map((r) => `${r}`).join(' | ')}`;
				const kickable = u.kickable ? 'Yes' : 'No';
				const bannable = u.bannable ? 'Yes' : 'No';
				const joinedAt = u.joinedAt;
				const presence = u.presence
					? `${this.Utils.StatusEmoji(
							u.presence.status
					  )} | ${u.presence.status.toUpperCase()}`
					: 'N/A';
				const nickname = u.nickname
					? `${u.nickname} AKA ${u.user.username}`
					: u.user.username;

				const flags = this.Utils.GetFlags(u.user.flags);

				const embed = await this.Embed.Base({
					iconURL: u.displayAvatarURL({
						dynamic: true,
					}),
					text: this,
					title: `${u.user.username}#${u.user.discriminator} information`,
					description: `Badges: ${flags}`,
					fields: [
						{ name: 'Name', value: nickname },
						{ name: 'Discriminator', value: `#${u.user.discriminator}` },
						{ name: 'ID', value: u.id },
						{ name: 'Presence', value: presence },
						{ name: 'Kickable', value: kickable },
						{ name: 'Bannable', value: bannable },
						{ name: 'Joined at', value: `${joinedAt}` },
						{ name: 'Created at', value: `${u.user.createdAt}` },
						{ name: 'Roles', value: roles },
					],
				});
				return await message.reply({ embeds: [embed] });
			}
			if (!user && args[1]) {
				try {
					const u = await this.Utils.FetchUser(args[0]);

					if (!u) {
						return message.reply({ content: "I couldn't find this user!" });
					}

					const username = u.username;
					const discrim = u.discriminator;
					const id = u.id;
					const createdAt = u.createdAt;
					const flags = this.Utils.GetFlags(u.flags);

					const embed = this.Embed.Base({
						iconURL: user.displayAvatarURL({ dynamic: true }),
						text: this,
						title: `${username}#${discrim} information`,
						description: flags,
						fields: [
							{ name: 'Name', value: username },
							{ name: 'Discriminator', value: `#${discrim}` },
							{ name: 'ID', value: id },
							{ name: 'Created At', value: createdAt.toString() },
						],
					});

					return message.reply({ embeds: [embed] });
				} catch (error) {
					return message.reply({ content: "I couldn't find this user!" });
				}
			}
			const roles = `${user.roles.cache.map((r) => `${r}`).join(' | ')}`;
			const kickable = user.kickable ? 'Yes' : 'No';
			const bannable = user.bannable ? 'Yes' : 'No';
			const joinedAt = user.joinedAt;
			const presence = user.presence
				? `${this.Utils.StatusEmoji(
						user.presence.status
				  )} | ${user.presence.status.toUpperCase()}`
				: 'N/A';
			const nickname = user.nickname
				? `${user.nickname} AKA ${user.user.username}`
				: user.user.username;

			const flags = this.Utils.GetFlags(user.user.flags);

			const embed = await this.Embed.Base({
				iconURL: user.displayAvatarURL({
					dynamic: true,
				}),
				text: this,
				title: `${user.user.username}#${user.user.discriminator} information`,
				description: `Badges: ${flags}`,
				fields: [
					{ name: 'Name', value: nickname },
					{ name: 'Discriminator', value: `#${user.user.discriminator}` },
					{ name: 'ID', value: user.id },
					{ name: 'Presence', value: presence },
					{ name: 'Kickable', value: kickable },
					{ name: 'Bannable', value: bannable },
					{ name: 'Joined at', value: `${joinedAt}` },
					{ name: 'Created at', value: `${user.user.createdAt}` },
					{ name: 'Roles', value: roles },
				],
			});
			return await message.reply({ embeds: [embed] });
		}
		if (sub == 'membercount') {
			const embed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Membercount command',
				description: `${message.guild.name} membercount!`,
				fields: [
					{
						name: 'Total membercount',
						value: `\`${this.Utils.FormatNumber(message.guild.memberCount)}\``,
					},
					{
						name: 'Human count',
						value: `\`${this.Utils.FormatNumber(
							message.guild.members.cache.filter((member) => !member.user.bot)
								.size
						)}\``,
					},
					{
						name: `${this.Emojis.bot} | Bot count`,
						value: `\`${this.Utils.FormatNumber(
							message.guild.members.cache.filter((member) => member.user.bot)
								.size
						)}\``,
					},
					{
						name: `${this.Emojis.online} | Members online`,
						value: `\`${this.Utils.FormatNumber(
							message.guild.members.cache.filter(
								(o) => o.presence.status === 'online'
							).size
						)}\``,
					},
					{
						name: `${this.Emojis.idle} | Idle members`,
						value: `\`${this.Utils.FormatNumber(
							message.guild.members.cache.filter(
								(i) => i.presence.status === 'idle'
							).size
						)}\``,
					},
					{
						name: `${this.Emojis.dnd} | DND members`,
						value: `\`${this.Utils.FormatNumber(
							message.guild.members.cache.filter(
								(dnd) => dnd.presence.status === 'dnd'
							).size
						)}\``,
					},
					{
						name: `${this.Emojis.offline} | Offline/invisible members`,
						value: `\`${this.Utils.FormatNumber(
							message.guild.members.cache.filter(
								(off) => off.presence.status === 'offline'
							).size
						)}\``,
					},
				],
			});

			return await message.reply({ embeds: [embed] });
		}
		if (sub == 'avatar') {
			const mention = message.mentions.members.first() || message.member;

			if (mention.avatar == null) {
				const embed = await this.ImageEmbed.Base({
					iconURL: mention.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `${mention.user.tag}'s avatar`,
					description: `Link: [Click here](${mention.displayAvatarURL({
						dynamic: true,
					})})`,
					image: mention.displayAvatarURL({ dynamic: true }),
				});

				return message.reply({ embeds: [embed] });
			}

			const embed = await this.ImageEmbed.Base({
				iconURL: mention.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `${mention.user.tag}'s avatar`,
				description: `This user has a per-guild avatar and a global avatar`,
				fields: [
					{
						name: 'Global avatar',
						value: `[Click here](${mention.user.displayAvatarURL({
							dynamic: true,
						})})`,
						inline: true,
					},
					{
						name: 'Guild avatar',
						value: `[Click here](${mention.avatarURL({ dynamic: true })})`,
						inline: true,
					},
				],
				image: mention.displayAvatarURL({ dynamic: true }),
			});

			return message.reply({ embeds: [embed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const sub = interaction.options.getSubcommand();

		if (sub == 'channel') {
			const c = interaction.options.getChannel('channel');

			if (!c) {
				const { channel, guild } = interaction;

				const name = channel.type == 'DM' ? 'N/A' : channel.name;
				const createdAt = channel.createdAt.toString();
				const id = channel.id;
				const type = this.Utils.ChannelType(channel);

				const embed = this.Embed.Base({
					iconURL: guild.iconURL({ dynamic: true }),
					text: this,
					title: 'Channel info',
					description: `${(
						await this.Utils.FetchChannel(id)
					).toString()} information`,
					fields: [
						{ name: 'Name', value: name },
						{ name: 'ID', value: id },
						{ name: 'Type', value: type },
						{ name: 'Created At', value: createdAt },
					],
				});

				return await interaction.reply({ embeds: [embed], ephemeral: true });
			}

			const chnl = await client.channels.fetch(c.id);

			const name = chnl.isThread()
				? chnl.name
				: chnl.isVoice()
				? chnl.name
				: chnl.isText() && chnl.type != 'DM'
				? chnl.name
				: 'DM';

			const id = chnl.id;
			const type = this.Utils.ChannelType(chnl);
			const createdAt = chnl.createdAt.toString();

			const embed = this.Embed.Base({
				iconURL: interaction.guild.iconURL({ dynamic: true }),
				text: this,
				title: 'Channel info',
				description: `${(
					await this.Utils.FetchChannel(c.id)
				).toString()} information`,
				fields: [
					{ name: 'Name', value: name },
					{ name: 'Type', value: type },
					{ name: 'ID', value: id },
					{ name: 'Created At', value: createdAt },
				],
			});

			return await interaction.reply({ embeds: [embed], ephemeral: true });
		}
		if (sub == 'server') {
			const { guild } = interaction;

			const name = guild.name;
			const id = guild.id;
			const owner = (await this.Utils.FetchUser(guild.ownerId)).toString();
			const verified = guild.verified ? this.Emojis.verified : 'No';
			const membercount = guild.memberCount;
			const humans = guild.members.cache.filter(
				(users) => !users.user.bot
			).size;
			const bots = guild.members.cache.filter((users) => users.user.bot).size;
			const channels = guild.channels.cache.size;
			const text = guild.channels.cache.filter(
				(channel) => channel.type == 'GUILD_TEXT'
			).size;
			const voice = guild.channels.cache.filter(
				(channel) => channel.type == 'GUILD_VOICE'
			).size;
			const createdAt = guild.createdAt;
			const roles = guild.roles.cache.size;

			const embed = this.Embed.Base({
				iconURL: guild.iconURL({ dynamic: true }),
				text: this,
				title: `Serverinfo command`,
				description: `${name} information`,
				fields: [
					{ name: 'Guild ID', value: id },
					{ name: 'Owner', value: owner },
					{ name: 'Verified?', value: verified },
					{ name: 'Membercount', value: membercount.toString() },
					{ name: 'Human count', value: humans.toString() },
					{ name: 'Bot count', value: bots.toString() },
					{ name: 'Channel count', value: channels.toString() },
					{ name: 'Text channel(s)', value: text.toString() },
					{ name: 'Voice channel(s)', value: voice.toString() },
					{ name: 'Role count', value: roles.toString() },
					{ name: 'Created at', value: createdAt.toString() },
				],
			});

			return await interaction.reply({ embeds: [embed], ephemeral: true });
		}
		if (sub == 'role') {
			const role = interaction.options.getRole('role');

			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				text: this,
				id: interaction.guild.id,
				error_message: 'Missing a required argument',
			});

			if (!role)
				return interaction.reply({ embeds: [errEmbed], ephemeral: true });

			const r = interaction.guild.roles.cache.find((r) => r.id == role.id);

			if (!r) {
				const errEmbed = await this.ErrorEmbed.Base({
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
					text: this,
					id: interaction.guild.id,
					error_message: "This role doesn't exist!",
				});

				return await interaction.reply({ embeds: [errEmbed], ephemeral: true });
			}

			const name = r.name;
			const managed = r.managed ? 'Yes' : 'No';
			const createdAt = r.createdAt.toString();
			const id = r.id;
			const hexColor = r.hexColor;

			const embed = this.Embed.Base({
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Role information',
				description: `${interaction.guild.roles.cache
					.find((role) => role.id == id)
					.toString()} information`,
				fields: [
					{ name: 'Name', value: name },
					{ name: 'ID', value: id },
					{ name: 'Managed?', value: managed },
					{ name: 'Created At', value: createdAt },
				],
			});
			embed.setColor(hexColor);

			return await interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (sub == 'avatar') {
			const user = interaction.options.getUser('user');
			let member = interaction.options.getMember('user');

			if (member == null && user == null) {
				let u = interaction.member;
				if (!(u instanceof GuildMember))
					u = interaction.guild.members.cache.find(
						(user) => user.id == u.user.id
					);

				if (u.avatar == null) {
					const embed = await this.ImageEmbed.Base({
						iconURL: u.displayAvatarURL({ dynamic: true }),
						text: this,
						title: `${u.user.username}'s avatar!`,
						description: `[Click here](${u.displayAvatarURL({
							dynamic: true,
						})})`,
						image: u.displayAvatarURL({ dynamic: true }),
					});

					return await interaction.reply({ embeds: [embed] });
				}

				const embed = await this.ImageEmbed.Base({
					iconURL: u.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `${u.user.username}'s avatar!`,
					description: `This user has a per-guild avatar and a global avatar`,
					fields: [
						{
							name: 'Global avatar',
							value: `[Click here](${u.user.displayAvatarURL({
								dynamic: true,
							})})`,
							inline: true,
						},
						{
							name: 'Guild avatar',
							value: `[Click here](${u.avatarURL({ dynamic: true })})`,
							inline: true,
						},
					],
					image: u.displayAvatarURL({ dynamic: true }),
				});

				return await interaction.reply({ embeds: [embed] });
			}

			if (member == null && user != null) {
				const embed = await this.ImageEmbed.Base({
					iconURL: user.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `${user.username}'s avatar!'`,
					description: `[Click here](${user.displayAvatarURL({
						dynamic: true,
					})})`,
					image: user.displayAvatarURL({ dynamic: true }),
				});

				return await interaction.reply({ embeds: [embed] });
			}

			if (!(member instanceof GuildMember))
				member = interaction.guild.members.cache.find((u) => u.id == user.id);

			if (member.avatar == null) {
				const embed = await this.ImageEmbed.Base({
					iconURL: member.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `${member.user.username}'s avatar!`,
					description: `[Click here](${member.displayAvatarURL({
						dynamic: true,
					})})`,
					image: member.displayAvatarURL({ dynamic: true }),
				});

				return await interaction.reply({ embeds: [embed] });
			}

			const embed = await this.ImageEmbed.Base({
				iconURL: member.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `${member.user.username}'s avatar!`,
				description: `This user has a per-guild avatar and a global avatar`,
				fields: [
					{
						name: 'Global avatar',
						value: `[Click here](${member.user.displayAvatarURL({
							dynamic: true,
						})})`,
						inline: true,
					},
					{
						name: 'Guild avatar',
						value: `[Click here](${member.avatarURL({ dynamic: true })})`,
						inline: true,
					},
				],
				image: member.displayAvatarURL({ dynamic: true }),
			});

			return await interaction.reply({ embeds: [embed] });
		}
		if (sub == 'membercount') {
			const embed = await this.Embed.Base({
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Membercount command',
				description: `${interaction.guild.name} membercount!`,
				fields: [
					{
						name: 'Total membercount',
						value: `\`${this.Utils.FormatNumber(
							interaction.guild.memberCount
						)}\``,
					},
					{
						name: 'Human count',
						value: `\`${this.Utils.FormatNumber(
							interaction.guild.members.cache.filter(
								(member) => !member.user.bot
							).size
						)}\``,
					},
					{
						name: `${this.Emojis.bot} | Bot count`,
						value: `\`${this.Utils.FormatNumber(
							interaction.guild.members.cache.filter(
								(member) => member.user.bot
							).size
						)}\``,
					},
					{
						name: `${this.Emojis.online} | Members online`,
						value: `\`${this.Utils.FormatNumber(
							interaction.guild.members.cache.filter(
								(o) => o.presence.status === 'online'
							).size
						)}\``,
					},
					{
						name: `${this.Emojis.idle} | Idle members`,
						value: `\`${this.Utils.FormatNumber(
							interaction.guild.members.cache.filter(
								(i) => i.presence.status === 'idle'
							).size
						)}\``,
					},
					{
						name: `${this.Emojis.dnd} | DND members`,
						value: `\`${this.Utils.FormatNumber(
							interaction.guild.members.cache.filter(
								(dnd) => dnd.presence.status === 'dnd'
							).size
						)}\``,
					},
					{
						name: `${this.Emojis.offline} | Offline/invisible members`,
						value: `\`${this.Utils.FormatNumber(
							interaction.guild.members.cache.filter(
								(off) => off.presence.status === 'offline'
							).size
						)}\``,
					},
				],
			});

			return await interaction.reply({ embeds: [embed] });
		}

		if (sub == 'user') {
			const user = interaction.options.getUser('user');
			const member = interaction.options.getMember('user');

			// If there is a mention and they're a Guild Member
			if (user != null && member != null) {
				const username = user.username;
				const discrim = user.discriminator;
				const id = user.id;
				const createdAt = user.createdAt;
				const flags = this.Utils.GetFlags(user.flags);

				if (Array.isArray(member.roles)) {
					const nickname = (member as APIInteractionGuildMember).nick
						? `${member as APIInteractionGuildMember} AKA ${user.username}`
						: user.username;

					const roles = `${(member as APIInteractionGuildMember).roles
						.map(
							(r) =>
								`${interaction.guild.roles.cache
									.find((role) => role.id == r)
									.toString()}`
						)
						.join(' | ')}`;

					const joinedAt = (member as APIInteractionGuildMember).joined_at;

					const embed = this.Embed.Base({
						iconURL: user.displayAvatarURL({ dynamic: true }),
						text: this,
						title: `${username}#${discrim} information`,
						description: `Badges: ${flags}`,
						fields: [
							{ name: 'Name', value: nickname },
							{ name: 'Discriminator', value: `#${discrim}` },
							{ name: 'ID', value: id },
							{ name: 'Joined at', value: `${joinedAt}` },
							{ name: 'Created at', value: `${createdAt}` },
							{ name: 'Roles', value: roles },
						],
					});

					return await interaction.reply({ embeds: [embed], ephemeral: true });
				}
				if (!Array.isArray(member.roles)) {
					const roles = `${member.roles.cache.map((r) => `${r}`).join(' | ')}`;
					const kickable = (member as GuildMember).kickable ? 'Yes' : 'No';
					const bannable = (member as GuildMember).bannable ? 'Yes' : 'No';
					const joinedAt = (member as GuildMember).joinedAt;
					const presence = (member as GuildMember).presence
						? `${this.Utils.StatusEmoji(
								(member as GuildMember).presence.status
						  )} | ${(member as GuildMember).presence.status.toUpperCase()}`
						: 'N/A';
					const nickname = (member as GuildMember).nickname
						? `${(member as GuildMember).nickname} AKA ${user.username}`
						: user.username;

					const embed = await this.Embed.Base({
						iconURL: (member as GuildMember).user.displayAvatarURL({
							dynamic: true,
						}),
						text: this,
						title: `${user.username}#${discrim} information`,
						description: `Badges: ${flags}`,
						fields: [
							{ name: 'Name', value: nickname },
							{ name: 'Discriminator', value: `#${discrim}` },
							{ name: 'ID', value: id },
							{ name: 'Presence', value: presence },
							{ name: 'Kickable', value: kickable },
							{ name: 'Bannable', value: bannable },
							{ name: 'Joined at', value: `${joinedAt}` },
							{ name: 'Created at', value: `${createdAt}` },
							{ name: 'Roles', value: roles },
						],
					});
					return await interaction.reply({ embeds: [embed], ephemeral: true });
				}
			}
			// If there is a mention but they're not a Guild Member
			if (user != null) {
				const username = user.username;
				const discrim = user.discriminator;
				const id = user.id;
				const createdAt = user.createdAt;
				const flags = this.Utils.GetFlags(user.flags);

				const embed = this.Embed.Base({
					iconURL: user.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `${username}#${discrim} information`,
					description: flags,
					fields: [
						{ name: 'Name', value: username },
						{ name: 'Discriminator', value: `#${discrim}` },
						{ name: 'ID', value: id },
						{ name: 'Created At', value: createdAt.toString() },
					],
				});

				return await interaction.reply({ embeds: [embed], ephemeral: true });
			}
			// If there is no mention
			if (user == null) {
				const mem = interaction.member;

				// Want to seperate the 2 types of results

				if (!Array.isArray(mem.roles)) {
					const roles = `${mem.roles.cache.map((r) => `${r}`).join(' | ')}`;
					const nickname = (mem as GuildMember).nickname
						? `${(mem as GuildMember).nickname} AKA ${mem.user.username}`
						: mem.user.username;
					const discrim = mem.user.discriminator;
					const id = mem.user.id;
					const kickable = (mem as GuildMember).kickable ? 'Yes' : 'No';
					const bannable = (mem as GuildMember).bannable ? 'Yes' : 'No';
					const joinedAt = (mem as GuildMember).joinedAt;
					const createdAt = (mem as GuildMember).user.createdAt;
					const presence = `${this.Utils.StatusEmoji(
						(mem as GuildMember).presence.status
					)} | ${(mem as GuildMember).presence.status.toUpperCase()}`;
					const userflags = this.Utils.GetFlags(
						(mem as GuildMember).user.flags
					);

					const embed = await this.Embed.Base({
						iconURL: (mem as GuildMember).user.displayAvatarURL({
							dynamic: true,
						}),
						text: this,
						title: `${mem.user.username}#${discrim} information`,
						description: `Badges: ${userflags}`,
						fields: [
							{ name: 'Name', value: nickname },
							{ name: 'Discriminator', value: `#${discrim}` },
							{ name: 'ID', value: id },
							{ name: 'Presence', value: presence },
							{ name: 'Kickable', value: kickable },
							{ name: 'Bannable', value: bannable },
							{ name: 'Joined at', value: `${joinedAt}` },
							{ name: 'Created at', value: `${createdAt}` },
							{ name: 'Roles', value: roles },
						],
					});

					return interaction.reply({ embeds: [embed], ephemeral: true });
				}

				if (Array.isArray(mem.roles)) {
					const roles = `${(mem as any).roles
						.map(
							(r) =>
								`${interaction.guild.roles.cache
									.find((role) => role.id == r)
									.toString()}`
						)
						.join(' | ')}`;

					const data = await client.users.fetch(mem.user.id);
					const nickname = (mem as any).nick
						? `${mem as any} AKA ${data.username}`
						: data.username;
					const discrim = data.discriminator;
					const id = data.id;
					const joinedAt = (mem as any).joined_at;
					const createdAt = data.createdAt.toString();
					const flags = this.Utils.GetFlags(data.flags);

					const embed = this.Embed.Base({
						iconURL: data.displayAvatarURL({ dynamic: true }),
						text: this,
						title: `${mem.user.username}#${discrim} information`,
						description: `Badges: ${flags}`,
						fields: [
							{ name: 'Name', value: nickname },
							{ name: 'Discriminator', value: `#${discrim}` },
							{ name: 'ID', value: id },
							{ name: 'Joined at', value: `${joinedAt}` },
							{ name: 'Created at', value: `${createdAt}` },
							{ name: 'Roles', value: roles },
						],
					});

					return await interaction.reply({ embeds: [embed], ephemeral: true });
				}
			}
			return;
		}
	}
}
