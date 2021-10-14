import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	CommandInteraction,
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
			'',
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
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: self,
				id: message.guild.id,
				error_message: 'Plese mention a city',
			});
			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return this.Utils.Delete(msg);
		}
		find({ search: city, degreeType: 'C' }, async function (err, res) {
			if (err) {
				console.log(err);

				const errorEmbed = await self.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: self,
					id: message.guild.id,
				});
				const msg = await message.channel.send({ embeds: [errorEmbed] });
				return this.Utils.Delete(msg);
			}

			if (!res || res.length === '0' || res.length === 0) {
				const errorEmbed = await self.ErrorEmbed.NoResult({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: self,
					id: message.guild.id,
				});
				const msg = await message.channel.send({ embeds: [errorEmbed] });
				return this.Utils.Delete(msg);
			}

			if (res.length > 1) {
				let index = 1;
				let string = '';
				string += `**Please pick from one of the following**\n${res
					.slice(0, 10)
					.map((x) => `**${index++}**) \`${x.location.name}\``)
					.join('\n')}`;
				const embed = await self.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: `Oops, there are multiple locations!`,
					description: string,
				});
				const mesg = await message.channel.send({ embeds: [embed] });
				this.Utils.Delete(mesg);

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
						iconURL: region.current.imageUrl,
						text: self,
						title: `Weather command`,
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
					message.channel.send({ embeds: [weatherEmbed] });
					return;
				});

				collector.on('end', async (_, reason) => {
					if (['time', 'cancelled'].includes(reason)) {
						const embed = await self.SuccessEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							id: message.guild.id,
							text: this,
							success_message: 'Successfully cancelled selection!',
						});
						const msg = await message.channel.send({ embeds: [embed] });
						this.Utils.Delete(msg);
						return;
					}
				});
			} else {
				const weatherEmbed = await self.ImageEmbed.Base({
					iconURL: res[0].current.imageUrl,
					text: self,
					title: `Weather command`,
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
				return message.channel.send({ embeds: [weatherEmbed] });
			}
		});
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
