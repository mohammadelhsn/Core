import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class AvatarCommand extends BaseCommand {
	constructor() {
		super(
			'avatar',
			'server utilities',
			[],
			'(mention)',
			'Returns the mentioned users avatar or your avatar',
			'',
			[],
			[],
			['SEND_MESSAGES', 'EMBED_LINKS'],
			[],
			true,
			false,
			false,
			3000,
			'debug'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const user =
			message.mentions.members.first() ||
			message.guild.members.cache.find((u) => u.user.id == args[0]) ||
			message.guild.members.cache.find((u) => u.user.username == args[0]) ||
			message.guild.members.cache.find((u) => u.nickname == args[0]);
		const argument = args[0];

		if (user) {
			const embed = await this.ImageEmbed.Base({
				iconURL: user.user.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `${user.user.tag}'s avatar`,
				description: `Link: [Click here](${user.user.displayAvatarURL({
					dynamic: true,
				})})`,
				image: user.user.displayAvatarURL({ dynamic: true }),
			});

			return message.channel.send({ embeds: [embed] });
		}

		if (argument) {
			if (argument.toLowerCase().includes('help')) {
				return this.HelpEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					command: this,
					event: { message: message },
				});
			} else {
				try {
					const profile = await client.users.fetch(argument);

					const embed = await this.ImageEmbed.Base({
						iconURL: profile.displayAvatarURL({ dynamic: true }),
						text: this,
						title: `${profile.tag}'s avatar`,
						description: `Link: [Click here](${profile.displayAvatarURL({
							dynamic: true,
						})})`,
						image: profile.displayAvatarURL({ dynamic: true }),
					});

					return message.channel.send({ embeds: [embed] });
				} catch (e) {
					return;
				}
			}
		}

		if (!argument) {
			const embed = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `${message.author.tag}'s avatar`,
				description: `Link: [Click here](${message.author.displayAvatarURL({
					dynamic: true,
				})})`,
				image: message.author.displayAvatarURL({ dynamic: true }),
			});

			return message.channel.send({ embeds: [embed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
