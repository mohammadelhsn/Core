import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class DogfactCommand extends BaseCommand {
	constructor() {
		super(
			'dogfact',
			'facts',
			[],
			'',
			'Sends a dog fact',
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
		const self = this;
		const lang = await this.Translator.Getlang(message.guild.id);
		// Endpoint: https://some-random-api.ml/facts/dog

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		} else {
			const generatingEmbed = await this.GeneratingEmbed.SomeRandomApi({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});
			const m = await message.channel.send({ embeds: [generatingEmbed] });
			try {
				const res = await this.Facts.Dogfact();

				if (res.error == true) {
					m.delete();

					const errEmbed = await this.ErrorEmbed.ApiError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
					});
					const msg = await message.channel.send({ embeds: [errEmbed] });
					return this.Utils.Delete(msg);
				}

				const factEmbed = await this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Dogfact command`,
					description: `${this.Utils.Capitalize(
						this.Translator.Getstring(lang, 'provided_by ')
					)}: \`Some-random-api API\``,
					fields: [{ name: 'Fact:', value: res.text }],
				});

				m.delete();
				return message.channel.send({ embeds: [factEmbed] });
			} catch (e) {
				m.delete();

				const errorEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
				});
				return message.channel.send({ embeds: [errorEmbed] });
			}
		}
	}
}
