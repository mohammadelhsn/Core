import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Interaction, TextChannel } from 'discord.js';

export default class Event extends BaseEvent {
	constructor() {
		super('interactionCreate');
	}
	async run(client: DiscordClient, interaction: Interaction) {
		if (interaction.isCommand()) {
			const con = await this.con.connect();
			try {
				let command;
				if (interaction.commandName == 'aww') {
					const cmd = interaction.options.getString('animal');

					command = client.commands.get(cmd);
				} else {
					command = client.commands.get(interaction.commandName);
				}

				if (!command) return;
				const { data } = await this.Settings.Disabled(interaction.guild.id);
				const { commands, categories } = data;

				if (commands.includes(command.getName())) {
					const errEmbed = await this.ErrorEmbed.Base({
						iconURL: interaction.guild.iconURL({ dynamic: true }),
						text: 'Disabled commands',
						id: interaction.guild.id,
						error_message: 'This command is disabled in this guild!',
					});

					return interaction.reply({ embeds: [errEmbed], ephemeral: true });
				}

				if (categories.includes(command.getCategory())) {
					const errEmbed = await this.ErrorEmbed.Base({
						iconURL: interaction.guild.iconURL({ dynamic: true }),
						text: 'Disabled commands',
						id: interaction.guild.id,
						error_message: 'This category is disabled in this guild!',
					});

					return interaction.reply({ embeds: [errEmbed], ephemeral: true });
				}

				if (
					command.getGuildonly() == true &&
					interaction.channel.type == 'DM'
				) {
					const errEmbed = await this.ErrorEmbed.Base({
						iconURL: interaction.guild.iconURL({ dynamic: true }),
						text: 'Disabled commands',
						id: interaction.guild.id,
						error_message: 'This command is only available in guilds!',
					});

					return interaction.reply({ embeds: [errEmbed], ephemeral: true });
				}
				if (
					command.getNsfw() == true &&
					(interaction.channel as TextChannel).nsfw == false
				) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
						text: 'Message event',
						id: interaction.guild.id,
						error_message: 'This command is limited only to NSFW channels!',
					});

					return interaction.reply({ embeds: [embed], ephemeral: true });
				}

				if (
					command.getOwneronly() == true &&
					interaction.user.id != '398264990567628812'
				)
					return;

				if (
					command.getStatus() == 'WIP' ||
					(command.getStatus() == 'debug' &&
						interaction.user.id != '398264990567628812')
				) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
						text: 'Message event',
						id: interaction.guild.id,
						error_message: 'This command is currently off limits',
					});

					return await interaction.reply({ embeds: [embed] });
				}

				await command.slash(client, interaction);
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
	}
}
