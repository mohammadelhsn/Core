import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import discord, { Message } from 'discord.js';

export default class BotinfoCommand extends BaseCommand {
	constructor() {
		super(
			'botinfo',
			'bot',
			[],
			'',
			'',
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
		const prefix = await this.Settings.Prefix(message.guild.id);

		const con = await this.con.connect();

		const res = await con.query(`SELECT commandsused FROM botstats`);
		const totalCommands = res.rows[0].commandsused;
		const response = await con.query(
			`SELECT commandsused FROM guildstats WHERE guildId = '${message.guild.id}'`
		);
		const guildCommands = response.rows[0].commandsused;

		const bot = {
			commands: `\`${client.commands.size}\``,
			guilds: `\`${client.guilds.cache.size}\``,
			users: `\`${client.users.cache.size}\``,
			usedTotal: `\`${totalCommands}\``,
			usedServer: `\`${guildCommands}\``,
			//  version:
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
				message: message,
			});
		}

		const embed = await this.Embed.Base({
			iconURL: client.user.displayAvatarURL({ dynamic: true }),
			text: this,
			title: `${client.user.username}'s information`,
			description: `The prefix for ${message.guild.name} is ${bot.prefix}`,
			fields: [
				{ name: 'Guild count', value: bot.guilds },
				{ name: 'User count', value: bot.users },
				//     { name: "Bot version", value: bot.version }
				{ name: 'Command count', value: bot.commands },
				{ name: 'Commands used (total)', value: bot.usedTotal },
				{ name: 'Commands used (guild)', value: bot.usedServer },
				{ name: 'Library', value: `Discord.js (${bot.discord})` },
				{ name: 'Language', value: `Javascript (Node ${bot.nodeVersion})` },
				{ name: 'Bot owner', value: bot.owner },
			],
		});
		return message.channel.send({ embed: embed });
	}
}
