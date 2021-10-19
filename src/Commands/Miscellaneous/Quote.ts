import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';
import kote from 'kote-api';

export default class QuoteCommand extends BaseCommand {
	constructor() {
		super(
			'quote',
			'miscellaneous',
			[],
			'',
			'Get a random quote',
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
		const self = this;

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				event: { message: message },
			});
		}

		const gEmbed = await this.GeneratingEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			text: this,
			provider: 'Kote API',
		});

		const m = await message.channel.send({ embeds: [gEmbed] });

		try {
			const res = await kote.brainyQuote();
			const q = res.quote;

			const embed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				description: `${this.Utils.Capitalize(
					this.Translator.Getstring(lang, 'provided_by')
				)}: \`Kote API\``,
				fields: [{ name: 'Quote', value: `\`${q}\`` }],
			});

			m.delete();
			return message.channel.send({ embeds: [embed] });
		} catch (e) {
			m.delete();
			console.log(e);

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});
			return message.channel.send({ embeds: [errEmbed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
