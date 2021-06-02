import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, MessageAttachment } from 'discord.js';
import { Podium } from 'discord-image-generation';

export default class PodiumCommand extends BaseCommand {
	constructor() {
		super(
			'podium',
			'canvas',
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
	async run(client: DiscordClient, message: Message, args: string[]) {
		const guild = client.database.get(message.guild.id);

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				message: message,
				command: this,
			});
		}

		let timedOut = false;

		const isFromAuthor = (m) => m.author.id == message.author.id;

		const options = {
			max: 1,
			time: 60000,
		};

		const tEmbed = this.Embed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			description: 'Please mention the first member!',
		});

		await message.channel.send({ embed: tEmbed });

		const firstColl = await message.channel.awaitMessages(
			isFromAuthor,
			options
		);

		if (firstColl.size > 0) {
			let user1;
			if (firstColl.first().mentions.members.size > 0) {
				user1 = firstColl.first().mentions.members.first();
			}

			const dEmbed = this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				description: 'Please mention the second member!',
			});

			await message.channel.send({ embed: dEmbed });

			const secondColl = await message.channel.awaitMessages(
				isFromAuthor,
				options
			);

			if (secondColl.size > 0) {
				let user2;
				if (secondColl.first().mentions.members.size > 0) {
					user2 = secondColl.first().mentions.members.first();
				}

				const cEmbed = this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					description: 'Now for the the third and final member',
				});

				await message.channel.send(cEmbed);
				const thirdColl = await message.channel.awaitMessages(
					isFromAuthor,
					options
				);

				if (thirdColl.size > 0) {
					let user3;
					if (thirdColl.first().mentions.members.size > 0) {
						user3 = thirdColl.first().mentions.members.first();
					}

					const gEmbed = await this.GeneratingEmbed.DiscordIG({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
					});

					const m = await message.channel.send({ embed: gEmbed });

					try {
						const image = await new Podium().getImage(
							`${user1.user.displayAvatarURL({ format: 'png' })}`,
							`${user2.user.displayAvatarURL({ format: 'png' })}`,
							`${user3.user.displayAvatarURL({ format: 'png' })}`,
							`${user1.user.username}`,
							`${user2.user.username}`,
							`${user3.user.username}`
						);
						const file = new MessageAttachment(image, 'podium.png');

						const embed = await this.ImageEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							title: 'Podium command',
							description: guild.Strings.DiscordIG,
							image: 'attachment://podium.png',
						});

						m.delete();
						return message.channel.send({ files: [file], embed: embed });
					} catch (e) {
						m.delete();
						console.log(e);

						const errorEmbed = await this.ErrorEmbed.UnexpectedError({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							id: message.guild.id,
							text: this,
						});
						return message.channel.send({ embed: errorEmbed });
					}
				} else timedOut = true;
			} else timedOut = true;
		} else timedOut = true;

		if (timedOut === true) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Command timed out',
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}
	}
}
