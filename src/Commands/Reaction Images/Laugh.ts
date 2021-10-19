import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class LaughCommand extends BaseCommand {
	constructor() {
		super(
			'laugh',
			'reaction images',
			['lol', 'lmao'],
			'',
			'*Laughs* 🤣',
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
				const res = await this.Reactions.Laugh();

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
					text: this,
					title: 'Laugh command',
					description: `<@${message.author.id}> laughs!`,
					image: res.file,
				});

				m.delete();
				return message.channel.send({ embeds: [imageEmbed] });
			} catch (e) {
				m.delete();

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
			const res = await this.Reactions.Laugh();

			if (res.error == true) {
				const errEmbed = await this.ErrorEmbed.ApiError({
					accessor: interaction,
					text: this,
				});

				return await interaction.editReply({ embeds: [errEmbed] });
			}

			const imageEmbed = await this.ImageEmbed.Base({
				accessor: interaction,
				text: this,
				title: 'Laugh command',
				description: `${interaction.user.toString()} laughs!`,
				image: res.file,
			});

			return await interaction.editReply({ embeds: [imageEmbed] });
		} catch (error) {
			console.log(error);

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				accessor: interaction,
				text: this,
			});

			return interaction.replied
				? interaction.editReply({ embeds: [errEmbed] })
				: interaction.reply({ embeds: [errEmbed] });
		}
	}
}
