import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	GuildChannel,
	Message,
	TextChannel,
	Permissions,
	AwaitMessagesOptions,
} from 'discord.js';

export default class AnnounceCommand extends BaseCommand {
	constructor() {
		super(
			'announce',
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
				Permissions.FLAGS.MANAGE_GUILD || Permissions.FLAGS.ADMINISTRATOR,
			])
		) {
			const errorEmbed = await this.ErrorEmbed.UserPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				perms: ['MANAGE_GUILD', 'ADMINISTRATOR'],
			});

			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return this.Utils.Delete(msg);
		}

		let timedOut = false;

		const options: AwaitMessagesOptions = {
			filter: (m) => m.author.id == message.author.id,
			max: 1,
			time: 60000,
		};

		const tEmbed = this.Embed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			title: `Announce command setup`,
			description: `Please mention a title for the announcement`,
		});

		await message.channel.send({ embeds: [tEmbed] });

		const firstColl = await message.channel.awaitMessages(options);

		if (firstColl.size > 0) {
			const title = firstColl.first().content;

			const dEmbed = this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `Announce command setup`,
				description: `Please mention the content for the announcement`,
			});

			await message.channel.send({ embeds: [dEmbed] });

			const secondColl = await message.channel.awaitMessages(options);

			if (secondColl.size > 0) {
				const description = secondColl.first().content;

				const cEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Announce command setup`,
					description: `Please mention a channel.`,
				});

				await message.channel.send({ embeds: [cEmbed] });

				const thridColl = await message.channel.awaitMessages(options);

				if (thridColl.size > 0) {
					const result = thridColl.first().content;
					const msg = thridColl.first();
					let channel =
						message.guild.channels.cache.find((c) => c.name === result) ||
						message.guild.channels.cache.find((c) => c.id === result) ||
						msg.mentions.channels.first();

					if (channel.type != 'GUILD_TEXT') return;

					const channelId = channel.id;

					const embed = this.Embed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: title,
						description: description,
					});

					(client.channels.cache.get(channelId) as TextChannel).send({
						embeds: [embed],
					});
				} else timedOut = true;
			} else timedOut = true;
		} else timedOut = true;

		if (timedOut) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Command timed out!',
			});

			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return this.Utils.Delete(msg);
		}
	}
}
