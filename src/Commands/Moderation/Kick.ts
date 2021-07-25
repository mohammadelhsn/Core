import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, TextChannel } from 'discord.js';

export default class KickCommand extends BaseCommand {
	constructor() {
		super(
			'kick',
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
		if (!message.member.hasPermission(['KICK_MEMBERS' || 'ADMINISTRATOR'])) {
			const embed = await this.ErrorEmbed.UserPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				perms: ['KICK_MEMBERS', 'ADMINISTRATOR'],
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		if (!message.member.hasPermission(['KICK_MEMBERS' || 'ADMINISTRATOR'])) {
			const embed = await this.ErrorEmbed.ClientPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				perms: ['KICK_MEMBERS', 'ADMINISTRATOR'],
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		if (!args[0]) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'You must include at least one argument',
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		const user =
			message.mentions.members.first() ||
			message.guild.members.cache.find((m) => m.id == message.author.id) ||
			message.guild.members.cache.find((m) => m.nickname == args?.[0]);

		if (!user) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: "I couldn't find this user for you!",
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		if (user.id == message.author.id) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: "You can't kick yourself!",
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		if (user.id == client.user.id) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: "I can't kick myself!",
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		if (user.id == '398264990567628812') {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: "I can't kick my owner!",
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		const reason = args.slice(1).join(' ') || 'No reason given';

		try {
			message.delete();

			const embed = this.Embed.Base({
				iconURL: user.user.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Kick notification',
				description: `You've been kicked from ${message.guild.name}!`,
				fields: [
					{
						name: 'Kicked by',
						value: `${message.author.tag} (${message.author.id})`,
					},
					{ name: 'Reason', value: reason },
				],
			});

			await user.send({ embed: embed });
			await user.kick(reason);
		} finally {
			const successEmbed = await this.SuccessEmbed.Base({
				iconURL: user.user.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				success_message: `Successfully kicked ${user.user.tag} (${user.user.id})`,
			});

			const msg = await message.channel.send({ embed: successEmbed });
			msg.delete({ timeout: 10000 });
		}

		const caseNumber = await this.Moderation.GetCaseNumber(message.guild.id);

		const modlogEmbed = this.Embed.Base({
			iconURL: user.user.displayAvatarURL({ dynamic: true }),
			text: this,
			title: 'New moderation',
			description: 'Moderation: `Kick`',
			fields: [
				{ name: 'User', value: `${user.user.tag} (${user.user.id})` },
				{ name: 'Moderator', value: this.Utils.Mentionuser(message.author.id) },
				{ name: 'Reason', value: `\`${reason}\`` },
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
			).send({ embed: modlogEmbed });
			mmsg = msg.id;
		}
		if (publicmodlog != null) {
			const msg = await (
				(await client.channels.fetch(publicmodlog)) as TextChannel
			).send({ embed: modlogEmbed });
			pmsg = msg.id;
		}

		await this.Moderation.InsertModeration(
			message.guild.id,
			'kick',
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
}
