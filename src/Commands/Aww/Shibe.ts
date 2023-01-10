import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, CommandInteraction, MessageFlags } from 'discord.js';

export default class ShibeCommand extends BaseCommand {
	constructor() {
		super(
			'shibe',
			'aww',
			[],
			'',
			'Sends a picture of a shiba inu',
			'',
			[],
			[],
			['SendMessages', 'EmbedLinks'],
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
				iconURL: message.author.displayAvatarURL(),
				command: this,
				accessor: message,
			});
		}

		const generatingEmbed = await this.GeneratingEmbed.Base({
			accessor: message,
			text: this,
			provider: 'Shibe Online API',
		});
		const m = await message.reply({ embeds: [generatingEmbed] });

		try {
			const res = await this.Animals.Shibe();

			if (res.error == true) {
				const errEmbed = await this.ErrorEmbed.ApiError({
					accessor: message,
					text: this,
				});

				return await m.edit({ embeds: [errEmbed] });
			}

			const embed = await this.ImageEmbed.Base({
				accessor: message,
				text: this,
				title: 'Shibe command',
				description: this.Utils.FormatProvider('Shibe online API'),
				image: res.file,
			});

			return await m.edit({ embeds: [embed] });
		} catch (e) {
			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				accessor: message,
				text: this,
			});

			return await m.edit({ embeds: [errEmbed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const gEmbed = await this.GeneratingEmbed.Base({
			accessor: interaction,
			text: this,
			provider: 'Shibe Online API',
		});

		await interaction.editReply({ embeds: [gEmbed] });

		try {
			const res = await this.Animals.Shibe();

			if (res.error == true) {
				const errEmbed = await this.ErrorEmbed.ApiError({
					accessor: interaction,
					text: this,
				});

				return await interaction.editReply({ embeds: [errEmbed] });
			}

			const embed = await this.ImageEmbed.Base({
				accessor: interaction,
				text: this,
				title: 'Shibe command',
				description: this.Utils.FormatProvider('Shibe online API'),
				image: res.file,
			});

			return await interaction.editReply({ embeds: [embed] });
		} catch (error) {
			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				accessor: interaction,
				text: this,
			});

			return interaction.editReply({ embeds: [errEmbed] });
		}
	}
}
