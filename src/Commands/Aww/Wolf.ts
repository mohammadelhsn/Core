import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class WolfCommand extends BaseCommand {
	constructor() {
		super('wolf', 'aww', []);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		const generatingEmbed = await this.GeneratingEmbed.Duncte123({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			text: this,
		});
		const m = await message.channel.send({ embed: generatingEmbed });

		try {
			const res = await this.Animals.Wolf();

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
				title: 'Wolf command',
				description: client.database.get(message.guild.id).Strings.Duncte123,
				image: res.file,
			});
			m.delete();
			return message.channel.send({ embed: embed });
		} catch (e) {
			m.delete();

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				id: message.guild.id,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
			});
			return message.channel.send({ embed: errEmbed });
		}
	}
}
