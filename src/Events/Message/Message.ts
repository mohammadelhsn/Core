import BaseEvent from '../../Utils/Structures/BaseEvent';
import { Message } from 'discord.js';
import DiscordClient from '../../Client/Client';

export default class MessageEvent extends BaseEvent {
	constructor() {
		super('message');
	}

	async run(client: DiscordClient, message: Message) {
		if (message.author.bot) return;
		if (message.channel.type == 'dm') return;

		const con = await this.con.connect();

		const prefix = await this.Settings.Prefix(message.guild.id);

		if (message.content.startsWith(prefix)) {
			const [cmdName, ...cmdArgs] = message.content
				.slice(prefix.length)
				.trim()
				.split(/\s+/);
			const command = client.commands.get(cmdName);

			if (
				command.getOwneronly() == true &&
				message.author.id != '398264990567628812'
			) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: 'Message event',
					id: message.guild.id,
					error_message: 'This command is owner only!',
				});

				const msg = await message.channel.send({ embed: embed });
				return msg.delete({ timeout: 10000 });
			}

			if (command.getNsfw() == true && message.channel.nsfw == false) {
				const embed = await this.ErrorEmbed.NsfwError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: 'Message event',
					id: message.guild.id,
				});

				const msg = await message.channel.send({ embed: embed });
				return msg.delete({ timeout: 10000 });
			}

			if (
				command.getStatus() == 'WIP' ||
				(command.getStatus() == 'debug' &&
					message.author.id != '398264990567628812')
			) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: 'Message event',
					id: message.guild.id,
					error_message: 'This command is currently off limits',
				});

				const msg = await message.channel.send({ embed: embed });
				return msg.delete({ timeout: 10000 });
			}

			if (command) {
				command.run(client, message, cmdArgs);

				const res = await con.query(`SELECT commandsused FROM botstats`);
				const response = await con.query(
					`SELECT commandsused FROM guildstats WHERE guildId = '${message.guild.id}'`
				);
				let total: number = parseInt(res.rows[0].commandsused);
				total++;

				let guildTotal: number = parseInt(response.rows[0].commandsused);
				guildTotal++;
				try {
					await con.query(`BEGIN`);
					await con.query(`UPDATE botstats SET commandsused = '${total}'`);
					await con.query(
						`UPDATE guildstats SET commandsused = '${guildTotal}'`
					);
					await con.query(`COMMIT`);
				} catch (error) {
					console.log(error);
				} finally {
					con.release();
				}
			}
		}
	}
}
