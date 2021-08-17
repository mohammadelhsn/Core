import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';
import axios, { AxiosResponse } from 'axios';

export default class AnimeCommand extends BaseCommand {
	constructor() {
		super(
			'anime',
			'miscellaneous',
			[],
			'<anime name>',
			'Search an anime by name',
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
		const query = args.join(' ');

		if (!query) {
			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Missing a required argument (query)',
			});
			const msg = await message.channel.send({ embeds: [errEmbed] });
			return msg.delete({ timeout: 10000 });
		}

		try {
			const res: AxiosResponse = await axios.get(
				`https://kitsu.io/api/edge/anime?filter[text]=${query}`
			);
			const data = res.data.data;

			if (data.length == 0) {
				const errEmbed = await this.ErrorEmbed.NoResult({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				const msg = await message.channel.send({ embeds: [errEmbed] });
				return this.Utils.Delete(msg);
			}

			const embeds = [];

			for (const d of data) {
				const names =
					d.attributes.abbreviatedTitles.length > 0
						? d.attributes.abbreviatedTitles.map((t) => `\`${t}\``).join(' ')
						: '\u200B';
				embeds.push(
					await this.Embed.Base({
						iconURL: d.attributes.posterImage.original,
						text: this,
						title: `${d.attributes.titles.en_jp} | ${d.attributes.titles.ja_jp}`,
						description: d.attributes.description
							? d.attributes.description
							: '`N/A`',
						fields: [
							{
								name: `${
									d.attributes.abbreviatedTitles.length > 0 ? 'AKA' : '\u200B'
								}`,
								value: names,
							},
							{ name: 'ID', value: `\`${d.id}\`` },
							{
								name: 'Average rating',
								value: `\`${d.attributes.averageRating}\``,
							},
							{
								name: 'User count',
								value: `\`${this.Utils.FormatNumber(d.attributes.userCount)}\``,
							},
							{
								name: 'Favourite count',
								value: `\`${this.Utils.FormatNumber(
									d.attributes.favoritesCount
								)}\``,
							},
							{
								name: 'Status',
								value: `\`${this.Utils.Capitalize(d.attributes.status)}\``,
							},
							{ name: 'Start date', value: `\`${d.attributes.startDate}\`` },
							{
								name: 'End date',
								value: `\`${
									d.attributes.endDate ? d.attributes.endDate : 'N/A'
								}\``,
							},
							{
								name: 'Next release',
								value: `\`${
									d.attributes.nextRelease ? d.attributes.nextRelease : 'N/A'
								}\``,
							},
							{
								name: 'Age rating',
								value: `\`${
									d.attributes.ageRating ? d.attributes.ageRating : 'N/A'
								}\``,
							},
							{
								name: 'Age rating guide',
								value: `\`${
									d.attributes.ageRatingGuide
										? d.attributes.ageRatingGuide
										: 'N/A'
								}\``,
							},
							{
								name: 'Episode count',
								value: `\`${
									d.attributes.episodeCount
										? this.Utils.FormatNumber(d.attributes.episodeCount)
										: 'N/A'
								}\``,
							},
						],
						link: d.links.self,
					})
				);
			}

			return this.Utils.Paginate(message, { embeds: embeds, timeout: 600000 });
		} catch (error) {
			console.log(error);
		}
	}
}
