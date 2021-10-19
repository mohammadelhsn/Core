import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, CommandInteraction } from 'discord.js';

export default class BirdCommand extends BaseCommand {
	constructor() {
		super(
			'bird',
			'aww',
			[],
			'',
			'Send a picture of a bird',
			'',
			[],
			[],
			['SEND_MESSAGES', 'EMBED_LINKS'],
			[],
			true,
			false,
			false,
			3000,
			'debug'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				accessor: message,
			});
		}

		const generatingEmbed = await this.GeneratingEmbed.Duncte123({
			accessor: message,
			text: this,
		});
		const m = await message.channel.send({ embeds: [generatingEmbed] });

		try {
			const res = await this.Animals.Bird();

			if (res.error == true) {
				m.delete();

				const errEmbed = await this.ErrorEmbed.ApiError({
					accessor: message,
					text: this,
				});
				const msg = await message.channel.send({ embeds: [errEmbed] });
				return this.Utils.Delete(msg);
			}

			const embed = await this.ImageEmbed.Base({
				accessor: message,
				text: this,
				title: 'Bird command',
				description: client.database.get(message.guild.id).Strings.Duncte123,
				image: res.file,
			});
			m.delete();
			return message.channel.send({ embeds: [embed] });
		} catch (e) {
			m.delete();

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				accessor: message,
				text: this,
			});
			return message.channel.send({ embeds: [errEmbed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
