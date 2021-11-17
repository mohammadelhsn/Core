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

			if (command.getGuildonly() == true && interaction.channel.type == 'DM') {
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

			if (interaction.guild.id == '704034868547289089') {
				const res = await con.query(
					`SELECT commandsused FROM guilds WHERE guildId = '704034868547289089'`
				);
				let total: number = parseInt(res.rows[0].commandsused);
				total++;

				try {
					await con.query(`BEGIN`);
					await con.query(`UPDATE botstats SET commandsused = '${total}'`);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				} finally {
					con.release();
				}
			} else {
				const res = await con.query(
					`SELECT commandsused FROM guilds WHERE guildId = '690975783363280918'`
				);
				const response = await con.query(
					`SELECT commandsused FROM guilds WHERE guildId = '${interaction.guild.id}'`
				);

				let total: number = parseInt(res.rows[0].commandsused);
				total++;

				let guildTotal: number = parseInt(response.rows[0].commandsused);
				guildTotal++;
				try {
					await con.query(`BEGIN`);
					if (interaction.guild.id == '690975783363280918') {
						await con.query(
							`UPDATE Guilds SET commandsused = '${total}' WHERE guildId = '690975783363280918'`
						);
						await con.query(`COMMIT`);
						return;
					}

					await con.query(
						`UPDATE Guilds SET commandsused = '${total}' WHERE guildId = '690975783363280918'`
					);
					await con.query(
						`UPDATE Guilds SET commandsused = '${guildTotal}' WHERE guildId = '${interaction.guild.id}'`
					);
					await con.query(`COMMIT`);
					return;
				} catch (error) {
					console.log(error);
				} finally {
					con.release();
				}
			}
		}
	}
}
