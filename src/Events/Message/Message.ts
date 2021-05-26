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
			const command =
				client.commands.get(cmdName.toLowerCase()) ||
				client.commands.get(client.aliases.get(cmdName.toLowerCase()));

			if (command) {
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

				command.run(client, message, cmdArgs);

				if (message.guild.id == '704034868547289089') {
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
						`SELECT commandsused FROM guilds WHERE guildId = '${message.guild.id}'`
					);

					let total: number = parseInt(res.rows[0].commandsused);
					total++;

					let guildTotal: number = parseInt(response.rows[0].commandsused);
					guildTotal++;
					try {
						await con.query(`BEGIN`);
						if (message.guild.id == '690975783363280918') {
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
							`UPDATE Guilds SET commandsused = '${guildTotal}' WHERE guildId = '${message.guild.id}'`
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
}
