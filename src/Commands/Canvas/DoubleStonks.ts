import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, MessageAttachment } from 'discord.js';
import { DoubleStonk } from 'discord-image-generation';

export default class DoubleStonksCommand extends BaseCommand {
	constructor() {
		super(
			'doublestonks',
			'canvas',
			['double_stonks', 'double-stonks'],
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
			const m = await message.channel.send({ embed: gEmbed });

			const user1 = message.mentions.members
				.first()
				.user.displayAvatarURL({ format: 'png' });
			const user2 = message.mentions.members
				.last()
				.user.displayAvatarURL({ format: 'png' });

			try {
				const image = await new DoubleStonk().getImage(user1, user2);
				const file = new MessageAttachment(image, 'double_stonk.png');

				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'DoubleStonk command',
					description: guild.Strings.DiscordIG,
					image: 'attachment://double_stonk.png',
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

		if (message.mentions.members.size == 1) {
			const m = await message.channel.send({ embed: gEmbed });

			const user1 = message.mentions.members
				.first()
				.user.displayAvatarURL({ format: 'png' });
			const user2 = message.author.displayAvatarURL({ format: 'png' });

			try {
				const image = await new DoubleStonk().getImage(user2, user1);
				const file = new MessageAttachment(image, 'double_stonk.png');

				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'DoubleStonk command',
					description: guild.Strings.DiscordIG,
					image: 'attachment://double_stonk.png',
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

		if (args[0] && args[0].toLowerCase().includes('help')) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		if (message.attachments.size > 2) {
			const m = await message.channel.send({ embed: gEmbed });

			const user1 = message.attachments.first().url;
			const user2 = message.attachments.last().url;

			try {
				const image = await new DoubleStonk().getImage(user1, user2);
				const file = new MessageAttachment(image, 'double_stonk.png');

				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'DoubleStonk command',
					description: guild.Strings.DiscordIG,
					image: 'attachment://double_stonk.png',
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

		if (message.attachments.size == 1) {
			if (message.attachments.size > 2) {
				const m = await message.channel.send({ embed: gEmbed });

				const user1 = message.attachments.first().url;
				const user2 = message.author.displayAvatarURL({ format: 'png' });

				try {
					const image = await new DoubleStonk().getImage(user2, user1);
					const file = new MessageAttachment(image, 'double_stonk.png');

					const embed = await this.ImageEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: 'DoubleStonk command',
						description: guild.Strings.DiscordIG,
						image: 'attachment://double_stonk.png',
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

		let timedOut = false;

		const isFromAuthor = (m) => m.author.id == message.author.id;

		const options = {
			max: 1,
			time: 60000,
		};

		const tEmbed = await this.Embed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			title: 'DoubleStonk command',
			description: 'Attach the first image',
		});
		await message.channel.send({ embed: tEmbed });

		const firstColl = await message.channel.awaitMessages(
			isFromAuthor,
			options
		);

		if (firstColl.size > 0) {
			const attach = firstColl.first().attachments.first().url;

			const dEmbed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'DoubleStonk command',
				description: 'Please attach the second image',
			});

			await message.channel.send({ embed: dEmbed });
			const secondColl = await message.channel.awaitMessages(
				isFromAuthor,
				options
			);

			if (secondColl.size > 0) {
				const attach2 = secondColl.first().attachments.first().url;

				const gEmbed = await this.GeneratingEmbed.DiscordIG({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				const m = await message.channel.send({ embed: gEmbed });
				try {
					const image = await new DoubleStonk().getImage(attach, attach2);
					const attachment = new MessageAttachment(image, 'double_stonk.png');

					const embed = await this.ImageEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: 'DoubleStonk command',
						description: guild.Strings.DiscordIG,
						image: 'attachment://double_stonk.png',
					});

					m.delete();
					return message.channel.send({ files: [attachment], embed: embed });
				} catch (e) {
					m.delete();
					console.log(e);

					const errorEmbed = await this.ErrorEmbed.UnexpectedError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});
					return message.channel.send({ embed: errorEmbed });
				}
			} else {
				timedOut = true;
			}
		} else {
			timedOut = true;
		}

		if (timedOut === true) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Timed out',
			});
			const msg = await message.channel.send({ embed: errorEmbed });
			return msg.delete({ timeout: 10000 });
		}
	}
}
