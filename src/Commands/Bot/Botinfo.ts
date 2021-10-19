import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import discord, { Message, CommandInteraction } from 'discord.js';

export default class BotinfoCommand extends BaseCommand {
	constructor() {
		super(
			'botinfo',
			'bot',
			[],
			'',
			'Sends some information about the bot!',
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
		const con = await this.con.connect();

		try {
			const prefix = await this.Settings.Prefix(message.guild.id);

			const res = await con.query(
				`SELECT commandsused FROM Guilds WHERE guildid = '690975783363280918'`
			);
			const totalCommands = res.rows[0].commandsused;
			const response = await con.query(
				`SELECT commandsused FROM Guilds WHERE guildid = '${message.guild.id}'`
			);
			const guildCommands = response.rows[0].commandsused;
			const bot = {
				commands: `\`${client.commands.size}\``,
				guilds: `\`${client.guilds.cache.size}\``,
				users: `\`${client.users.cache.size}\``,
				usedTotal: `\`${totalCommands}\``,
				usedServer: `\`${guildCommands}\``,
				version: client.version,
				nodeVersion: process.version, // :)
				discord: discord.version,
				owner: 'ProcessVersion#4472',
				prefix: prefix,
				help: `${prefix}help`,
			};

			if (args[0]) {
				return await this.HelpEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					command: this,
					accessor: message,
				});
			}

			const embed = await this.Embed.Base({
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `${client.user.username}'s information`,
				description: `The prefix for ${message.guild.name} is \`${bot.prefix}\``,
				fields: [
					{ name: 'Guild count', value: bot.guilds, inline: true },
					{ name: 'User count', value: bot.users, inline: true },
					{ name: 'Bot version', value: `\`${bot.version}\`` },
					{ name: 'Command count', value: bot.commands, inline: true },
					{ name: 'Commands used (total)', value: bot.usedTotal },
					{ name: 'Commands used (guild)', value: bot.usedServer },
					{ name: 'Library', value: `\`Discord.js (${bot.discord})\`` },
					{
						name: 'Language',
						value: `\`Typescript (Node ${bot.nodeVersion})\``,
					},
					{ name: 'Bot owner', value: `\`${bot.owner}\`` },
				],
			});
			return message.channel.send({ embeds: [embed] });
		} catch (error) {
			const embed = await this.ErrorEmbed.UnexpectedError({
				accessor: message,
				text: this,
			});

			return message.channel.send({ embeds: [embed] });
		} finally {
			con.release();
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const con = await this.con.connect();

		try {
			const prefix = this.Settings.Prefix(interaction.guild.id);
		} catch (e) {
		} finally {
			con.release();
		}
	}
}
