import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class TruthCommand extends BaseCommand {
	constructor() {
		super(
			'truth',
			'fun',
			[],
			'',
			'',
			'',
			[],
			[],
			['SEND_MESSAGES', 'EMBED_LINKS'],
			[],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const lang = await this.Translator.Getlang(message.guild.id);
		const truth = args[0];

		if (truth.toLowerCase() === 'help') {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		const generatingEmbed = await this.GeneratingEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			id: message.guild.id,
			provider: 'Alexflipnote API',
		});

		const m = await message.channel.send({ embed: generatingEmbed });

		if (!truth) {
			m.delete();

			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Missing argument',
			});
			return message.channel.send({ embed: errEmbed });
		}
		const truthEmbed = await this.ImageEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			title: 'Truth command',
			description: `${this.Utils.Capitalize(
				this.Translator.Getstring(lang, 'provided_by')
			)}: \`Alexflip note API\``,
			image: `https://api.alexflipnote.dev/scroll?text=${args.join('%20')}`,
		});

		m.delete();
		return message.channel.send({ embed: truthEmbed });
	}
}
