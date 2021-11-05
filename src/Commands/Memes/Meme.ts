import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, GuildMember, Message, MessageFlags } from 'discord.js';

export default class MemeCommand extends BaseCommand {
	constructor() {
		super(
			'meme',
			'memes',
			[],
			'',
			'Sends a random meme',
			'',
			[],
			[],
			[],
			[],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(
		client: DiscordClient,
		message: Message,
		args: string[]
	): Promise<Message> {
		const gEmbed = await this.GeneratingEmbed.SomeRandomApi({
			accessor: message,
			text: this,
		});

		const m = await message.reply({ embeds: [gEmbed] });

		try {
			const res = await this.Memes.Meme();

			if (res.error == true) {
				const embed = await this.ErrorEmbed.ApiError({
					accessor: message,
					text: this,
				});

				return await m.edit({ embeds: [embed] });
			}

			const embed = await this.ImageEmbed.Base({
				iconURL: message.member.displayAvatarURL({ dynamic: true }),
				text: this,
				title: res.text,
				description: `Category: ${res.misc.category}`,
				image: res.file,
			});

			return await m.edit({ embeds: [embed] });
		} catch (error) {
			// console.log(error);

			const embed = await this.ErrorEmbed.UnexpectedError({
				accessor: message,
				text: this,
			});

			return await m.edit({ embeds: [embed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const gEmbed = await this.GeneratingEmbed.SomeRandomApi({
			accessor: interaction,
			text: this,
		});

		await interaction.reply({ embeds: [gEmbed] });

		try {
			const res = await this.Memes.Meme();

			if (res.error == true) {
				const embed = await this.ErrorEmbed.ApiError({
					accessor: interaction,
					text: this,
				});

				return await interaction.editReply({ embeds: [embed] });
			}

			const embed = await this.ImageEmbed.Base({
				iconURL: this.Utils.GetIcon(interaction),
				text: this,
				title: res.text,
				description: `Category: ${res.misc.category}`,
				image: res.file,
			});

			return await interaction.editReply({ embeds: [embed] })
		} catch (error) {
			const embed = await this.ErrorEmbed.UnexpectedError({
				accessor: interaction,
				text: this,
			});

			return await interaction.editReply({ embeds: [embed] });
		}
	}
}
