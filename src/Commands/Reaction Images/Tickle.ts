import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class TickleCommand extends BaseCommand {
	constructor() {
		super(
			'tickle',
			'reaction images',
			[],
			'',
			'Tickle the mentioned user',
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

		if (user == args[0] && user.toLowerCase().includes('help')) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				event: { message: message },
			});
		} else {
			if (!user) {
				const errorEmbed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					error_message: 'You are missing a reuiqred mention!',
				});
				const msg = await message.channel.send({ embeds: [errorEmbed] });
				return this.Utils.Delete(msg);
			}

			const generatingEmbed = await this.GeneratingEmbed.NekosFun({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});

			const m = await message.channel.send({ embeds: [generatingEmbed] });
			try {
				const res = await this.Reactions.Tickle();

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

				const tickleEmbed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Tickle command',
					description: `<@${message.author.id}> has tickled ${user}!`,
					image: res.file,
				});

				m.delete();
				return message.channel.send({ embeds: [tickleEmbed] });
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
		const user = interaction.options.getUser('user');

		if (!user) {
			const embed = await this.ErrorEmbed.Base({
				accessor: interaction,
				text: this,
				error_message: 'Missing required user mention!',
			});

			return await interaction.reply({ embeds: [embed] });
		}

		const generatingEmbed = await this.GeneratingEmbed.NekosFun({
			accessor: interaction,
			text: this,
		});

		await interaction.reply({ embeds: [generatingEmbed] });

		try {
			const res = await this.Reactions.Tickle();

			if (res.error == true) {
				const embed = await this.ErrorEmbed.ApiError({
					accessor: interaction,
					text: this,
				});

				return interaction.replied
					? await interaction.editReply({ embeds: [embed] })
					: await interaction.reply({ embeds: [embed] });
			}

			const tickleEmbed = await this.ImageEmbed.Base({
				accessor: interaction,
				text: this,
				title: 'Tickle command',
				description: `${interaction.user.toString()} has tickled ${user.toString()}!`,
				image: res.file,
			});

			return await interaction.editReply({ embeds: [tickleEmbed] });
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
