import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class ShipCommand extends BaseCommand {
	constructor() {
		super(
			'ship',
			'fun',
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
		const self = this;

		if (args[0] && args[0] == 'help') {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		let mention1;
		let mention2;

		if (message.mentions.members.size == 1) {
			mention1 = message.mentions.members.first();
			mention2 = message.member;
		}

		if (message.mentions.members.size == 2) {
			mention1 = message.mentions.members.first();
			mention2 = message.mentions.members.last();
		}

		if (message.mentions.members.size == 0) {
			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'You require at least one mention',
			});

			const msg = await message.channel.send({ embed: errEmbed });
			return msg.delete({ timeout: 10000 });
		}

		const ship = Math.floor(Math.random() * 100) + 1;

		if (ship <= 50) {
			const badmatch = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `${mention1.user.username} and ${mention2.user.username} dont ship well. Oof`,
				description: `:broken_heart: \`${ship}\`% :broken_heart:`,
			});
			return message.channel.send({ embed: badmatch });
		} else if (ship === 100) {
			const perfectMatch = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `${mention1.user.username} and ${mention2.user.username} are meant for each other! :eyes:`,
				description: `:heart_eyes: \`${ship}\`% :heart_eyes:`,
			});

			return message.channel.send({ embed: perfectMatch });
		} else {
			const match = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `${mention1.user.username} and ${mention2.user.username} match well`,
				description: `:heart: \`${ship}\`% :heart:`,
			});

			return message.channel.send({ embed: match });
		}
	}
}
