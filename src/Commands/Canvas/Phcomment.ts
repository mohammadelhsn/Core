import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { AwaitMessagesOptions, Message, MessageAttachment } from 'discord.js';

export default class PhcommentCommand extends BaseCommand {
	constructor() {
		super(
			'phcomment',
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

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		let timedOut = false;

		const isFromAuthor = (m) => m.author.id == message.author.id;

		const options: AwaitMessagesOptions = {
			filter: isFromAuthor,
			max: 1,
			time: 60000,
		};

		const tEmbed = this.Embed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			description:
				'Please mention someone / send an attachment / say me for an avatar',
			text: this,
		});

		await message.channel.send({ embeds: [tEmbed] });

		const firstColl = await message.channel.awaitMessages(options);

		if (firstColl.size > 0) {
			let avatar;
			if (firstColl.first().mentions.members.size > 0)
				avatar = firstColl
					.first()
					.mentions.members.first()
					.user.displayAvatarURL({ format: 'png' });
			if (firstColl.first().attachments.size > 0)
				avatar = firstColl.first().attachments.first().url;
			if (
				firstColl.first().content &&
				firstColl.first().content.toLowerCase() == 'cancel'
			)
				timedOut = true;
			if (
				firstColl.first().content &&
				firstColl.first().content.toLowerCase() == 'me'
			)
				avatar = firstColl.first().author.displayAvatarURL({ format: 'png' });

			const dEmbed = this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				description: 'Please specifiy a username for the comment',
				text: this,
			});

			await message.channel.send({ embeds: [dEmbed] });

			const secondColl = await message.channel.awaitMessages(options);

			if (
				secondColl.size > 0 &&
				secondColl.first().content &&
				timedOut != true
			) {
				if (secondColl.first().content.toLowerCase().includes('cancel'))
					timedOut = true;
				if (secondColl.first().content.length > 25 && timedOut != true) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						error_message: 'This username is too long',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				const title = secondColl.first().content;

				const cEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					description: 'Please specifiy the content for the comment',
				});

				await message.channel.send({ embeds: [cEmbed] });

				const thirdColl = await message.channel.awaitMessages(options);

				if (
					thirdColl.size > 0 &&
					thirdColl.first().content &&
					timedOut != true
				) {
					if (thirdColl.first().content.toLowerCase() == 'cancel')
						timedOut = true;
					if (thirdColl.first().content.length > 1000 && timedOut != true) {
						const embed = await this.ErrorEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
							error_message:
								'Content is too long! Comment content has to be under 1000 characters',
						});

						const msg = await message.channel.send({ embeds: [embed] });
						return this.Utils.Delete(msg);
					}

					const content = thirdColl.first().content;

					const image = await this.Canvas.Phcomment(avatar, title, content);
					const file = new MessageAttachment(image.file, 'phcomment.png');

					const embed = await this.ImageEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: 'Phcomment command',
						description: guild.Strings.SomeRandomAPI,
						image: '',
					});

					return await message.channel.send({
						files: [file],
						embeds: [embed],
					});
				} else timedOut = true;
			} else timedOut = true;
		} else timedOut = true;

		if (timedOut == true) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Command timed out',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}
	}
}
