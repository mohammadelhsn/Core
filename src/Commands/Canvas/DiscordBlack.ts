import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, MessageAttachment } from 'discord.js';
import { DiscordBlack } from 'discord-image-generation';

export default class DiscordBlackCommand extends BaseCommand {
	constructor() {
		super(
			'discordblack',
			'canvas',
			['discord-black', 'discord_black'],
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

		const mention = message.mentions.members.first();

		const gEmbed = await this.GeneratingEmbed.DiscordIG({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			text: this,
		});

		if (mention) {
			const m = await message.channel.send({ embed: gEmbed });

			try {
				const avatar = mention.user.displayAvatarURL({ format: 'png' });
				const image = await new DiscordBlack().getImage(avatar);
				const file = new MessageAttachment(image, 'discord_black.png');

				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'DiscordBlack command',
					description: guild.Strings.DiscordIG,
					image: 'attachment://discord_black.png',
				});

				m.delete();
				return message.channel.send({ files: [file], embed: embed });
			} catch (error) {
				console.log(error);

				m.delete();
				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return message.channel.send({ embed: embed });
			}
		}

		if (args[0]) {
			if (args[0].toLowerCase().includes('help')) {
				return await this.HelpEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					command: this,
					message: message,
				});
			}
			if (args[0].toLowerCase().includes('me')) {
				const m = await message.channel.send({ embed: gEmbed });

				try {
					const avatar = message.author.displayAvatarURL({ format: 'png' });
					const image = await new DiscordBlack().getImage(avatar);
					const file = new MessageAttachment(image, 'discord_black.png');

					const embed = await this.ImageEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: 'DiscordBlack command',
						description: guild.Strings.DiscordIG,
						image: 'attachment://discord_black.png',
					});

					m.delete();
					return message.channel.send({ files: [file], embed: embed });
				} catch (error) {
					m.delete();

					const embed = await this.ErrorEmbed.UnexpectedError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});

					return message.channel.send({ embed: embed });
				}
			}
		}

		if (message.attachments.size > 0) {
			const m = await message.channel.send({ embed: gEmbed });

			try {
				const avatar = message.attachments.first().url;
				const image = await new DiscordBlack().getImage(avatar);
				const file = new MessageAttachment(image, 'discord_black.png');

				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'DiscordBlack command',
					description: guild.Strings.DiscordIG,
					image: 'attachment://discord_black.png',
				});

				m.delete();
				return message.channel.send({ files: [file], embed: embed });
			} catch (error) {
				m.delete();
				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return message.channel.send({ embed: embed });
			}
		}

		let timedOut: boolean = false;

		const isFromAuthor = (m) => m.author.id == message.author.id;

		const options = {
			max: 1,
			time: 60000,
		};

		const tEmbed = await this.Embed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			title: 'DiscordBlack command',
			description: `Please send the first image you want.`,
		});
		await message.channel.send({ embed: tEmbed });

		const firstColl = await message.channel.awaitMessages(
			isFromAuthor,
			options
		);

		if (firstColl.size > 0) {
			if (firstColl.first()?.content == 'cancel') {
				const embed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					success_message: 'Successfully cancelled selection',
				});

				const msg = await message.channel.send({ embed: embed });
				return msg.delete({ timeout: 10000 });
			}
			if (firstColl.first().attachments.size > 0) {
				const m = await message.channel.send({ embed: gEmbed });

				try {
					const avatar = firstColl.first().attachments.first().url;
					const image = await new DiscordBlack().getImage(avatar);
					const file = new MessageAttachment(image, 'discord_black.png');

					const embed = await this.ImageEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: 'DiscordBlack command',
						description: guild.Strings.DiscordIG,
						image: 'attachment://discord_black.png',
					});

					m.delete();
					return message.channel.send({ files: [file], embed: embed });
				} catch (error) {}
			} else timedOut = true;
		} else timedOut = true;

		if (timedOut == true) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Command timed out',
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}
	}
}
