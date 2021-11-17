import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class FeedCommand extends BaseCommand {
	constructor() {
		super(
			'feed',
			'reaction images',
			[],
			'<mention>',
			'Feed the mentioned user',
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
		const mention = message.mentions.users.first();

		if (!mention) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'You are missing the mention',
			});

			return await message.reply({ embeds: [errorEmbed] });
		}

		if (args[0] && args[0]?.toLowerCase().includes('help')) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				accessor: message,
				command: this,
			});
		}

		const generatingEmbed = await this.GeneratingEmbed.NekosFun({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			text: this,
		});

		const m = await message.reply({ embeds: [generatingEmbed] });

		try {
			const res = await this.Reactions.Feed();

			if (res.error == true) {
				const errEmbed = await this.ErrorEmbed.ApiError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return await m.edit({ embeds: [errEmbed] });
			}

			const feedEmbed = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Feed command',
				description: `<@${message.author.id}> has fed ${this.Utils.Mentionuser(
					mention.id
				)}`,
				image: res.file,
			});

			m.delete();
			return message.channel.send({ embeds: [feedEmbed] });
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
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const user = interaction.options.getUser('user');

		if (!user) {
			const errEmbed = await this.ErrorEmbed.Base({
				text: this,
				error_message: 'Missing required user mention',
				accessor: interaction,
			});

			return await interaction.reply({ embeds: [errEmbed] });
		}

		const generatingEmbed = await this.GeneratingEmbed.NekosFun({
			accessor: interaction,
			text: this,
		});

		await interaction.reply({ embeds: [generatingEmbed] });

		try {
			const res = await this.Reactions.Feed();

			if (res.error == true) {
				const errEmbed = await this.ErrorEmbed.ApiError({
					text: this,
					accessor: interaction,
				});

				return await interaction.editReply({ embeds: [errEmbed] });
			}

			const feedEmbed = await this.ImageEmbed.Base({
				text: this,
				title: 'Feed command',
				description: `${interaction.user.toString()} has fed ${user.toString()}`,
				image: res.file,
				accessor: interaction,
			});

			return await interaction.editReply({ embeds: [feedEmbed] });
		} catch (error) {
			console.log(error);

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				accessor: interaction,
				text: this,
			});
			return interaction.editReply({ embeds: [errEmbed] });
		}
	}
}
