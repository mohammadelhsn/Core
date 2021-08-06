import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';
import axios from 'axios';

export default class EmojisCommand extends BaseCommand {
	constructor() {
		super(
			'emoji',
			'miscellaneous',
			[],
			'',
			'Search emojis on emoji.gg to add to your server!',
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
		const flags = {
			1: 'Original Style',
			18: 'Recolors',
			2: 'TV / Movie',
			10: 'Gaming',
			3: 'Meme',
			4: 'Anime',
			13: 'Pepe',
			5: 'Celebrity',
			6: 'Blobs',
			7: 'Thinking',
			17: 'Animals',
			15: 'Cute',
			11: 'Letters',
			14: 'Logos',
			16: 'Utility',
			19: 'Flags',
			20: 'Hearts',
			12: 'Other',
			8: 'Animated',
			9: 'NSFW',
		};
		const flag = {
			'original style': 1,
			recolors: 18,
			movie: 2,
			gaming: 10,
			meme: 3,
			anime: 4,
			pepe: 13,
			celebrity: 5,
			blobs: 6,
			thinking: 7,
			animals: 17,
			cute: 15,
			letters: 11,
			logos: 14,
			utility: 16,
			flags: 19,
			hearts: 20,
			other: 12,
			animated: 8,
			nsfw: 9,
		};
		// https://emoji.gg/api/
		const query = args.join(' ');
		const res = await axios.get('https://emoji.gg/api/');
		const data = res.data;
		if (args[0] == 'category') {
			try {
				const emojis = data.filter(
					(c) => c.category == flag[args.slice(1).join(' ').toLowerCase()]
				);
				if (emojis.length == 0) {
					const errorEmbed = await this.ErrorEmbed.NoResult({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});
					const msg = await message.channel.send({ embed: errorEmbed });
					return msg.delete({ timeout: 10000 });
				} else {
					const embeds = [];
					for (const e of emojis) {
						const embed = await this.ImageEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							title: e.title,
							description: `${e.submitted_by}`,
							fields: [
								{
									name: 'Description',
									value: `${e.description} | [URL](https://emoji.gg/emoji/${e.slug})`,
								},
								{ name: 'Faves', value: e.faves },
								{ name: 'Category', value: flags[e.category] },
							],
							link: `https://emoji.gg/emoji/${e.slug}`,
							image: e.image,
						});
						embeds.push(embed);
					}
					return this.Utils.Paginate(message, {
						embeds: embeds,
						timeout: 600000,
					});
				}
			} catch (e) {
				console.log(e);

				const errorEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});
				return message.channel.send({ embed: errorEmbed });
			}
		} else {
			try {
				const emojis = data.filter((c) => c.title.includes(query));
				if (emojis.length == 0) {
					const errorEmbed = await this.ErrorEmbed.NoResult({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});
					const msg = await message.channel.send({ embed: errorEmbed });
					return msg.delete({ timeout: 10000 });
				} else {
					const embeds = [];
					for (const e of emojis) {
						const embed = await this.ImageEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							title: e.title,
							description: `${e.submitted_by}`,
							fields: [
								{
									name: 'Description',
									value: `${e.description} | [URL](https://emoji.gg/emoji/${e.slug})`,
								},
								{ name: 'Faves', value: e.faves },
								{ name: 'Category', value: flags[e.category] },
							],
							link: `https://emoji.gg/emoji/${e.slug}`,
							image: e.image,
						});
						embeds.push(embed);
					}
					return this.Utils.Paginate(message, {
						embeds: embeds,
						timeout: 600000,
					});
				}
			} catch (e) {
				console.log(e);

				const errorEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});
				return message.channel.send({ embed: errorEmbed });
			}
		}
	}
}
