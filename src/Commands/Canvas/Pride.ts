import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	AwaitMessagesOptions,
	CommandInteraction,
	Message,
	MessageAttachment,
} from 'discord.js';

export default class PrideCommand extends BaseCommand {
	constructor() {
		super(
			'pride',
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

		if (message.mentions.members.size == 1) {
			const m = await message.channel.send({ embeds: [gEmbed] });

			const user = message.mentions.members.first();

			const avatar = user.user.displayAvatarURL({ format: 'png' });
			const image = this.Canvas.Pride(avatar);
			const file = new MessageAttachment(image.file, 'pride.png');

			const embed = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Pride command',
				description: guild.Strings.NekosBot,
				image: 'attachment://pride.png',
			});

			m.delete();
			return message.channel.send({ files: [file], embeds: embed });
		}

		if (args[0] && args[0].toLowerCase().includes('me')) {
			const m = await message.channel.send({ embeds: [gEmbed] });

			const user = message.author;

			const avatar = user.displayAvatarURL({ format: 'png' });
			const image = await this.Canvas.Pride(avatar);
			const file = new MessageAttachment(image.file, 'pride.png');

			const embed = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Pride command',
				description: guild.Strings.NekosBot,
				image: 'attachment://pride.png',
			});

			m.delete();
			return message.channel.send({ files: [file], embeds: [embed] });
		}

		if (args[0] && args[0].toLowerCase().includes('help')) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				event: { message: message },
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

			const m = await message.channel.send({ embeds: [gEmbed] });

			const image = this.Canvas.Pride(attach);
			const file = new MessageAttachment(image.file, 'pride.png');

			const embed = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Pride command',
				description: guild.Strings.NekosBot,
				image: 'attachment://pride.png',
			});

			m.delete();
			return message.channel.send({ files: [file], embeds: [embed] });
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
