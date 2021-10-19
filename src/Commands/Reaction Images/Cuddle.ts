import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class CuddleCommand extends BaseCommand {
	constructor() {
		super(
			'cuddle',
			'reaction images',
			[],
			'<mention>',
			'Cuddle the mentioned user',
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
		const mention = message.mentions.users.first();
		let user;

		if (mention) {
			user = mention;
		} else {
			user = args[0];
		}

		if (!user) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'Missing a required user mention',
			});
			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return this.Utils.Delete(msg);
		} else if (user == args[0] && user.toLowerCase().includes('help')) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				accessor: message,
			});
		} else {
			const generatingEmbed = await this.GeneratingEmbed.NekosFun({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});

			const m = await message.channel.send({ embeds: [generatingEmbed] });
			try {
				const res = await this.Reactions.Cuddle();

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

				const cuddleEmbed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Cuddle command',
					description: `<@${message.author.id}> has cuddled ${user}! Awww!`,
					image: res.file,
				});

				m.delete();
				return message.channel.send({ embeds: [cuddleEmbed] });
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
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const user = interaction.options.getUser('user');

		if (!user) {
			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: this.Utils.GetIcon(interaction),
				text: this,
				id: this.Utils.GetGuildId(interaction),
				error_message: 'Missing required user mention',
			});

			return await interaction.reply({ embeds: [errEmbed] });
		}

		const generatingEmbed = await this.GeneratingEmbed.NekosFun({
			accessor: interaction,
			text: this,
		});

		await interaction.reply({ embeds: [generatingEmbed] });

		try {
			const res = await this.Reactions.Cuddle();

			if (res.error == true) {
				const errEmbed = await this.ErrorEmbed.ApiError({
					accessor: interaction,
					text: this,
				});

				return await interaction.editReply({ embeds: [errEmbed] });
			}

			const cuddleEmbed = await this.ImageEmbed.Base({
				accessor: interaction,
				text: this,
				title: 'Cuddle command',
				description: `${interaction.user.toString()} has cuddled ${user.toString()}! Awww!`,
				image: res.file,
			});

			return await interaction.editReply({ embeds: [cuddleEmbed] });
		} catch (error) {
			console.log('Error', error);

			const errorEmbed = await this.ErrorEmbed.UnexpectedError({
				accessor: interaction,
				text: this,
			});
			return interaction.editReply({ embeds: [errorEmbed] });
		}
	}
}
