import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class CryCommand extends BaseCommand {
	constructor() {
		super(
			'cry',
			'reaction images',
			[],
			'',
			'Cry 😢',
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

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		} else {
			const generatingEmbed = await this.GeneratingEmbed.NekosFun({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});

			const m = await message.channel.send({ embeds: [generatingEmbed] });
			try {
				const res = await this.Reactions.Cry();

				if (res.error == true) {
					m.delete();

					const errEmbed = await this.ErrorEmbed.ApiError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});

					const msg = await message.channel.send({ embeds: [errEmbed] });
					return this.Utils.Delete(msg);
				}

				const imageEmbed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: self,
					title: `Cry command`,
					description: `<@${message.author.id}> is crying :sob:`,
					image: res.file,
				});

				m.delete();
				return message.channel.send({ embeds: [imageEmbed] });
			} catch (e) {
				m.delete();

				return message.channel.send({
					embeds: [
						await this.ErrorEmbed.UnexpectedError({
							id: message.guild.id,
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: self,
						}),
					],
				});
			}
		}
	}
}
