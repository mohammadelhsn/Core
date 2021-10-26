import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class AdviceCommand extends BaseCommand {
	constructor() {
		super(
			'advice',
			'fun',
			[],
			'',
			'Sends you some advice',
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

		if (args[0] && args[0].toLowerCase().includes('help')) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				accessor: message,
			});
		}

		const generatingEmbed = await this.GeneratingEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			text: this,
			provider: 'Advice slip API',
		});

		const m = await message.channel.send({ embeds: [generatingEmbed] });

		try {
			const res = await this.Fun.Advice();

			if (res.error == true) {
				m.delete();

				const embed = await this.ErrorEmbed.ApiError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
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
			return message.channel.send({ embeds: [embed] });
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
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const lang = await this.Translator.Getlang(interaction.guild.id);
		const gEmbed = await this.GeneratingEmbed.Base({
			accessor: interaction,
			text: this,
			provider: 'Advice slip API',
		});

		await interaction.reply({ embeds: [gEmbed] });

		try {
			const res = await this.Fun.Advice();

			if (res.error == true) {
				const errEmbed = await this.ErrorEmbed.NoResult({
					text: this,
					accessor: interaction,
				});

				return await interaction.editReply({ embeds: [errEmbed] });
			}

			const embed = await this.Embed.Base({
				accessor: interaction,
				text: this,
				description: `${this.Utils.Capitalize(
					this.Translator.Getstring(lang, 'provided_by')
				)}: \`Advice slip API\``,
				fields: [
					{ name: 'Advice', value: `\`${res.text}\`` },
					{ name: 'ID:', value: `\`${res.id}\`` },
				],
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
