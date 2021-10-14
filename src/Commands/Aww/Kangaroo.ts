import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message, MessageSelectMenu } from 'discord.js';

export default class KangarooCommand extends BaseCommand {
	constructor() {
		super(
			'kangaroo',
			'category',
			[],
			'',
			'Sends a picture of a kangaroo',
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
		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		const generatingEmbed = await this.GeneratingEmbed.SomeRandomApi({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			text: this,
		});
		const m = await message.channel.send({ embeds: [generatingEmbed] });

		try {
			const res = await this.Animals.Kangaroo();

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

			const embed = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Kangaroo command',
				description: client.database.get(message.guild.id).Strings
					.SomeRandomAPI,
				image: res.file,
			});
			m.delete();
			return message.channel.send({ embeds: [embed] });
		} catch (e) {
			m.delete();

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				id: message.guild.id,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
			});
			return message.channel.send({ embeds: [errEmbed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const embed = await this.GeneratingEmbed.SomeRandomApi({
			iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			text: this,
			id: interaction.guild.id,
		});

		await interaction.reply({ embeds: [embed] });

		try {
			const res = await this.Animals.Kangaroo();

			if (res.error == true) {
				const errEmbed = await this.ErrorEmbed.ApiError({
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
					id: interaction.guild.id,
					text: this,
				});
				const msg = await interaction.channel.send({ embeds: [errEmbed] });
				return this.Utils.Delete(msg);
			}

			const embed = await this.ImageEmbed.Base({
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Kangaroo command',
				description: client.database.get(interaction.guild.id).Strings
					.SomeRandomAPI,
				image: res.file,
			});
			return interaction.editReply({ embeds: [embed] });
		} catch (e) {
			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				id: interaction.guild.id,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				text: this,
			});
			return interaction.editReply({ embeds: [errEmbed] });
		}
	}
}
