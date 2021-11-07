import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	CommandInteraction,
	GuildMember,
	Message,
	MessageCollectorOptions,
} from 'discord.js';
import { find } from 'weather-js';

export default class WeatherCommand extends BaseCommand {
	constructor() {
		super(
			'weather',
			'miscellaneous',
			[],
			'',
			'Get the weather for a certain location',
			'',
			[],
			[],
			[],
			[],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(
		client: DiscordClient,
		message: Message,
		args: string[]
	): Promise<any> {
		const self = this;

		const city = args.join(' ');
		if (!city) {
			const errorEmbed = await self.ErrorEmbed.Base({
				accessor: message,
				text: self,
				error_message: 'Plese mention a city',
			});
			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return self.Utils.Delete(msg);
		}
		find({ search: city, degreeType: 'C' }, async function (err, res) {
			if (err) {
				console.log(err);

				const errorEmbed = await self.ErrorEmbed.UnexpectedError({
					accessor: message,
					text: self,
				});
				const msg = await message.channel.send({ embeds: [errorEmbed] });
				return self.Utils.Delete(msg);
			}

			if (!res || res.length === '0' || res.length === 0) {
				const errorEmbed = await self.ErrorEmbed.NoResult({
					accessor: message,
					text: self,
				});
				const msg = await message.channel.send({ embeds: [errorEmbed] });
				return self.Utils.Delete(msg);
			}

			if (res.length > 1) {
				let index = 1;
				let string = '';
				string += `**Please pick from one of the following**\n${res
					.slice(0, 10)
					.map((x) => `**${index++}**) \`${x.location.name}\``)
					.join('\n')}`;
				const embed = await self.Embed.Base({
					accessor: message,
					text: self,
					title: `Oops, there are multiple locations!`,
					description: string,
				});

				const mesg = await message.channel.send({ embeds: [embed] });
				self.Utils.Delete(mesg);

				const options: MessageCollectorOptions = {
					filter: (m) => {
						return (
							m.author.id === message.author.id &&
							new RegExp('^([1-5|cancel])$', 'i').test(m.content)
						);
					},
					time: 30000,
					max: 1,
				};

				const collector = message.channel.createMessageCollector(options);

				collector.on('collect', async (m) => {
					if (/cancel/i.test(m.content)) return collector.stop('cancelled');

					const region = res[Number(m.content) - 1];

					const weatherEmbed = await self.ImageEmbed.Base({
						iconURL: message.member.displayAvatarURL({ dynamic: true }),
						text: self,
						title: `Weather command | Current`,
						description: `Location: \`${region.location.name}\``,
						image: region.current.imageUrl,
						fields: [
							{
								name: 'Temperature',
								value: `\`${region.current.temperature}°C\``,
							},
							{ name: 'Sky text', value: `\`${region.current.skytext}\`` },
							{ name: 'Humidity', value: `\`${region.current.humidity}\`` },
							{ name: 'Wind speed', value: `\`${region.current.windspeed}\`` },
							{
								name: 'Observation time:',
								value: `\`${region.current.observationtime}\``,
							},
							{
								name: 'Wind display',
								value: `\`${region.current.winddisplay}\``,
							},
						],
					});

					const embeds = [weatherEmbed];

					const forecasts = region.forecast.filter(
						(day) => Date.parse(day.date) > Date.now()
					);

					for (let forecast of forecasts) {
						const embed = self.Embed.Base({
							accessor: message,
							title: `Weather Command | ${forecast.date}`,
							description: `Location: \`${region.location.name}\``,
							text: self,
							fields: [
								{ name: 'Low', value: `\`${forecast.low}\`` },
								{ name: 'High', value: `\`${forecast.high}\`` },
								{ name: 'Sky text', value: `\`${forecast.skytextday}\`` },
								{
									name: 'Chance of rain',
									value: `${
										forecast.precip.length > 0
											? `\`${forecast.precip}%\``
											: '`Unknown`'
									}`,
								},
							],
						});

						embeds.push(embed);
					}

					await self.Utils.Paginate({
						accessor: message,
						embeds: embeds,
					});
					return;
				});

				collector.on('end', async (_, reason) => {
					if (['time', 'cancelled'].includes(reason)) {
						const embed = await self.SuccessEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							id: message.guild.id,
							text: self,
							success_message: 'Successfully cancelled selection!',
						});
						const msg = await message.channel.send({ embeds: [embed] });
						self.Utils.Delete(msg);
						return;
					}
				});
			} else {
				const currentEmbed = await self.ImageEmbed.Base({
					iconURL: message.member.displayAvatarURL({ dynamic: true }),
					text: self,
					title: `Weather command | Current`,
					description: `Location: \`${res[0].location.name}\``,
					image: res[0].current.imageUrl,
					fields: [
						{
							name: 'Temperature',
							value: `\`${res[0].current.temperature}°C\``,
						},
						{ name: 'Sky text', value: `\`${res[0].current.skytext}\`` },
						{ name: 'Humidity', value: `\`${res[0].current.humidity}\`` },
						{ name: 'Wind speed', value: `\`${res[0].current.windspeed}\`` },
						{
							name: 'Observation time:',
							value: `\`${res[0].current.observationtime}\``,
						},
						{
							name: 'Wind display',
							value: `\`${res[0].current.winddisplay}\``,
						},
					],
				});

				const embeds = [currentEmbed];

				const forecasts = res[0].forecast.filter(
					(day) => Date.parse(day.date) > Date.now()
				);

				for (let forecast of forecasts) {
					const embed = self.Embed.Base({
						accessor: message,
						title: `Weather Command | ${forecast.date}`,
						description: `Location: \`${res[0].location.name}\``,
						text: self,
						fields: [
							{ name: 'Low', value: `\`${forecast.low}\`` },
							{ name: 'High', value: `\`${forecast.high}\`` },
							{ name: 'Sky text', value: `\`${forecast.skytextday}\`` },
							{
								name: 'Chance of rain',
								value: `${
									forecast.precip.length > 0
										? `\`${forecast.precip}%\``
										: '`Unknown`'
								}`,
							},
						],
					});

					embeds.push(embed);
				}

				return await self.Utils.Paginate({ accessor: message, embeds: embeds });
			}
		});
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const location = interaction.options.getString('query');
		const self = this;

		await interaction.deferReply();

		find({ search: location, degreeType: 'C' }, async function (err, res) {
			if (err) {
				console.log(err);

				const errorEmbed = await self.ErrorEmbed.UnexpectedError({
					accessor: interaction,
					text: self,
				});

				return await interaction.editReply({ embeds: [errorEmbed] });
			}

			if (!res || res.length === '0' || res.length === 0) {
				const errorEmbed = await self.ErrorEmbed.NoResult({
					accessor: interaction,
					text: self,
				});

				return await interaction.editReply({ embeds: [errorEmbed] });
			}

			if (res.length > 1) {
				let index = 1;
				let string = '';
				string += `**Please pick from one of the following**\n${res
					.slice(0, 10)
					.map((x) => `**${index++}**) \`${x.location.name}\``)
					.join('\n')}`;

				const embed = await self.Embed.Base({
					accessor: interaction,
					text: self,
					title: `Oops, there are multiple locations!`,
					description: string,
				});

				const mesg = await interaction.channel.send({ embeds: [embed] });

				const options: MessageCollectorOptions = {
					filter: (m) => {
						return (
							m.author.id === interaction.user.id &&
							new RegExp('^([1-5|cancel])$', 'i').test(m.content)
						);
					},
					time: 30000,
					max: 1,
				};

				const collector = interaction.channel.createMessageCollector(options);

				collector.on('collect', async (m) => {
					if (/cancel/i.test(m.content)) return collector.stop('cancelled');
					await m.delete();
					await mesg.delete();

					const region = res[Number(m.content) - 1];

					const weatherEmbed = await self.ImageEmbed.Base({
						iconURL:
							interaction.member instanceof GuildMember
								? interaction.member.displayAvatarURL({ dynamic: true })
								: interaction.guild.members.cache
										.find((u) => u.id == interaction.member.user.id)
										.displayAvatarURL({ dynamic: true }),
						text: self,
						title: `Weather command | Current`,
						description: `Location: \`${region.location.name}\``,
						image: region.current.imageUrl,
						fields: [
							{
								name: 'Temperature',
								value: `\`${region.current.temperature}°C\``,
							},
							{ name: 'Sky text', value: `\`${region.current.skytext}\`` },
							{ name: 'Humidity', value: `\`${region.current.humidity}\`` },
							{ name: 'Wind speed', value: `\`${region.current.windspeed}\`` },
							{
								name: 'Observation time:',
								value: `\`${region.current.observationtime}\``,
							},
							{
								name: 'Wind display',
								value: `\`${region.current.winddisplay}\``,
							},
						],
					});

					const embeds = [weatherEmbed];

					const forecasts = region.forecast.filter(
						(day) => Date.parse(day.date) > Date.now()
					);

					for (let forecast of forecasts) {
						const embed = self.Embed.Base({
							accessor: interaction,
							title: `Weather Command | ${forecast.date}`,
							description: `Location: \`${region.location.name}\``,
							text: self,
							fields: [
								{ name: 'Low', value: `\`${forecast.low}\`` },
								{ name: 'High', value: `\`${forecast.high}\`` },
								{ name: 'Sky text', value: `\`${forecast.skytextday}\`` },
								{
									name: 'Chance of rain',
									value: `${
										forecast.precip.length > 0
											? `\`${forecast.precip}%\``
											: '`Unknown`'
									}`,
								},
							],
						});

						embeds.push(embed);
					}
					await interaction.editReply({ content: 'Your result(s): ' });
					await self.Utils.Paginate({
						accessor: interaction,
						embeds: embeds,
					});
					return;
				});

				collector.on('end', async (_, reason) => {
					if (['time', 'cancelled'].includes(reason)) {
						const embed = await self.SuccessEmbed.Base({
							iconURL:
								interaction.member instanceof GuildMember
									? interaction.member.displayAvatarURL({ dynamic: true })
									: interaction.guild.members.cache
											.find((u) => u.id == interaction.member.user.id)
											.displayAvatarURL({ dynamic: true }),
							id: interaction.guild.id,
							text: self,
							success_message: 'Successfully cancelled selection!',
						});
						await interaction.editReply({ embeds: [embed] });
						await mesg.delete();
						return;
					}
				});
			} else {
				const currentEmbed = await self.ImageEmbed.Base({
					iconURL:
						interaction.member instanceof GuildMember
							? interaction.member.displayAvatarURL({ dynamic: true })
							: interaction.guild.members.cache
									.find((u) => u.id == interaction.member.user.id)
									.displayAvatarURL({ dynamic: true }),
					text: self,
					title: `Weather command | Current`,
					description: `Location: \`${res[0].location.name}\``,
					image: res[0].current.imageUrl,
					fields: [
						{
							name: 'Temperature',
							value: `\`${res[0].current.temperature}°C\``,
						},
						{ name: 'Sky text', value: `\`${res[0].current.skytext}\`` },
						{ name: 'Humidity', value: `\`${res[0].current.humidity}\`` },
						{ name: 'Wind speed', value: `\`${res[0].current.windspeed}\`` },
						{
							name: 'Observation time:',
							value: `\`${res[0].current.observationtime}\``,
						},
						{
							name: 'Wind display',
							value: `\`${res[0].current.winddisplay}\``,
						},
					],
				});

				const embeds = [currentEmbed];

				const forecasts = res[0].forecast.filter(
					(day) => Date.parse(day.date) > Date.now()
				);

				for (let forecast of forecasts) {
					const embed = self.Embed.Base({
						accessor: interaction,
						title: `Weather Command | ${forecast.date}`,
						description: `Location: \`${res[0].location.name}\``,
						text: self,
						fields: [
							{ name: 'Low', value: `\`${forecast.low}\`` },
							{ name: 'High', value: `\`${forecast.high}\`` },
							{ name: 'Sky text', value: `\`${forecast.skytextday}\`` },
							{
								name: 'Chance of rain',
								value: `${
									forecast.precip.length > 0
										? `\`${forecast.precip}%\``
										: '`Unknown`'
								}`,
							},
						],
					});

					embeds.push(embed);
				}
				await interaction.editReply({ content: 'Your result(s):' });
				return await self.Utils.Paginate({
					accessor: interaction,
					embeds: embeds,
				});
			}
		});
	}
}
