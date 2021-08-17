import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, MessageCollectorOptions, MessageEmbed } from 'discord.js';
import axios from 'axios';
import moment from 'moment';
import { cpuUsage } from 'process';

export default class CovidCommand extends BaseCommand {
	constructor() {
		super(
			'covid',
			'miscellaneous',
			[],
			'',
			'Get covid stats',
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
	async run(
		client: DiscordClient,
		message: Message,
		args: string[]
	): Promise<any> {
		const choice = args[0];
		const q = args.slice(1).join(' ');
		const lang = await this.Translator.Getlang(message.guild.id);

		if (!choice) {
			try {
				const res = await axios.get(`https://corona.lmao.ninja/v2/all`);
				const data = res.data;

				const embed = await this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Covid command | Worldwide`,
					description: `Population: \`${this.Utils.FormatNumber(
						data.population
					)}\` | Affected countries: \`${this.Utils.FormatNumber(
						data.affectedCountries
					)}\``,
					fields: [
						{
							name: 'Updated',
							value: `\`${moment(data.updated).format(
								'dddd, MMMM Do YYYY, h:mm:ss a'
							)}\``,
						},
						{
							name: 'Today stats',
							value: `Cases: \`${this.Utils.FormatNumber(
								data.todayCases
							)}\`\nDeaths: \`${this.Utils.FormatNumber(
								data.todayDeaths
							)}\`\nRecovered: \`${this.Utils.FormatNumber(
								data.todayRecovered
							)}\``,
						},
						{
							name: 'Total',
							value: `Cases: \`${this.Utils.FormatNumber(
								data.cases
							)}\`\nDeaths: \`${this.Utils.FormatNumber(
								data.deaths
							)}\`\nRecovered: \`${this.Utils.FormatNumber(
								data.recovered
							)}\`\nActive: \`${this.Utils.FormatNumber(
								data.active
							)}\`\nCritical: \`${this.Utils.FormatNumber(
								data.critical
							)}\`\nTests: \`${this.Utils.FormatNumber(data.tests)}\``,
						},
						{
							name: 'Per million stats',
							value: `Cases: \`${this.Utils.FormatNumber(
								data.casesPerOneMillion
							)}\`\nDeaths: \`${this.Utils.FormatNumber(
								data.deathsPerOneMillion
							)}\`\nRecovered: \`${this.Utils.FormatNumber(
								data.recoveredPerOneMillion
							)}\`\nActive: \`${this.Utils.FormatNumber(
								data.activePerOneMillion
							)}\`\nCritical: \`${this.Utils.FormatNumber(
								data.criticalPerOneMillion
							)}\`\nTests: \`${this.Utils.FormatNumber(
								data.testsPerOneMillion
							)}\``,
						},
					],
				});
				return message.channel.send({ embeds: [embed] });
			} catch (e) {
				console.log(e);

				const errEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
				});
				return message.channel.send({ embeds: [errEmbed] });
			}
		}
		if (choice.toLowerCase().includes('worldwide')) {
			//
			try {
				const res = await axios.get(`https://corona.lmao.ninja/v2/all`);
				const data = res.data;

				const embed = await this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Covid command | Worldwide`,
					description: `Population: \`${this.Utils.FormatNumber(
						data.population
					)}\` | Affected countries: \`${this.Utils.FormatNumber(
						data.affectedCountries
					)}\``,
					fields: [
						{
							name: 'Updated',
							value: `\`${moment(data.updated).format(
								'dddd, MMMM Do YYYY, h:mm:ss a'
							)}\``,
						},
						{
							name: 'Today stats',
							value: `Cases: \`${this.Utils.FormatNumber(
								data.todayCases
							)}\`\nDeaths: \`${this.Utils.FormatNumber(
								data.todayDeaths
							)}\`\nRecovered: \`${this.Utils.FormatNumber(
								data.todayRecovered
							)}\``,
						},
						{
							name: 'Total',
							value: `Cases: \`${this.Utils.FormatNumber(
								data.cases
							)}\`\nDeaths: \`${this.Utils.FormatNumber(
								data.deaths
							)}\`\nRecovered: \`${this.Utils.FormatNumber(
								data.recovered
							)}\`\nActive: \`${this.Utils.FormatNumber(
								data.active
							)}\`\nCritical: \`${this.Utils.FormatNumber(
								data.critical
							)}\`\nTests: \`${this.Utils.FormatNumber(data.tests)}\``,
						},
						{
							name: 'Per million stats',
							value: `Cases: \`${this.Utils.FormatNumber(
								data.casesPerOneMillion
							)}\`\nDeaths: \`${this.Utils.FormatNumber(
								data.deathsPerOneMillion
							)}\`\nRecovered: \`${this.Utils.FormatNumber(
								data.recoveredPerOneMillion
							)}\`\nActive: \`${this.Utils.FormatNumber(
								data.activePerOneMillion
							)}\`\nCritical: \`${this.Utils.FormatNumber(
								data.criticalPerOneMillion
							)}\`\nTests: \`${this.Utils.FormatNumber(
								data.testsPerOneMillion
							)}\``,
						},
					],
				});
				return message.channel.send({ embeds: [embed] });
			} catch (e) {
				console.log(e);

				const errEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
				});
				return message.channel.send({ embeds: [errEmbed] });
			}
		} else if (choice.toLowerCase().includes('country')) {
			if (!q) {
				try {
					const res = await axios.get(`https://corona.lmao.ninja/v2/countries`);
					const data = res.data;

					const embeds = [];

					data.forEach((c) => {
						embeds.push(
							new MessageEmbed()
								.setAuthor(client.user.username, c.countryInfo.flag)
								.setTitle(`Covid command | ${c.country}, ${c.continent}`)
								.setDescription(
									`Poplulation: \`${this.Utils.FormatNumber(c.population)}\``
								)
								.addField(
									'Updated',
									`\`${moment(c.updated).format(
										'dddd, MMMM Do YYYY, h:mm:ss a'
									)}\``
								)
								.addField(
									'Today stats',
									`Cases: \`${this.Utils.FormatNumber(
										c.todayCases
									)}\`\nDeaths: \`${this.Utils.FormatNumber(
										c.todayDeaths
									)}\`\nRecovered: \`${this.Utils.FormatNumber(
										c.todayRecovered
									)}\``
								)
								.addField(
									'Total',
									`Cases: \`${this.Utils.FormatNumber(
										c.cases
									)}\`\nDeaths: \`${this.Utils.FormatNumber(
										c.deaths
									)}\`\nRecovered: \`${this.Utils.FormatNumber(
										c.recovered
									)}\`\nActive: \`${this.Utils.FormatNumber(
										c.active
									)}\`\nCritical: \`${this.Utils.FormatNumber(
										c.critical
									)}\`\nTests: \`${this.Utils.FormatNumber(c.tests)}\``
								)
								.addField(
									'Per million stats',
									`Cases: \`${this.Utils.FormatNumber(
										c.casesPerOneMillion
									)}\`\nDeaths: \`${this.Utils.FormatNumber(
										c.deathsPerOneMillion
									)}\`\nRecovered: \`${this.Utils.FormatNumber(
										c.recoveredPerOneMillion
									)}\`\nActive: \`${this.Utils.FormatNumber(
										c.activePerOneMillion
									)}\`\nCritical: \`${this.Utils.FormatNumber(
										c.criticalPerOneMillion
									)}\`\nTests: \`${this.Utils.FormatNumber(
										c.testsPerOneMillion
									)}\``
								)
								.setColor(this.Colour.Set())
								.setTimestamp()
								.setThumbnail(c.countryInfo.flag)
						);
					});
					return this.Utils.Paginate(message, {
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
			} else {
				try {
					const res = await axios.get(
						`https://corona.lmao.ninja/v2/countries/${q}`
					);
					const data = res.data;

					const embed = await this.Embed.Base({
						iconURL: data.countryInfo.flag,
						text: this,
						title: `Covid command | ${data.country}, ${data.continent}`,
						description: `Population: \`${this.Utils.FormatNumber(
							data.population
						)}\``,
						fields: [
							{
								name: 'Updated',
								value: `\`${moment(data.updated).format(
									'dddd, MMMM Do YYYY, h:mm:ss a'
								)}\``,
							},
							{
								name: 'Today stats',
								value: `Cases: \`${this.Utils.FormatNumber(
									data.todayCases
								)}\`\nDeaths: \`${this.Utils.FormatNumber(
									data.todayDeaths
								)}\`\nRecovered: \`${this.Utils.FormatNumber(
									data.todayRecovered
								)}\``,
							},
							{
								name: 'Total',
								value: `Cases: \`${this.Utils.FormatNumber(
									data.cases
								)}\`\nDeaths: \`${this.Utils.FormatNumber(
									data.deaths
								)}\`\nRecovered: \`${this.Utils.FormatNumber(
									data.recovered
								)}\`\nActive: \`${this.Utils.FormatNumber(
									data.active
								)}\`\nCritical: \`${this.Utils.FormatNumber(
									data.critical
								)}\`\nTests: \`${this.Utils.FormatNumber(data.tests)}\``,
							},
							{
								name: 'Per million stats',
								value: `Cases: \`${this.Utils.FormatNumber(
									data.casesPerOneMillion
								)}\`\nDeaths: \`${this.Utils.FormatNumber(
									data.deathsPerOneMillion
								)}\`\nRecovered: \`${this.Utils.FormatNumber(
									data.recoveredPerOneMillion
								)}\`\nActive: \`${this.Utils.FormatNumber(
									data.activePerOneMillion
								)}\`\nCritical: \`${this.Utils.FormatNumber(
									data.criticalPerOneMillion
								)}\`\nTests: \`${this.Utils.FormatNumber(
									data.testsPerOneMillion
								)}\``,
							},
						],
					});

					return message.channel.send({ embeds: [embed] });
				} catch (e) {
					if (e.response.status == 404) {
						const errEmbed = await this.ErrorEmbed.NoResult({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
						});
						return message.channel.send({ embeds: [errEmbed] });
					}

					console.log(e);

					const errEmbed = await this.ErrorEmbed.UnexpectedError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
					});
					return message.channel.send({ embeds: [errEmbed] });
				}
			}
		} else if (choice.toLowerCase().includes('region')) {
			// https://corona.lmao.ninja/v2/jhucsse
			try {
				const res = await axios.get(`https://corona.lmao.ninja/v2/jhucsse`);
				const data = res.data;

				if (q.toLowerCase().includes('null'))
					return message.channel.send("This isn't a valid place!");

				const filtered = data.filter(
					(r) => String(r.province).toLowerCase() == q.toLowerCase()
				);
				if (!filtered || filtered.length == 0)
					return message.channel.send(
						'Oops, there are no results for your query!'
					);

				const region = filtered[0];

				const embed = await this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Covid command | ${region.province}, ${region.country}`,
					description: `Latitude: \`${region.coordinates.latitude}\`, Longitude: \`${region.coordinates.longitude}\``,
					fields: [
						{ name: 'Updated at', value: `\`${region.updatedAt}\`` },
						{
							name: 'Confirmed',
							value: `\`${this.Utils.FormatNumber(region.stats.confirmed)}\``,
						},
						{
							name: 'Deaths',
							value: `\`${this.Utils.FormatNumber(region.stats.deaths)}\``,
						},
						{
							name: 'Recovered',
							value: `\`${this.Utils.FormatNumber(region.stats.recovered)}\``,
						},
					],
				});

				return message.channel.send({ embeds: [embed] });
			} catch (e) {
				console.log(e);

				const errEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
				});

				return message.channel.send({ embeds: [errEmbed] });
			}
		} else if (choice.toLowerCase().includes('vaccine')) {
			// https://api.covid19tracker.ca/summary
			try {
				const res = await axios.get(`https://api.covid19tracker.ca/summary`);
				const data = res.data;

				return message.channel.send({
					embeds: [
						await this.Embed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							title: 'Covid command | Vaccines',
							description: `Location: \`Canada\``,
							fields: [
								{
									name: 'Latest date:',
									value: `\`${data.data[0].latest_date}\``,
								},
								{
									name: 'Last updated',
									value: `\`${data.last_updated}\``,
								},
								{
									name: 'New Vaccinations:',
									value: `\`${this.Utils.FormatNumber(
										data.data[0].change_vaccinations
									)}\``,
								},
								{
									name: 'New Vaccinated:',
									value: `\`${this.Utils.FormatNumber(
										data.data[0].change_vaccinated
									)}\``,
								},
								{
									name: 'New vaccines distributed:',
									value: `\`${this.Utils.FormatNumber(
										data.data[0].change_vaccines_distributed
									)}\``,
								},
								{
									name: 'Total vaccinations:',
									value: `\`${this.Utils.FormatNumber(
										data.data[0].total_vaccinations
									)}\``,
								},
								{
									name: 'Total vaccinated:',
									value: `\`${this.Utils.FormatNumber(
										data.data[0].total_vaccinated
									)}\``,
								},
								{
									name: 'Total vaccines distributed:',
									value: `\`${this.Utils.FormatNumber(
										data.data[0].total_vaccines_distributed
									)}\``,
								},
							],
						}),
					],
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
		} else if (choice.toLowerCase().includes('continent')) {
			// https://corona.lmao.ninja/v2/continents/{continent}
			if (!q) {
				try {
					const res = await axios.get(
						`https://corona.lmao.ninja/v2/continents/`
					);
					const data = res.data;

					const embeds = [];

					data.forEach((co) => {
						embeds.push(
							new MessageEmbed()
								.setAuthor(
									client.user.username,
									message.author.displayAvatarURL({ dynamic: true })
								)
								.setTitle(`Covid command | ${co.continent}`)
								.setDescription(
									`Population: \`${this.Utils.FormatNumber(co.population)}\``
								)
								.addField(
									'Updated',
									`\`${moment(co.updated).format(
										'dddd, MMMM Do YYYY, h:mm:ss a'
									)}\``
								)
								.addField(
									'Today stats',
									`Cases: \`${this.Utils.FormatNumber(
										co.todayCases
									)}\`\nDeaths: \`${this.Utils.FormatNumber(
										co.todayDeaths
									)}\`\nRecovered: \`${this.Utils.FormatNumber(
										co.todayRecovered
									)}\``
								)
								.addField(
									'Total',
									`Cases: \`${this.Utils.FormatNumber(
										co.cases
									)}\`\nDeaths: \`${this.Utils.FormatNumber(
										co.deaths
									)}\`\nRecovered: \`${this.Utils.FormatNumber(
										co.recovered
									)}\`\nActive: \`${this.Utils.FormatNumber(
										co.active
									)}\`\nCritical: \`${this.Utils.FormatNumber(
										co.critical
									)}\`\nTests: \`${this.Utils.FormatNumber(co.tests)}\``
								)
								.addField(
									'Per million stats',
									`Cases: \`${this.Utils.FormatNumber(
										co.casesPerOneMillion
									)}\`\nDeaths: \`${this.Utils.FormatNumber(
										co.deathsPerOneMillion
									)}\`\nRecovered: \`${this.Utils.FormatNumber(
										co.recoveredPerOneMillion
									)}\`\nActive: \`${this.Utils.FormatNumber(
										co.activePerOneMillion
									)}\`\nCritical: \`${this.Utils.FormatNumber(
										co.criticalPerOneMillion
									)}\`\nTests: \`${this.Utils.FormatNumber(
										co.testsPerOneMillion
									)}\``
								)
								.addField(
									'Countries:',
									`${co.countries.map((c) => `\`${c}\``).join(' ')}`
								)
								.setColor(this.Colour.Set())
								.setTimestamp()
								.setThumbnail(
									message.author.displayAvatarURL({ dynamic: true })
								)
						);
					});
					return this.Utils.Paginate(message, {
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
			} else {
				try {
					const res = await axios.get(
						`https://corona.lmao.ninja/v2/continents/${q}`
					);
					const data = res.data;

					const embed = await this.Embed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: `Covid command | ${data.continent}`,
						description: `Population: \`${this.Utils.FormatNumber(
							data.population
						)}\``,
						fields: [
							{
								name: 'Updated',
								value: `\`${moment(data.updated).format(
									'dddd, MMMM Do YYYY, h:mm:ss a'
								)}\``,
							},
							{
								name: 'Today stats',
								value: `Cases: \`${this.Utils.FormatNumber(
									data.todayCases
								)}\`\nDeaths: \`${this.Utils.FormatNumber(
									data.todayDeaths
								)}\`\nRecovered: \`${this.Utils.FormatNumber(
									data.todayRecovered
								)}\``,
							},
							{
								name: 'Total',
								value: `Cases: \`${this.Utils.FormatNumber(
									data.cases
								)}\`\nDeaths: \`${this.Utils.FormatNumber(
									data.deaths
								)}\`\nRecovered: \`${this.Utils.FormatNumber(
									data.recovered
								)}\`\nActive: \`${this.Utils.FormatNumber(
									data.active
								)}\`\nCritical: \`${this.Utils.FormatNumber(
									data.critical
								)}\`\nTests: \`${this.Utils.FormatNumber(data.tests)}\``,
							},
							{
								name: 'Per million stats',
								value: `Cases: \`${this.Utils.FormatNumber(
									data.casesPerOneMillion
								)}\`\nDeaths: \`${this.Utils.FormatNumber(
									data.deathsPerOneMillion
								)}\`\nRecovered: \`${this.Utils.FormatNumber(
									data.recoveredPerOneMillion
								)}\`\nActive: \`${this.Utils.FormatNumber(
									data.activePerOneMillion
								)}\`\nCritical: \`${this.Utils.FormatNumber(
									data.criticalPerOneMillion
								)}\`\nTests: \`${this.Utils.FormatNumber(
									data.testsPerOneMillion
								)}\``,
							},
							{
								name: 'Countries',
								value: `${data.countries.map((c) => `\`${c}\``).join(' ')}`,
							},
						],
					});
					return message.channel.send({ embeds: [embed] });
				} catch (e) {
					if (e.response.status == 404) {
						const embed = await this.ErrorEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
							error_message: "Couldn't find this continent",
						});
						const msg = await message.channel.send({ embeds: [embed] });
						return this.Utils.Delete(msg);
					}
				}
			}
		} else if (choice.toLowerCase().includes('county')) {
			// https://corona.lmao.ninja/v2/jhucsse/counties/Abbeville
			if (!q) {
				const res = await axios.get(
					`https://corona.lmao.ninja/v2/jhucsse/counties`
				);
				const data = res.data;
				const embeds = [];

				data.forEach((c) => {
					embeds.push(
						new MessageEmbed()
							.setAuthor(
								client.user.username,
								message.author.displayAvatarURL({ dynamic: true })
							)
							.setTitle(
								`Covid command | ${c.county} ${c.province}, ${c.country}`
							)
							.setDescription(
								`Latitude: \`${c.coordinates.latitude}\`, Longitude: \`${c.coordinates.longitude}\``
							)
							.addField(
								'Confirmed:',
								`\`${
									c.stats.confirmed
										? this.Utils.FormatNumber(c.stats.confirmed)
										: 'N/A'
								}\``
							)
							.addField(
								'Deaths:',
								`\`${
									c.stats.deaths
										? this.Utils.FormatNumber(c.stats.deaths)
										: 'N/A'
								}\``
							)
							.addField(
								'Recovered:',
								`\`${
									c.stats.recovered
										? this.Utils.FormatNumber(c.stats.recovered)
										: 'N/A'
								}\``
							)
							.setColor(this.Colour.Set())
							.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
							.setTimestamp()
					);
				});
				return this.Utils.Paginate(message, {
					embeds: embeds,
					timeout: 600000,
				});
			} else {
				try {
					const res = await axios.get(
						`https://corona.lmao.ninja/v2/jhucsse/counties/${q}`
					);
					const data = res.data;

					if (data.length > 1) {
						let index = 1;
						let string = '';
						string += `Please pick from one of the following!\n${data
							.map(
								(x) => `${index++} - ${x.county} ${x.province}, ${x.country}`
							)
							.join('\n')}`;

						const embed = await this.Embed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							title: 'Covid command | Counties',
							description: string,
						});
						const msg = await message.channel.send({ embeds: [embed] });
						this.Utils.Delete(msg);

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

							const region = data[Number(m.content) - 1];

							const embed = await this.Embed.Base({
								iconURL: message.author.displayAvatarURL({ dynamic: true }),
								text: this,
								title: `Covid command | ${region.county} ${region.province}, ${region.country}`,
								description: `Latitude: \`${region.coordinates.latitude}\`, Longitude: \`${region.coordinates.longitude}\``,
								fields: [
									{
										name: 'Confirmed:',
										value: `\`${
											region.stats.confirmed
												? this.Utils.FormatNumber(region.stats.confirmed)
												: 'N/A'
										}\``,
									},
									{
										name: 'Deaths:',
										value: `\`${
											region.stats.deaths
												? this.Utils.FormatNumber(region.stats.deaths)
												: 'N/A'
										}\``,
									},
									{
										name: 'Recovered:',
										value: `\`${
											region.stats.recovered
												? this.Utils.FormatNumber(region.stats.recovered)
												: 'N/A'
										}\``,
									},
								],
							});

							message.channel.send({ embeds: [embed] });
							return;
						});

						collector.on('end', async (_, reason) => {
							if (['time', 'cancelled'].includes(reason)) {
								message.channel.send('Cancelled selection');
								return;
							}
						});
					} else {
						const embed = await this.Embed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							title: `Covid command | ${data[0].county} ${data[0].province}, ${data[0].country}`,
							description: `Latitude: \`${data[0].coordinates.latitude}\`, Longitude: \`${data[0].coordinates.longitude}\``,
							fields: [
								{
									name: 'Confirmed:',
									value: `\`${
										data[0].stats.confirmed
											? this.Utils.FormatNumber(data[0].stats.confirmed)
											: 'N/A'
									}\``,
								},
								{
									name: 'Deaths:',
									value: `\`${
										data[0].stats.deaths
											? this.Utils.FormatNumber(data[0].stats.deaths)
											: 'N/A'
									}\``,
								},
								{
									name: 'Recovered:',
									value: `\`${
										data[0].stats.recovered
											? this.Utils.FormatNumber(data[0].stats.recovered)
											: 'N/A'
									}\``,
								},
							],
						});

						return message.channel.send({ embeds: [embed] });
					}
				} catch (e) {
					console.log(e);

					if (e.response.status == 404) {
						const embed = await this.ErrorEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
							error_message: "Couldn't find this country!",
						});
						const msg = await message.channel.send({ embeds: [embed] });
						return this.Utils.Delete(msg);
					}
				}
			}
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
}
