import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class AdviceCommand extends BaseCommand {
	constructor() {
		super(
			'advice',
			'fun',
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

		if (args[0] && args[0].toLowerCase().includes('help')) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		const generatingEmbed = await this.GeneratingEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			text: this,
			provider: 'Advice slip API',
		});

		const m = await message.channel.send({ embed: generatingEmbed });

		try {
			const res = await this.Fun.Advice();

			if (res.error == true) {
				m.delete();

				const embed = await this.ErrorEmbed.ApiError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				const msg = await message.channel.send({ embed: embed });
				return msg.delete({ timeout: 10000 });
			}

			const embed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				description: `${this.Utils.Capitalize(
					this.Translator.Getstring(lang, 'provided_by')
				)}: \`Advice slip API\``,
				fields: [
					{ name: 'Advice', value: `\`${res.text}\`` },
					{ name: 'ID:', value: `\`${res.id}\`` },
				],
			});

			m.delete();
			return message.channel.send({ embed: embed });
		} catch (e) {
			m.delete();

			const errorEmbed = await this.ErrorEmbed.UnexpectedError({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});
			return message.channel.send({ embed: errorEmbed });
		}
	}
}