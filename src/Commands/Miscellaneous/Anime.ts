import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';
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
								name: `Names`,
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

			return this.Utils.Paginate({
				embeds: embeds,
				timeout: 600000,
				accessor: message,
			});
		} catch (error) {
			console.log(error);
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const query = interaction.options.getString('query');

		try {
			const res = await this.Miscellaneous.Anime(query);

			if (!Array.isArray(res)) {
				const errEmbed = await this.ErrorEmbed.ApiError({
					accessor: interaction,
					text: this,
				});

				return await interaction.reply({ embeds: [errEmbed] });
			}

			const embeds = [];
			for (let anime of res) {
				console.log(anime);

				const embed = this.Embed.Base({
					iconURL: anime.file,
					link: anime.link,
					text: this,
					title: anime.title,
					description: anime.text,
					fields: [
						{
							name: 'Names?',
							value: anime.misc.names.length == 0 ? 'N/A' : anime.misc.names,
						},
						{ name: 'ID', value: `\`${anime.id}}\`` },
						{
							name: 'Average rating',
							value: `\`${anime.misc.averageRating}\``,
						},
						{
							name: 'User count',
							value: `\`${anime.misc.userCount}\``,
						},
						{
							name: 'Favourite count',
							value: `\`${anime.misc.favouriteCount}\``,
						},
						{
							name: 'Status',
							value: `\`${anime.misc.status}\``,
						},
						{ name: 'Start date', value: `\`${anime.misc.startDate}\`` },
						{
							name: 'End date',
							value: `\`${anime.misc.endDate}\``,
						},
						{
							name: 'Next release',
							value: `\`${anime.misc.nextRelease}\``,
						},
						{
							name: 'Age rating',
							value: `\`${anime.misc.ageRating}\``,
						},
						{
							name: 'Age rating guide',
							value: `\`${anime.misc.ageRatingGuide}\``,
						},
						{
							name: 'Episode count',
							value: `\`${anime.misc.episodeCount}\``,
						},
					],
				});

				embeds.push(embed);
			}

			console.log(embeds);

			return await this.Utils.Paginate({
				embeds: embeds,
				accessor: interaction,
			});
		} catch (error) {
			console.log(error);
		}
	}
}
