import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';
import youtube from 'ytsr';

export default class YoutubeCommand extends BaseCommand {
	constructor() {
		super('youtube', 'miscellaneous', []);
	}
	async run(
		client: DiscordClient,
		message: Message,
		args: string[]
	): Promise<any> {
		const self = this;
		const type = args[0];
		const query = args.slice(1).join(' ');

		if (!type) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Type is a required argument',
			});
			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return this.Utils.Delete(msg);
		}
		if (!query) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Query is a required argument',
			});
			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return this.Utils.Delete(msg);
		}

		const res = await youtube(query).catch((e) => {
			console.log(e);
		});

		if (type.toLowerCase() == 'channel' || type.toLowerCase() == 'c') {
			const channel = (res as youtube.Result).items.filter(
				(i) => i.type == 'channel'
			)[0] as youtube.Channel;

			const yt = {
				name: channel.name,
				thumbnail: channel.bestAvatar.url,
				verified: `${
					channel.verified ? `${this.Emojis.verified}` : '`Not verified`'
				}`,
				videos: this.Utils.FormatNumber(channel.videos),
				subs: channel.subscribers,
				description: channel.descriptionShort,
				url: channel.url,
			};

			const embed = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: yt.name,
				description: `${yt.description == null ? '' : yt.description}`,
				fields: [
					{ name: 'Subscribers', value: `\`${yt.subs}\`` },
					{ name: 'Videos', value: `\`${yt.videos}\`` },
					{ name: 'Verified', value: yt.verified },
				],
				link: yt.url,
				image: yt.thumbnail,
			});
			return message.channel.send({ embeds: [embed] });
		} else if (type.toLowerCase() == 'video' || type.toLowerCase() == 'v') {
			const video = (res as youtube.Result).items.filter(
				(i) => i.type == 'video'
			) as youtube.Video[];

			if (video.length == 0) {
				const errorEmbed = await this.ErrorEmbed.NoResult({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});
				const msg = await message.channel.send({ embeds: [errorEmbed] });
				return this.Utils.Delete(msg);
			}

			const results = video.slice(0, 5);

			const embeds = [];
			for (const v of results) {
				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `${v.title}`,
					description: `${v.description ? v.description : 'N/A'}`,
					image: v.bestThumbnail.url,
					fields: [
						{ name: 'Views', value: `\`${this.Utils.FormatNumber(v.views)}\`` },
						{ name: 'Duration', value: `\`${v.duration}\`` },
						{
							name: 'Uploaded',
							value: `\`${v.uploadedAt == null ? 'N/A' : v.uploadedAt}\``,
						},
						{ name: 'Author', value: `[${v.author.name}](${v.author.url})` },
					],
					link: v.url,
				});
				embeds.push(embed);
			}
			return this.Utils.Paginate({ embeds: embeds, accessor: message });
		} else {
			const errorEmbed = await this.ErrorEmbed.InvalidChoice({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});
			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return this.Utils.Delete(msg);
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const sub = interaction.options.getSubcommand();
		const query = interaction.options.getString('query');

		if (!query) return;

		await interaction.deferReply();

		try {
			if (sub == 'channel') {
				const res = await youtube(query);

				const results = res.items.filter((item) => item.type == 'channel');

				const embeds = [];

				for (let result of results) {
					if (result.type == 'channel') {
						const embed = await this.ImageEmbed.Base({
							iconURL: result.bestAvatar.url,
							text: this,
							title: result.name,
							description: `${
								result.descriptionShort == null ? '' : result.descriptionShort
							}`,
							fields: [
								{ name: 'Subscribers', value: `\`${result.subscribers}\`` },
								{ name: 'Videos', value: `\`${result.videos}\`` },
								{
									name: 'Verified',
									value: result.verified ? this.Emojis.verified : 'No',
								},
							],
							link: result.url,
							image: result.bestAvatar.url,
						});

						embeds.push(embed);
					}
				}

				if (embeds.length > 1) {
					return await this.Utils.Paginate({
						accessor: interaction,
						embeds: embeds,
					});
				}
				return await interaction.editReply({ embeds: embeds });
			}

			if (sub == 'video') {
				const res = await youtube(query);

				const results = res.items.filter((item) => item.type == 'video');

				const embeds = [];

				for (let result of results) {
					if (result.type == 'video') {
						const embed = await this.ImageEmbed.Base({
							iconURL: result.bestThumbnail.url,
							text: this,
							title: `${result.title}`,
							description: `${result.description ? result.description : 'N/A'}`,
							image: result.bestThumbnail.url,
							fields: [
								{
									name: 'Views',
									value: `\`${this.Utils.FormatNumber(result.views)}\``,
								},
								{ name: 'Duration', value: `\`${result.duration}\`` },
								{
									name: 'Uploaded',
									value: `\`${
										result.uploadedAt == null ? 'N/A' : result.uploadedAt
									}\``,
								},
								{
									name: 'Author',
									value: `[${result.author.name}](${result.author.url})`,
								},
							],
							link: result.url,
						});
						embeds.push(embed);
					}
				}

				if (embeds.length == 0)
					return interaction.editReply({ content: 'No results!' });
				if (embeds.length == 1)
					return interaction.editReply({ embeds: embeds });
				await interaction.editReply({ content: 'Here are you result(s)' });
				return await this.Utils.Paginate({
					accessor: interaction,
					embeds: embeds,
					timeout: 60 * 1000,
				});
			}
		} catch (err) {
			console.log(err);
		}
	}
}
