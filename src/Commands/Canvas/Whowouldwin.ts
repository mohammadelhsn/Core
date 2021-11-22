import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	AwaitMessagesOptions,
	CommandInteraction,
	Message,
	MessageAttachment,
} from 'discord.js';

export default class WhowouldwinCommand extends BaseCommand {
	constructor() {
		super(
			'whowouldwin',
			'canvas',
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
		const guild = client.database.get(message.guild.id);

		const gEmbed = await this.GeneratingEmbed.DiscordIG({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			text: this,
		});

		if (message.mentions.members.size == 2) {
			const m = await message.channel.send({ embeds: [gEmbed] });

			const user1 = message.mentions.members
				.first()
				.user.displayAvatarURL({ format: 'png' });
			const user2 = message.mentions.members
				.last()
				.user.displayAvatarURL({ format: 'png' });

			try {
				const image = await this.Canvas.Whowouldwin(user1, user2);
				const file = new MessageAttachment(image.file, 'batslap.png');

				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Batslap command',
					description: this.Utils.FormatProvider('Discord IG'),
					image: 'attachment://batslap.png',
				});

				m.delete();
				return message.channel.send({ files: [file], embeds: [embed] });
			} catch (error) {
				m.delete();

				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});
				return message.channel.send({ embeds: [embed] });
			}
		}

		if (message.mentions.members.size == 1) {
			const m = await message.channel.send({ embeds: [gEmbed] });

			const user1 = message.mentions.members
				.first()
				.user.displayAvatarURL({ format: 'png' });
			const user2 = message.author.displayAvatarURL({ format: 'png' });

			try {
				const image = await this.Canvas.Whowouldwin(user2, user1);
				const file = new MessageAttachment(image.file, 'batslap.png');

				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Batslap command',
					description: this.Utils.FormatProvider('Discord IG'),
					image: 'attachment://batslap.png',
				});

				m.delete();
				return message.channel.send({ files: [file], embeds: [embed] });
			} catch (error) {
				m.delete();

				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});
				return message.channel.send({ embeds: [embed] });
			}
		}

		if (args[0] && args[0].toLowerCase().includes('help')) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				accessor: message,
			});
		}

		if (message.attachments.size > 2) {
			const m = await message.channel.send({ embeds: [gEmbed] });

			const user1 = message.attachments.first().url;
			const user2 = message.attachments.last().url;

			try {
				const image = await this.Canvas.Whowouldwin(user1, user2);
				const file = new MessageAttachment(image.file, 'batslap.png');

				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Batslap command',
					description: this.Utils.FormatProvider('Discord IG'),
					image: 'attachment://batslap.png',
				});

				m.delete();
				return message.channel.send({ files: [file], embeds: [embed] });
			} catch (error) {
				m.delete();

				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});
				return message.channel.send({ embeds: [embed] });
			}
		}

		if (message.attachments.size == 1) {
			if (message.attachments.size > 2) {
				const m = await message.channel.send({ embeds: [gEmbed] });

				const user1 = message.attachments.first().url;
				const user2 = message.author.displayAvatarURL({ format: 'png' });

				try {
					const image = await this.Canvas.Whowouldwin(user2, user1);
					const file = new MessageAttachment(image.file, 'batslap.png');

					const embed = await this.ImageEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: 'Batslap command',
						description: this.Utils.FormatProvider('Discord IG'),
						image: 'attachment://batslap.png',
					});

					m.delete();
					return message.channel.send({ files: [file], embeds: [embed] });
				} catch (error) {
					m.delete();

					const embed = await this.ErrorEmbed.UnexpectedError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});
					return message.channel.send({ embeds: [embed] });
				}
			}
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
			title: 'Batslap command',
			description: 'Attach the first image',
		});
		await message.channel.send({ embeds: [tEmbed] });

		const firstColl = await message.channel.awaitMessages(options);

		if (firstColl.size > 0) {
			const attach = firstColl.first().attachments.first().url;

			const dEmbed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Batslap command',
				description: 'Please attach the second image',
			});

			await message.channel.send({ embeds: [dEmbed] });

			const secondColl = await message.channel.awaitMessages(options);

			if (secondColl.size > 0) {
				const attach2 = secondColl.first().attachments.first().url;

				const gEmbed = await this.GeneratingEmbed.DiscordIG({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				const m = await message.channel.send({ embeds: [gEmbed] });
				try {
					const image = await this.Canvas.Whowouldwin(attach, attach2);
					const attachment = new MessageAttachment(image.file, 'batslap.png');

					const embed = await this.ImageEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: 'Batslap command',
						description: this.Utils.FormatProvider('Discord IG'),
						image: 'attachment://batslap.png',
					});

					m.delete();
					return message.channel.send({ files: [attachment], embeds: [embed] });
				} catch (e) {
					m.delete();
					console.log(e);

					const errorEmbed = await this.ErrorEmbed.UnexpectedError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});
					return message.channel.send({ embeds: [errorEmbed] });
				}
			} else timedOut = true;
		} else timedOut = true;

		if (timedOut === true) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Timed out',
			});
			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return this.Utils.Delete(msg);
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
