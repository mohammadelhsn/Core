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

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				event: { message: message },
			});
		}

		const generatingEmbed = await this.GeneratingEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			text: this,
			provider: 'Shibe Online API',
		});
		const m = await message.channel.send({ embeds: [generatingEmbed] });

		try {
			const res = await this.Animals.Shibe();

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
				title: 'Shibe command',
				description: `${this.Utils.Capitalize(
					this.Translator.Getstring(lang, 'provided_by')
				)}: \`Shibe online API\``,
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
		const sub = interaction.options.getSubcommand();

		const lang = await this.Translator.Getlang(interaction.guild.id);

		if (sub == 'help') {
			return await this.HelpEmbed.Base({
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				command: this,
				event: { interaction: interaction },
			});
		}

		const generatingEmbed = await this.GeneratingEmbed.Base({
			iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			text: this,
			id: interaction.guild.id,
			provider: 'Shibe Online API',
		});

		await interaction.reply({ embeds: [generatingEmbed] });

		try {
			const res = await this.Animals.Shibe();

			const embed = await this.ImageEmbed.Base({
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Shibe command',
				description: `${this.Utils.Capitalize(
					this.Translator.Getstring(lang, 'provided_by')
				)}: \`Shibe online API\``,
				image: res.file,
			});

			return interaction.editReply({ embeds: [embed] });
		} catch (error) {
			console.log(error);

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				id: interaction.guild.id,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				text: this,
			});
			return interaction.editReply({ embeds: [errEmbed] });
		}
	}
}
