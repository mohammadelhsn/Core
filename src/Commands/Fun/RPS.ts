import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class RPSCommand extends BaseCommand {
	constructor() {
		super(
			'rps',
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
		let rps = [
			'**:moyai: rock**',
			'**:pencil: paper**',
			'**:scissors: scissors**',
		];
		function random() {
			return `${rps[Math.floor(Math.random() * rps.length)]}!`;
		}
		let choice = args.join(' ').toLowerCase();
		if (!choice) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Please make a choice',
			});

			const msg = await message.channel.send({ embed: errorEmbed });
			return msg.delete({ timeout: 10000 });
		}
		if (choice.includes('help')) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		} else if (
			choice !== 'rock' &&
			choice !== 'paper' &&
			choice !== 'scissors'
		) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Please pick a valid choice: rock, paper or scissors',
			});

			const msg = await message.channel.send({ embed: errorEmbed });
			return msg.delete({ timeout: 10000 });
		}
		const rpsEmbed = await this.Embed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			title: 'Rock paper or scissors',
			description: `${random()}`,
		});

		return message.channel.send({ embed: rpsEmbed });
	}
}
