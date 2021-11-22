import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	Message,
	TextChannel,
	Permissions,
	CommandInteraction,
} from 'discord.js';

export default class BanCommand extends BaseCommand {
	constructor() {
		super(
			'ban',
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
	async run(
		client: DiscordClient,
		message: Message,
		args: string[]
	): Promise<Message | void> {
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

		if (
			!message.guild.me.permissions.has([
				Permissions.FLAGS.BAN_MEMBERS || Permissions.FLAGS.ADMINISTRATOR,
			])
		) {
			const embed = await this.ErrorEmbed.ClientPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				perms: ['ADMINISTRATOR', 'BAN_MEMBERS'],
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		const user =
			message.mentions.members.first().user ||
			message.guild.members.cache.find((u) => u.id == args[0]).user ||
			message.guild.members.cache.find((u) => u.user.username === args[0])
				.user ||
			(await client.users.fetch(args[0]));

		const reason = args.slice(1).join(' ') || 'No reason given';

		if (!user) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'Invalid user',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		if (user.id == message.author.id) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'You cannot ban yourself!',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}
		if (user.id == '398264990567628812') {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'I cannot ban my owner!',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		if (user.id == client.user.id) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'I cannot ban myself!',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		const bans = await message.guild.bans.fetch();

		const bannedUser = bans.filter((u) => u.user.id == user.id);

		if (bannedUser.size > 0) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'This user is already banned from the guild!',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		try {
			message.delete();

			const embed = await this.Embed.Base({
				iconURL: user.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Ban notification',
				description: `You have been banned from ${message.guild.name}`,
				fields: [
					{
						name: 'Banned by:',
						value: `${message.author.tag} (${message.author.id})`,
					},
					{ name: 'Reason', value: reason },
				],
			});

			await user.send({ embeds: [embed] });
		} finally {
			await message.guild.members.ban(user, { reason: reason });
		}

		const successEmbed = await this.SuccessEmbed.Base({
			iconURL: user.displayAvatarURL({ dynamic: true }),
			text: this,
			id: message.guild.id,
			success_message: `${(
				await this.Utils.FetchUser(user.id)
			).toString()} was successfully banned!`,
		});

		const msg = await message.channel.send({ embeds: [successEmbed] });
		this.Utils.Delete(msg);

		const caseNumber = await this.Moderation.GetCaseNumber(message.guild.id);

		const modlogEmbed = await this.Embed.Base({
			iconURL: user.displayAvatarURL({ dynamic: true }),
			text: this,
			title: 'New moderation',
			description: 'Moderation: `Ban`',
			fields: [
				{
					name: 'User',
					value: `${(await this.Utils.FetchUser(user.id)).toString()}`,
				},
				{
					name: 'Moderator',
					value: `${(
						await this.Utils.FetchUser(message.author.id)
					).toString()}`,
				},
				{ name: 'Reason', value: `${reason}` },
				{ name: 'Case #', value: `\`${caseNumber}\`` },
				{ name: 'Date', value: message.createdAt.toLocaleString() },
			],
		});

		const modlog = await this.Channels.Modlog(message.guild.id);
		const publicmodlog = await this.Channels.Publicmodlog(message.guild.id);

		let mmsg = null;
		let pmsg = null;
		if (modlog != null) {
			const msg = await (
				(await client.channels.fetch(modlog)) as TextChannel
			).send({ embeds: [modlogEmbed] });
			mmsg = msg.id;
		}
		if (publicmodlog != null) {
			const msg = await (
				(await client.channels.fetch(publicmodlog)) as TextChannel
			).send({ embeds: [modlogEmbed] });
			pmsg = msg.id;
		}

		await this.Moderation.InsertModeration(
			message.guild.id,
			'ban',
			caseNumber,
			message.author.id,
			{
				user: user.id,
				modlog: modlog,
				publicmodlog: publicmodlog,
				reason: reason,
				modlogId: mmsg,
				publicmodlogId: pmsg,
				moderationDate: Date.now(),
				updatedAt: Date.now(),
				updatedBy: message.author.id,
			}
		);
		return;
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
