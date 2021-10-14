import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	AwaitMessagesOptions,
	CommandInteraction,
	Message,
	MessageAttachment,
} from 'discord.js';

export default class CaptchaCommand extends BaseCommand {
	constructor() {
		super(
			'captcha',
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

		let text = args.slice(1).join(' ');

		if (message.mentions.members.size == 1) {
			const m = await message.channel.send({ embeds: [gEmbed] });

			const user = message.mentions.members.first();

			if (!text) text = user.user.username;

			const avatar = user.user.displayAvatarURL({ format: 'png' });
			const image = await this.Canvas.Captcha(avatar, text);
			const file = new MessageAttachment(image.file, 'captcha.png');

			const embed = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Captcha command',
				description: guild.Strings.NekosBot,
				image: 'attachment://captcha.png',
			});

			m.delete();
			return message.channel.send({ files: [file], embeds: embed });
		}

		if (args[0] && args[0].toLowerCase().includes('me')) {
			const m = await message.channel.send({ embeds: [gEmbed] });

			const user = message.author;

			if (!text) text = user.username;

			const avatar = user.displayAvatarURL({ format: 'png' });
			const image = await this.Canvas.Captcha(avatar, text);
			const file = new MessageAttachment(image.file, 'captcha.png');

			const embed = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Captcha command',
				description: guild.Strings.NekosBot,
				image: 'attachment://captcha.png',
			});

			m.delete();
			return message.channel.send({ files: [file], embeds: [embed] });
		}

		if (args[0] && args[0].toLowerCase().includes('help')) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		let timedOut = false;

		const isFromAuthor = (m) => m.author.id == message.author.id;

		const options: AwaitMessagesOptions = {
			max: 1,
			time: 60000,
		};

		const tEmbed = this.Embed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			description: 'Please send the first image or mention a user',
		});

		await message.channel.send({ embeds: [tEmbed] });

		const firstColl = await message.channel.awaitMessages(options);

		if (firstColl.size > 0) {
			const attach =
				firstColl.first().attachments?.first()?.url ||
				firstColl
					.first()
					.mentions.members.first()
					?.user?.displayAvatarURL({ format: 'png' });

			const dEmbed = this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				description: 'Please reply with some text',
			});

			await message.channel.send({ embeds: [dEmbed] });

			const secondColl = await message.channel.awaitMessages(options);

			if (secondColl.size > 0) {
				const attach2 = secondColl.first().content;

				const m = await message.channel.send({ embeds: [gEmbed] });

				try {
					const image = await this.Canvas.Captcha(attach, attach2);
					const file = new MessageAttachment(image.file, 'captcha.png');

					const embed = await this.ImageEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: 'Captcha command',
						description: guild.Strings.NekosBot,
						image: 'attachment://captcha.png',
					});

					m.delete();
					return message.channel.send({ files: [file], embeds: [embed] });
				} catch (e) {
					console.log(e);

					m.delete();
					const embed = await this.ErrorEmbed.UnexpectedError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});

					return message.channel.send({ embeds: [embed] });
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

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
