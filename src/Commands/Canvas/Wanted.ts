import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, MessageAttachment } from 'discord.js';
import { Wanted } from 'discord-image-generation';

export default class WantedCommand extends BaseCommand {
	constructor() {
		super(
			'wanted',
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
		const mention = message.mentions.members.first();

		const gEmbed = await this.GeneratingEmbed.DiscordIG({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			id: message.guild.id,
		});

		if (mention) {
			const currency = args[1];

			if (!currency) {
				const errorEmbed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message: 'You must specifiy a currency',
				});

				const msg = await message.channel.send({ embed: errorEmbed });
				return msg.delete({ timeout: 10000 });
			}
			const avatar = message.mentions.members
				.first()
				.user.displayAvatarURL({ format: 'png' });

			const m = await message.channel.send({ embed: gEmbed });

			try {
				const image = await new Wanted().getImage(`${avatar}`, `${currency}`);
				const file = new MessageAttachment(image, 'wanted.png');

				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Wanted command',
					description: guild.Strings.DiscordIG,
					image: 'attachment://wanted.png',
				});

				m.delete();
				return message.channel.send({ files: [file], embed: embed });
			} catch (e) {
				m.delete();
				console.log(e);

				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return message.channel.send({ embed: embed });
			}
		} else if (args[0] == 'me') {
			const currency = args[1];

			if (!currency) {
				const errorEmbed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message: 'You must specifiy a currency',
				});

				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}

			const m = await message.channel.send({ embed: gEmbed });

			try {
				const avatar = message.author.displayAvatarURL({ format: 'png' });
				const image = await new Wanted().getImage(`${avatar}`, `${currency}`);
				const file = new MessageAttachment(image, 'wanted.png');

				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Wanted command',
					description: guild.Strings.DiscordIG,
					image: 'attachment://wanted.png',
				});

				m.delete();
				return message.channel.send({ files: [file], embed: embed });
			} catch (e) {
				m.delete();
				console.log(e);

				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return message.channel.send({ embed: embed });
			}
		} else if (args[0] == 'help') {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}
		let timedOut = false;

		const isFromAuthor = (m) => m.author.id == message.author.id;

		const options = {
			max: 1,
			time: 60000,
		};

		const tEmbed = this.Embed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			description: 'Please sent the first image!',
		});
		await message.channel.send({ embed: tEmbed });

		const firstColl = await message.channel.awaitMessages(
			isFromAuthor,
			options
		);

		if (firstColl.size > 0) {
			if (firstColl.first().attachments.size <= 0) {
				const errorEmbed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message: 'Must be an attachment!',
				});

				const msg = await message.channel.send({ embed: errorEmbed });
				return msg.delete({ timeout: 10000 });
			}
			const attach = firstColl.first().attachments.first().url;

			const dEmbed = this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				description: 'Please mention a currency for the picture! "ex: $"',
			});

			await message.channel.send({ embed: dEmbed });

			const secondColl = await message.channel.awaitMessages(
				isFromAuthor,
				options
			);

			if (secondColl.size > 0) {
				const attach2 = secondColl.first().content;

				const m = await message.channel.send({ embed: gEmbed });
				try {
					const image = await new Wanted().getImage(`${attach}`, `${attach2}`);
					const file = new MessageAttachment(image, 'wanted.png');

					const embed = await this.ImageEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: 'Wanted command',
						description: guild.Strings.DiscordIG,
						image: 'attachment://wanted.png',
					});

					m.delete();
					return message.channel.send({ files: [file], embed: embed });
				} catch (e) {
					m.delete();
					console.log(e);

					const embed = await this.ErrorEmbed.UnexpectedError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});

					return message.channel.send({ embed: embed });
				}
			} else timedOut = true;
		} else timedOut = true;

		if (timedOut === true) {
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
