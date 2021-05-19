import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class NekoCommand extends BaseCommand {
	constructor() {
		super(
			'neko',
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
		const lang = await this.Translator.Getlang(message.guild.id)
		const guild = client.database.get(message.guild.id);

		if (args[0]) {
			if (args[0].toLowerCase().includes('help')) {
				return await this.HelpEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					command: this,
					message: message,
				});
			}
		}

		const generatingEmbed = await this.GeneratingEmbed.NekosFun({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			text: this,
		});

		const m = await message.channel.send({ embed: generatingEmbed });
		try {
			const res = await this.Fun.Neko();

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

			const embed = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Neko command',
				description: `${this.Utils.Capitalize(
					this.Translator.Getstring(lang, 'provided_by')
				)}: \`Nekos Fun API\``,
				image: res.file,
			});

			m.delete();
			return message.channel.send({ embed: embed });
		} catch (e) {
			m.delete();
			console.log(e);

			const errorEmbed = await this.ErrorEmbed.UnexpectedError({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});
			return message.channel.send({ embed: errorEmbed });
		}
	}
}
