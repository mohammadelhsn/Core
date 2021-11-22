import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class FoxgirlCommand extends BaseCommand {
	constructor() {
		super(
			'foxgirl',
			'foxg',
			['foxg'],
			'',
			'Sends a picture of a foxgirl',
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
				accessor: message,
			});
		}

		const generatingEmbed = await this.GeneratingEmbed.NekosFun({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			text: this,
		});

		const m = await message.channel.send({ embeds: [generatingEmbed] });

		try {
			const res = await this.Fun.Foxgirl();

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

			const foxgirl = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `Foxgirl command`,
				description: this.Utils.FormatProvider('Nekos Fun API'),
				image: res.file,
			});

			m.delete();
			return message.channel.send({ embeds: [foxgirl] });
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
		const guild = client.database.get(interaction.guild.id);

		const gEmbed = await this.GeneratingEmbed.NekosFun({
			accessor: interaction,
			text: this,
		});

		await interaction.reply({ embeds: [gEmbed], ephemeral: true });

		try {
			const res = await this.Fun.Foxgirl();

			if (res.error == true) {
				const errEmbed = await this.ErrorEmbed.NoResult({
					text: this,
					accessor: interaction,
				});

				return await interaction.editReply({ embeds: [errEmbed] });
			}

			const foxgirl = await this.ImageEmbed.Base({
				accessor: interaction,
				text: this,
				title: `Foxgirl command`,
				description: this.Utils.FormatProvider('Nekos Fun API'),
				image: res.file,
			});

			return await interaction.editReply({ embeds: [foxgirl] });
		} catch (error) {
			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				accessor: interaction,
				text: this,
			});

			return interaction.editReply({ embeds: [errEmbed] });
		}
	}
}
