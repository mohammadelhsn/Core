import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class WinkCommand extends BaseCommand {
	constructor() {
		super(
			'wink',
			'reaction images',
			[],
			'',
			'Wink 😉',
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
		// Endpoint: https://some-random-api.ml/animu/wink

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				event: { message: message },
			});
		} else {
			const generatingEmbed = await this.GeneratingEmbed.SomeRandomApi({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});

			const m = await message.channel.send({ embeds: [generatingEmbed] });
			try {
				const res = await this.Reactions.Wink();

				if (res.error == true) {
					if (!m.deleted) m.delete();

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
					text: this,
					title: 'Wink command',
					description: `<@${message.author.id}> winks! ;)`,
					image: res.file,
				});

				if (!m.deleted) m.delete();
				return message.channel.send({ embeds: [imageEmbed] });
			} catch (e) {
				if (!m.deleted) m.delete();

				const errEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});
				return message.channel.send({ embeds: [errEmbed] });
			}
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const generatingEmbed = await this.GeneratingEmbed.NekosFun({
			accessor: interaction,
			text: this,
		});

		await interaction.reply({ embeds: [generatingEmbed] });

		try {
			const res = await this.Reactions.Wink();

			if (res.error == true) {
				const embed = await this.ErrorEmbed.ApiError({
					accessor: interaction,
					text: this,
				});

				return interaction.replied
					? await interaction.editReply({ embeds: [embed] })
					: await interaction.reply({ embeds: [embed] });
			}

			const embed = await this.ImageEmbed.Base({
				accessor: interaction,
				text: this,
				title: 'Wink command',
				description: `${interaction.user.toString()} winks! ;)`,
				image: res.file,
			});

			return await interaction.editReply({ embeds: [embed] });
		} catch (error) {
			console.log('Error', error);

			const embed = await this.ErrorEmbed.UnexpectedError({
				accessor: interaction,
				text: this,
			});

			return interaction.replied
				? await interaction.editReply({ embeds: [embed] })
				: await interaction.reply({ embeds: [embed] });
		}
	}
}
