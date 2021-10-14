import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	CommandInteraction,
	GuildMember,
	Message,
	UserFlags,
} from 'discord.js';
import {
	APIInteractionGuildMember,
	InteractionResponseType,
} from 'discord-api-types';
import { channel } from 'diagnostics_channel';

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
	async run(client: DiscordClient, message: Message, args: string[]) {}
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
					description: `${this.Utils.Mentionchannel(id)} information`,
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
				description: `${this.Utils.Mentionchannel(c.id)} information`,
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
			const owner = this.Utils.Mentionuser(guild.ownerId);
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
				description: `${this.Utils.Mentionrole(id)} information`,
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
						.map((r) => `${this.Utils.Mentionrole(r)}`)
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
					const presence = `${this.Utils.StatusEmoji(
						(member as GuildMember).presence.status
					)} | ${(member as GuildMember).presence.status.toUpperCase()}`;
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
					const roles = `${(mem as APIInteractionGuildMember).roles
						.map((r) => `${this.Utils.Mentionrole(r)}`)
						.join(' | ')}`;

					const data = await client.users.fetch(mem.user.id);
					const nickname = (mem as APIInteractionGuildMember).nick
						? `${mem as APIInteractionGuildMember} AKA ${data.username}`
						: data.username;
					const discrim = data.discriminator;
					const id = data.id;
					const joinedAt = (mem as APIInteractionGuildMember).joined_at;
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
