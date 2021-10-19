import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class FoxfactCommand extends BaseCommand {
	constructor() {
		super(
			'foxfact',
			'facts',
			[],
			'',
			'Sends a fox fact',
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

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				event: { message: message },
			});
		} else {
			const generatingEmbed = await this.GeneratingEmbed.SomeRandomApi({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});
			const m = await message.channel.send({ embeds: [generatingEmbed] });
			try {
				const res = await this.Facts.Foxfact();

				const factEmbed = await this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Foxfact command',
					description: `${this.Utils.Capitalize(
						this.Translator.Getstring(lang, 'provided_by')
					)}: \`Some-random-api API\``,
					fields: [{ name: 'Fact:', value: `\`${res.text}\`` }],
				});

				m.delete();
				return message.channel.send({ embeds: [factEmbed] });
			} catch (e) {
				m.delete();
				console.log(e);

				const errorEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
				});
				return message.channel.send({ embeds: [errorEmbed] });
			}
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
