import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, MessageEmbed } from 'discord.js';

export default class HelpCommand extends BaseCommand {
	constructor() {
		super('help', 'bot', []);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const cmd = args[0];

		if (!cmd) {
			const commands = {};
			client.commands.forEach((el) => {
				if (commands[el.getCategory()]) {
					commands[el.getCategory()].push(el.getName());
				} else {
					commands[el.getCategory()] = [el.getName()];
				}
			});

			const categories = {
				titles: {
					aww: `Aww [${commands['aww'].length}]`,
					bot: `Bot [${commands['bot'].length}]`,
					canvas: `Canvas [${commands['canvas'].length}]`,
					config: `Config [${commands['config'].length}]`,
					economy: `Economy [${commands['economy'].length}]`,
					facts: `Facts [${commands['facts'].length}]`,
					fun: `Fun [${commands['fun'].length}]`,
					levels: `Levels [${commands['levels'].length}]`,
					logging: `Logging [${commands['logging'].length}]`,
					manager: `Manager [${commands['manager'].length}]`,
					memes: `Memes [${commands['memes'].length}]`,
					miscellaneous: `Miscellaneous [${commands['miscellaneous'].length}]`,
					moderation: `Moderation [${commands['moderation'].length}]`,
					music: `Moderation [${commands['music'].length}]`,
					owner: `Owner [${commands['owner'].length}]`,
					reaction_images: `Reaction images [${commands['reaction images'].length}]`,
					server_utilities: `Server utilities [${commands['server utilities'].length}]`,
				},
				command: {
					aww: commands['aww'].map((c) => `\`${c}\``).join(', '),
					bot: commands['bot'].map((c) => `\`${c}\``).join(', '),
					canvas: commands['canvas'].map((c) => `\`${c}\``).join(', '),
					config: commands['config'].map((c) => `\`${c}\``).join(', '),
					economy: commands['economy'].map((c) => `\`${c}\``).join(', '),
					facts: commands['facts'].map((c) => `\`${c}\``).join(', '),
					fun: commands['fun'].map((c) => `\`${c}\``).join(', '),
					levels: commands['levels'].map((c) => `\`${c}\``).join(', '),
					logging: commands['logging'].map((c) => `\`${c}\``).join(', '),
					manager: commands['manager'].map((c) => `\`${c}\``).join(', '),
					memes: commands['memes'].map((c) => `\`${c}\``).join(', '),
					miscellaneous: commands['miscellaneous']
						.map((c) => `\`${c}\``)
						.join(', '),
					moderation: commands['moderation'].map((c) => `\`${c}\``).join(', '),
					music: commands['music'].map((c) => `\`${c}\``).join(', '),
					owner: commands['owner'].map((c) => `\`${c}\``).join(', '),
					reaction_images: commands['reaction images']
						.map((c) => `\`${c}\``)
						.join(', '),
					server_utilities: commands['server utilities']
						.map((c) => `\`${c}\``)
						.join(', '),
				},
			};

			if (message.guild) {
				const prefix = await this.Settings.Prefix(message.guild.id);
				const lang = await this.Translator.Getlang(message.guild.id);

				const awwEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.Set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(`${categories.titles.aww}`, `${categories.command.aww}`);
				const botEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.Set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(`${categories.titles.bot}`, `${categories.command.bot}`);
				const cEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.addField(
						`${categories.titles.canvas}`,
						`${categories.command.canvas}`
					);
				const coEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.Set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.config}`,
						`${categories.command.config}`
					);

				const eEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.Set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.economy}`,
						`${categories.command.economy}`
					);
				const fEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.Set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.facts}`,
						`${categories.command.facts}`
					);
				const fuEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.Set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(`${categories.titles.fun}`, `${categories.command.fun}`);

				const levelEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.Set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.levels}`,
						`${categories.command.levels}`
					);
				const logEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.Set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.logging}`,
						`${categories.command.logging}`
					);
				const mEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.Set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.manager}`,
						`${categories.command.manager}`
					);
				const meEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.Set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.memes}`,
						`${categories.command.memes}`
					);
				const miEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.Set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.miscellaneous}`,
						`${categories.command.miscellaneous}`
					);
				const moEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.Set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.moderation}`,
						`${categories.command.moderation}`
					);
				const music = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.Set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.music}`,
						`${categories.command.music}`
					);
				const oEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.Set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.owner}`,
						`${categories.command.owner}`
					);
				const rEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.Set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.reaction_images}`,
						`${categories.command.reaction_images}`
					);
				const suEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.Getstring(
							lang,
							'is_required'
						)} \`()\` ${this.Translator.Getstring(
							lang,
							'is_optional'
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.Set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.server_utilities}`,
						`${categories.command.server_utilities}`
					);

				return this.Utils.Paginate(
					message,
					{},
					awwEmbed,
					botEmbed,
					cEmbed,
					coEmbed,
					eEmbed,
					fEmbed,
					fuEmbed,
					levelEmbed,
					logEmbed,
					mEmbed,
					meEmbed,
					miEmbed,
					moEmbed,
					music,
					oEmbed,
					rEmbed,
					suEmbed
				);
			} else {
				const awwEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Core help command | Command count: ${client.commands.size}`,
					description: `\`<>\` is required \`()\` is optional`,
					fields: [
						{
							name: `${categories.titles.aww}`,
							value: `${categories.command.aww}`,
						},
					],
				});
				const botEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Core help command | Command count: ${client.commands.size}`,
					description: `\`<>\` is required \`()\` is optional`,
					fields: [
						{
							name: `${categories.titles.bot}`,
							value: `${categories.command.bot}`,
						},
					],
				});
				const cEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Core help command | Command count: ${client.commands.size}`,
					description: `\`<>\` is required \`()\` is optional`,
					fields: [
						{
							name: `${categories.titles.canvas}`,
							value: `${categories.command.canvas}`,
						},
					],
				});
				const coEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Core help command | Command count: ${client.commands.size}`,
					description: `\`<>\` is required \`()\` is optional`,
					fields: [
						{
							name: `${categories.titles.config}`,
							value: `${categories.command.config}`,
						},
					],
				});
				const eEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Core help command | Command count: ${client.commands.size}`,
					description: `\`<>\` is required \`()\` is optional`,
					fields: [
						{
							name: `${categories.titles.economy}`,
							value: `${categories.command.economy}`,
						},
					],
				});
				const fEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Core help command | Command count: ${client.commands.size}`,
					description: `\`<>\` is required \`()\` is optional`,
					fields: [
						{
							name: `${categories.titles.facts}`,
							value: `${categories.command.facts}`,
						},
					],
				});
				const fuEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Core help command | Command count: ${client.commands.size}`,
					description: `\`<>\` is required \`()\` is optional`,
					fields: [
						{
							name: `${categories.titles.fun}`,
							value: `${categories.command.fun}`,
						},
					],
				});
				const levelEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Core help command | Command count: ${client.commands.size}`,
					description: `\`<>\` is required \`()\` is optional`,
					fields: [
						{
							name: `${categories.titles.levels}`,
							value: `${categories.command.levels}`,
						},
					],
				});
				const logEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Core help command | Command count: ${client.commands.size}`,
					description: `\`<>\` is required \`()\` is optional`,
					fields: [
						{
							name: `${categories.titles.logging}`,
							value: `${categories.command.logging}`,
						},
					],
				});
				const mEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Core help command | Command count: ${client.commands.size}`,
					description: `\`<>\` is required \`()\` is optional`,
					fields: [
						{
							name: `${categories.titles.manager}`,
							value: `${categories.command.manager}`,
						},
					],
				});
				const meEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Core help command | Command count: ${client.commands.size}`,
					description: `\`<>\` is required \`()\` is optional`,
					fields: [
						{
							name: `${categories.titles.memes}`,
							value: `${categories.command.memes}`,
						},
					],
				});
				const miEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Core help command | Command count: ${client.commands.size}`,
					description: `\`<>\` is required \`()\` is optional`,
					fields: [
						{
							name: `${categories.titles.miscellaneous}`,
							value: `${categories.command.miscellaneous}`,
						},
					],
				});
				const moEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Core help command | Command count: ${client.commands.size}`,
					description: `\`<>\` is required \`()\` is optional`,
					fields: [
						{
							name: `${categories.titles.moderation}`,
							value: `${categories.command.moderation}`,
						},
					],
				});

				const oEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Core help command | Command count: ${client.commands.size}`,
					description: `\`<>\` is required \`()\` is optional`,
					fields: [
						{
							name: `${categories.titles.owner}`,
							value: `${categories.command.owner}`,
						},
					],
				});
				const rEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Core help command | Command count: ${client.commands.size}`,
					description: `\`<>\` is required \`()\` is optional`,
					fields: [
						{
							name: `${categories.titles.reaction_images}`,
							value: `${categories.command.reaction_images}`,
						},
					],
				});

				const suEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(
						`${categories.titles.server_utilities}`,
						`${categories.command.server_utilities}`
					)
					.setTimestamp()
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setColor(this.Colour.Set());

				return this.Utils.Paginate(
					message,
					{},
					awwEmbed,
					botEmbed,
					cEmbed,
					coEmbed,
					eEmbed,
					fEmbed,
					fuEmbed,
					levelEmbed,
					logEmbed,
					mEmbed,
					meEmbed,
					miEmbed,
					moEmbed,
					oEmbed,
					rEmbed,
					suEmbed
				);
			}
		} else {
			const command =
				client.commands.get(cmd) ||
				client.commands.get(client.aliases.get(cmd));

			if (!command) {
				const errorEmbed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					error_message: "The command you mentioned doesn't exist!",
				});
				return message.channel.send(errorEmbed);
			} else {
				if (message.channel.type === 'dm') {
					return await this.HelpEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						command: command,
						message: message,
					});
				} else {
					return await this.HelpEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						command: command,
						message: message,
					});
				}
			}
		}
	}
}
