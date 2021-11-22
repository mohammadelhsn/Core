import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class FacepalmCommand extends BaseCommand {
	constructor() {
		super(
			'facepalm',
			'reaction images',
			[],
			'',
			'*facepalm* 🤦‍♂️🤦🤦‍♀️',
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
	async run(
		client: DiscordClient,
		message: Message,
		args: string[]
	): Promise<Message> {
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

		const m = await message.reply({ embeds: [generatingEmbed] });
		try {
			const res = await this.Reactions.Facepalm();

			if (res.error == true) {
				const errEmbed = await this.ErrorEmbed.ApiError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return await m.edit({ embeds: [errEmbed] });
			}

			const imageEmbed = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `Facepalm command`,
				description: `<@${message.author.id}> facepalms 🤦‍♂️🤦‍♀️`,
				image: res.file,
			});

			return m.edit({ embeds: [imageEmbed] });
		} catch (e) {
			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});

			return m.edit({ embeds: [errEmbed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const generatingEmbed = await this.GeneratingEmbed.NekosFun({
			iconURL: this.Utils.GetIcon(interaction),
			id: this.Utils.GetGuildId(interaction),
			text: this,
		});

		await interaction.reply({ embeds: [generatingEmbed] });

		try {
			const res = await this.Reactions.Facepalm();

			if (res.error == true) {
				const errEmbed = await this.ErrorEmbed.ApiError({
					iconURL: this.Utils.GetIcon(interaction),
					id: this.Utils.GetGuildId(interaction),
					text: this,
				});

				return await interaction.editReply({ embeds: [errEmbed] });
			}

			const imageEmbed = await this.ImageEmbed.Base({
				iconURL: this.Utils.GetIcon(interaction),
				text: this,
				title: `Facepalm command`,
				description: `${interaction.user.toString()} facepalms 🤦‍♂️🤦‍♀️`,
				image: res.file,
			});

			return await interaction.editReply({ embeds: [imageEmbed] });
		} catch (error) {
			console.log(error);

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				iconURL: this.Utils.GetGuildId(interaction),
				id: this.Utils.GetGuildId(interaction),
				text: this,
			});
			return interaction.editReply({ embeds: [errEmbed] });
		}
	}
}
