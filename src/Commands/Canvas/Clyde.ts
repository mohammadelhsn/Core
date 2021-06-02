import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, MessageAttachment } from 'discord.js';

export default class ClydeCommand extends BaseCommand {
	constructor() {
		super(
			'clyde',
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
	async run(
		client: DiscordClient,
		message: Message,
		args: string[]
	): Promise<Message | void> {
		const guild = client.database.get(message.guild.id);

		const text = args.join(' ');

		if (!text) {
			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				error_message: 'Misisng the required text argument',
				id: message.guild.id,
			});

			const msg = await message.channel.send({ embed: errEmbed });
			return msg.delete({ timeout: 10000 });
		}

		const gEmbed = await this.GeneratingEmbed.DiscordIG({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			text: this,
		});

		if (text.toLowerCase() == 'help') {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				message: message,
				command: this,
			});
		}

		const m = await message.channel.send({ embed: gEmbed });

		try {
			const image = await this.Canvas.Clyde(text);
			const file = new MessageAttachment(image.file, 'clyde.png');

			const embed = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Clyde command',
				description: guild.Strings.NekosBot,
				image: 'attachment://clyde.png',
			});

			m.delete();
			return message.channel.send({ files: [file], embed: embed });
		} catch (error) {
			m.delete();
		}
	}
}
