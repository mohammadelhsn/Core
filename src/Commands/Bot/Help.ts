import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message, MessageEmbed } from 'discord.js';

export default class HelpCommand extends BaseCommand {
	constructor() {
		super(
			'help',
			'bot',
			[],
			'(command name)',
			'See all commands or get information about a specific command',
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
					fun: `Fun [${commands['fun'].length}]`,
					logging: `Logging [${commands['logging'].length}]`,
					manager: `Manager [${commands['manager'].length}]`,
					memes: `Memes [${commands['memes'].length}]`,
					miscellaneous: `Miscellaneous [${commands['miscellaneous'].length}]`,
					moderation: `Moderation [${commands['moderation'].length}]`,
					owner: `Owner [${commands['owner'].length}]`,
					reaction_images: `Reaction images [${commands['reaction images'].length}]`,
					server_utilities: `Server utilities [${commands['server utilities'].length}]`,
				},
				command: {
					aww: commands['aww'].map((c) => `\`${c}\``).join(', '),
					bot: commands['bot'].map((c) => `\`${c}\``).join(', '),
					canvas: commands['canvas'].map((c) => `\`${c}\``).join(', '),
					config: commands['config'].map((c) => `\`${c}\``).join(', '),
					fun: commands['fun'].map((c) => `\`${c}\``).join(', '),
					logging: commands['logging'].map((c) => `\`${c}\``).join(', '),
					manager: commands['manager'].map((c) => `\`${c}\``).join(', '),
					memes: commands['memes'].map((c) => `\`${c}\``).join(', '),
					miscellaneous: commands['miscellaneous']
						.map((c) => `\`${c}\``)
						.join(', '),
					moderation: commands['moderation'].map((c) => `\`${c}\``).join(', '),
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
					{ accessor: message },
					awwEmbed,
					botEmbed,
					cEmbed,
					coEmbed,

					fuEmbed,
					logEmbed,
					mEmbed,
					meEmbed,
					miEmbed,
					moEmbed,
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
					{ accessor: message },
					awwEmbed,
					botEmbed,
					cEmbed,
					coEmbed,
					fuEmbed,
					miEmbed,
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
					accessor: message,
					text: this,
					error_message: "The command you mentioned doesn't exist!",
				});
				return message.channel.send({ embeds: [errorEmbed] });
			}

			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: command,
				accessor: message,
			});
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
