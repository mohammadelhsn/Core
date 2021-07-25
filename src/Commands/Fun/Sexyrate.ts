import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class SexyrateCommand extends BaseCommand {
	constructor() {
		super(
			'sexyrate',
			'fun',
			[],
			'(mention)',
			'Returns a rating of 100 for you or the mentioned user',
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
		const self = this;
		const sexyrate = Math.floor(Math.random() * 100);

		if (!args[0]) {
			const sexyRateEmbed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Sexyrate command',
				description: `:heart: Sexy rate :heart: I rate you a \`${sexyrate}\` out of 100 on the sexy rate scale!`,
			});
			return message.channel.send({ embed: sexyRateEmbed });
		} else {
			let mention = message.mentions.users.first();
			let toR8;
			if (mention) {
				toR8 = mention;
			} else {
				toR8 = args[0];
			}
			if (toR8 == args[0]) {
				if (toR8.toLowerCase().includes('help')) {
					return await this.HelpEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						command: this,
						message: message,
					});
				} else {
					const rateEmbed = await this.Embed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						description: `:heart: Sexy rate :heart: I rate ${toR8} a \`${sexyrate}\` out of 100 on the sexy rate scale!`,
					});
					return message.channel.send({ embed: rateEmbed });
				}
			}
			if (toR8 == mention) {
				const rateEmbed = await this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					description: `:heart: Sexy rate :heart: I rate ${toR8} a \`${sexyrate}\` out of 100 on the sexy rate scale!`,
				});

				return message.channel.send({ embed: rateEmbed });
			}
		}
	}
}
