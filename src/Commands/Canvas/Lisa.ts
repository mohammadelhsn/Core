import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, MessageAttachment } from 'discord.js';
import { LisaPresentation } from 'discord-image-generation';

export default class LisaCommand extends BaseCommand {
	constructor() {
		super(
			'lisa',
			'',
			['presentation'],
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

		if (args[0] && args[0].toLowerCase() == 'help') {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		const gEmbed = await this.GeneratingEmbed.DiscordIG({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			id: message.guild.id,
		});

		if (args[0]) {
			const m = await message.channel.send({ embed: gEmbed });

			const text = args.join(' ');
			const image = await new LisaPresentation().getImage(text);
			const file = new MessageAttachment(image, 'lisa.png');

			const embed = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				title: 'Lisa command',
				description: guild.Strings.DiscordIG,
				text: this,
				image: 'attachment://lisa.png',
			});

			m.delete();
			return message.channel.send({ files: [file], embed: embed });
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
			description: 'Please specify text for the presentation',
		});

		await message.channel.send({ embed: tEmbed });

		const firstColl = await message.channel.awaitMessages(
			isFromAuthor,
			options
		);

		if (firstColl.size > 0) {
			const m = await message.channel.send({ embed: gEmbed });

			try {
				const attach = firstColl.first().content;

				const img = await new LisaPresentation().getImage(`${attach}`);
				const attachment = new MessageAttachment(img, 'lisa_presentation.png');
				m.delete();
				return message.channel.send(attachment);
			} catch (e) {
				m.delete();
				console.log(e);

				const errEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
				});
				return message.channel.send({ embed: errEmbed });
			}
		} else {
			timedOut = true;
		}

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
