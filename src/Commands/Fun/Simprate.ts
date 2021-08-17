import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class SimprateCommand extends BaseCommand {
	constructor() {
		super(
			'simprate',
			'fun',
			[],
			'',
			'Returns a simprate for you or the mentioned user',
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
			const simprate = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Simprate command',
				description: `:heart: Simp rate :heart: I rate you a \`${sexyrate}\` out of 100 on the simp rate scale!`,
			});
			return message.channel.send({ embeds: [simprate] });
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
						title: 'Simprate command',
						description: `:heart: Simp rate :heart: I rate ${toR8} a \`${sexyrate}\` out of 100 on the simp rate scale!`,
					});

					return message.channel.send({ embeds: [rateEmbed] });
				}
			}
			if (toR8 == mention) {
				const rateEmbed = await this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Simprate command',
					description: `:heart: Simp rate :heart: I rate ${toR8} a \`${sexyrate}\` out of 100 on the simp rate scale!`,
				});
				return message.channel.send({ embeds: [rateEmbed] });
			}
		}
	}
}
