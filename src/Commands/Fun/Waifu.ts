import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class WaifuCommand extends BaseCommand {
	constructor() {
		super(
			'waifu',
			'fun',
			[],
			'',
			'Generates a waifu, just for you!',
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
		} else {
			const generatingEmbed = await this.GeneratingEmbed.NekosFun({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});

			const m = await message.channel.send({ embeds: [generatingEmbed] });
			try {
				const res = await this.Fun.Waifu();

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

				const waifuEmbed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Waifu command`,
					description: `${this.Utils.Capitalize(
						this.Translator.Getstring(lang, 'provided_by')
					)}: \`Nekos Fun API\``,
					image: res.file,
				});

				m.delete();
				return message.channel.send({ embeds: [waifuEmbed] });
			} catch (e) {
				m.delete();

				const errorEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});
				return message.channel.send({ embeds: [errorEmbed] });
			}
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
