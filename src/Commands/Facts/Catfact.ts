import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class CatfactCommand extends BaseCommand {
	constructor() {
		super(
			'catfact',
			'facts',
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
		const lang = await this.Translator.Getlang(message.guild.id);
		const self = this;
		// https://some-random-api.ml/facts/cat

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		} else {
			const generatingEmbed = await this.GeneratingEmbed.SomeRandomApi({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});
			const m = await message.channel.send({ embed: generatingEmbed });
			try {
				const res = await this.Facts.Catfact();

				if (res.error == true) {
					m.delete();

					const errEmbed = await this.ErrorEmbed.ApiError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});
					const msg = await message.channel.send({ embed: errEmbed });
					return msg.delete({ timeout: 10000 });
				}

				const factEmbed = await this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Catfact command`,
					description: `${this.Utils.Capitalize(
						this.Translator.Getstring(lang, 'provided_by')
					)}: \`Some-random-api API\``,
					fields: [{ name: 'Fact:', value: `\`${res.text}\`` }],
				});

				m.delete();
				return message.channel.send({ embed: factEmbed });
			} catch (e) {
				m.delete();

				const errorEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
				});
				return message.channel.send({ embed: errorEmbed });
			}
		}
	}
}
