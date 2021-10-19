import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';
import Giphy from 'giphy-api';

export default class GiphyCommand extends BaseCommand {
	constructor() {
		super(
			'giphy',
			'miscellaneous',
			[],
			'',
			'Search Gifs on giphy',
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
		const giphy = Giphy(process.env.GIPHY);
		const type = args[0];
		if (type) {
			if (type == 'sticker') {
				try {
					const q = args.slice(1).join(' ');
					const res = await (giphy as any).search({ api: 'stickers', q: q });
					if (res.data.length == 0) {
						const errorEmbed = await this.ErrorEmbed.NoResult({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							id: message.guild.id,
							text: this,
						});
						const msg = await message.channel.send({ embeds: [errorEmbed] });
						return msg.delete({ timeout: 10000 });
					}
					const embeds = [];
					for (const gif of res.data) {
						const embed = await this.ImageEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							title: gif.title,
							description: `Provided by: \`Giphy API\``,
							fields: [
								{ name: 'Uploaded at', value: `\`${gif.import_datetime}\`` },
								{ name: 'Rating', value: `\`${gif.rating}\`` },
								{ name: 'Sources', value: `[${gif.title}](${gif.source})` },
							],
							image: gif.images.original.url,
							link: gif.url,
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

					const errorEmbed = await this.ErrorEmbed.UnexpectedError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});
					return message.channel.send({ embeds: [errorEmbed] });
				}
			} else if (type == 'random') {
				try {
					const q = args.slice(1).join(' ');
					const res = await giphy.random(q);
					if (res.meta.status !== 200) {
						const errorEmbed = await this.ErrorEmbed.ApiError({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							id: message.guild.id,
							text: this,
						});
						const msg = await message.channel.send({ embeds: [errorEmbed] });
						return this.Utils.Delete(msg);
					} else if (res.meta.status == 200) {
						const embed = await this.ImageEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							title: res.data.title,
							description: 'Provided by: `Giphy API`',
							fields: [
								{
									name: 'Uploaded at:',
									value: `\`${res.data.import_datetime}\``,
								},
								{ name: 'Rating', value: `\`${res.data.rating}\`` },
								{
									name: 'Source',
									value: `[${res.data.title}](${res.data.source})`,
								},
							],
							image: res.data.images.original.url,
							link: res.data.url,
						});
						return message.channel.send({ embeds: [embed] });
					}
				} catch (e) {
					console.log(e);

					const embed = await this.ErrorEmbed.UnexpectedError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});
					return message.channel.send({ embeds: [embed] });
				}
			} else {
				try {
					const q = args.join(' ');
					const res = await giphy.search(q);
					if (res.data.length == 0) {
						const eEmbed = await this.ErrorEmbed.NoResult({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							id: message.guild.id,
							text: this,
						});
						const msg = await message.channel.send({ embeds: [eEmbed] });
						return this.Utils.Delete(msg);
					}
					const embeds = [];
					for (const gif of res.data) {
						const embed = await this.ImageEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							title: gif.title,
							description: `Provided by: \`Giphy API\``,
							fields: [
								{ name: 'Uploaded at', value: `\`${gif.import_datetime}\`` },
								{ name: 'Rating', value: `\`${gif.rating}\`` },
								{ name: 'Sources', value: `[${gif.title}](${gif.source})` },
							],
							image: gif.images.original.url,
							link: gif.url,
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

					const errorEmbed = await this.ErrorEmbed.UnexpectedError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});
					return message.channel.send({ embeds: [errorEmbed] });
				}
			}
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
