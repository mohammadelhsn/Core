import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';
import NewsAPI from 'newsapi';

export default class NewsCommand extends BaseCommand {
	constructor() {
		super(
			'news',
			'miscellaneous',
			[],
			'',
			'Search the news for an article',
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
		const news = new NewsAPI(process.env.NEWSAPI);

		if (!args[0]) {
			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: '<alltime || sources || top>',
			});

			const msg = await message.channel.send({ embeds: [errEmbed] });
			return msg.delete({ timeout: 10000 });
		}

		if (!args[1]) {
			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'You are missing the language argument',
			});

			const msg = await message.channel.send({ embeds: [errEmbed] });
			return this.Utils.Delete(msg);
		}

		if (args[0].toLowerCase() == 'alltime') {
			try {
				const query = args.slice(2).join(' ');

				if (!query) {
					const errEmbed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						error_message: 'You are missing the query argument',
					});

					const msg = await message.channel.send({ embeds: [errEmbed] });
					return this.Utils.Delete(msg);
				}

				const res = await news.v2.everything({
					q: query,
					lang: args[1],
				});

				const articles = res.articles;

				if (res.articles.length == 0) {
					const errEmbed = await this.ErrorEmbed.NoResult({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
					});

					const msg = await message.channel.send({ embeds: [errEmbed] });
					return this.Utils.Delete(msg);
				}

				const embeds = [];

				for (const a of articles) {
					const embed = await this.ImageEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: a.title,
						description: `Source: \`${a.source.name}\` | Author: \`${
							a.author ? a.author : 'N/A'
						}\``,
						fields: [
							{ name: 'Description', value: `\`${a.description}\`` },
							{
								name: 'Content',
								value: `\`${a.content ? a.content : 'N/A'}\``,
							},
							{ name: 'Published at:', value: `\`${a.publishedAt}\`` },
						],
						link: a.url,
						image: `${a.urlToImage == null ? '' : a.urlToImage}`,
					});
					embeds.push(embed);
				}
				return this.Utils.Paginate({
					message: message,
					embeds: embeds,
					timeout: 600000,
				});
			} catch (e) {
				console.log(e);

				const errEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
				});
				return message.channel.send({ embeds: [errEmbed] });
			}
		} else if (args[0].toLowerCase() === 'top') {
			try {
				const query = args.slice(2).join(' ');

				if (!query) {
					const errorEmbed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						error_message: 'Missing a required argument',
					});
					const msg = await message.channel.send({ embeds: [errorEmbed] });
					return this.Utils.Delete(msg);
				}

				const res = await news.v2.topHeadlines({
					q: query,
					lang: args[1],
				});

				if (res.articles.length == 0) {
					const errEmbed = await this.ErrorEmbed.NoResult({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
					});

					const msg = await message.channel.send({ embeds: [errEmbed] });
					return this.Utils.Delete(msg);
				}

				const articles = res.articles;
				const embeds = [];

				for (const a of articles) {
					const embed = await this.ImageEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: a.title,
						description: `Source: \`${a.source.name}\` | Author: \`${
							a.author ? a.author : 'N/A'
						}\``,
						fields: [
							{ name: 'Description', value: `\`${a.description}\`` },
							{
								name: 'Content',
								value: `\`${a.content ? a.content : 'N/A'}\``,
							},
							{ name: 'Published at:', value: `\`${a.publishedAt}\`` },
						],
						image: `${a.urlToImage == null ? '' : a.urlToImage}`,
						link: `${a.url}`,
					});
					embeds.push(embed);
				}
				return this.Utils.Paginate({
					message: message,
					embeds: embeds,
					timeout: 600000,
				});
			} catch (e) {
				console.log(e);

				const errEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
				});
				return message.channel.send({ embeds: [errEmbed] });
			}
		} else if (args[0].toLowerCase() === 'sources') {
			try {
				const query = args.slice(2).join(' ');

				if (!query) {
					const errEmbed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						error_message: 'You are missing the query',
					});

					const msg = await message.channel.send({ embeds: [errEmbed] });
					return this.Utils.Delete(msg);
				}

				const res = await news.v2.sources({
					category: query,
					lang: args[1],
				});

				if (res.sources.length == 0) {
					const errEmbed = await this.ErrorEmbed.NoResult({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
					});

					const msg = await message.channel.send({ embeds: [errEmbed] });
					return this.Utils.Delete(msg);
				}

				const sources = res.sources;
				const embeds = [];

				for (const s of sources) {
					const embed = await this.Embed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: s.name,
						description: `\`${s.description}\``,
						link: s.url,
						fields: [
							{ name: 'Category:', value: `\`${s.category}\`` },
							{ name: 'Language', value: `\`${s.language}\`` },
							{ name: 'Country', value: `\`${s.country}\`` },
						],
					});
					embeds.push(embed);
				}
				return this.Utils.Paginate({
					message: message,
					embeds: embeds,
					timeout: 600000,
				});
			} catch (e) {
				console.log(e);

				const errEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
				});

				return message.channel.send({ embeds: [errEmbed] });
			}
		} else if (args[0].toLowerCase() == 'help') {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				event: { message: message },
			});
		} else {
			const errEmbed = await this.ErrorEmbed.InvalidChoice({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});

			const msg = await message.channel.send({ embeds: [errEmbed] });
			return this.Utils.Delete(msg);
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
