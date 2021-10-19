import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class BakaCommand extends BaseCommand {
	constructor() {
		super(
			'baka',
			'fun',
			[],
			'',
			'B-\n BAKA!',
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
		const guild = client.database.get(message.guild.id);

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				event: { message: message },
			});
		}
		const gEmbed = await this.GeneratingEmbed.NekosFun({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			id: message.guild.id,
		});

		const m = await message.channel.send({ embeds: [gEmbed] });

		try {
			const res = await this.Fun.Baka();

			if (res.error == true) {
				m.delete();

				const errEmbed = await this.ErrorEmbed.NoResult({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
				});

				const msg = await message.channel.send({ embeds: [errEmbed] });
				return this.Utils.Delete(msg);
			}

			const embed = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Baka command',
				description: guild.Strings.NekosFun,
				image: res.file,
			});

			m.delete();
			return message.channel.send({ embeds: [embed] });
		} catch (e) {
			m.delete();

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});
			return message.channel.send({ embeds: [errEmbed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
