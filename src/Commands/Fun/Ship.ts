import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class ShipCommand extends BaseCommand {
	constructor() {
		super(
			'ship',
			'fun',
			[],
			'',
			'Ship people!',
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

		if (args[0] && args[0] == 'help') {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				accessor: message,
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

			const msg = await message.channel.send({ embeds: [errEmbed] });
			return this.Utils.Delete(msg);
		}

		const ship = Math.floor(Math.random() * 100) + 1;

		if (ship <= 50) {
			const badmatch = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `${mention1.user.username} and ${mention2.user.username} dont ship well. Oof`,
				description: `:broken_heart: \`${ship}\`% :broken_heart:`,
			});
			return message.channel.send({ embeds: [badmatch] });
		} else if (ship === 100) {
			const perfectMatch = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `${mention1.user.username} and ${mention2.user.username} are meant for each other! :eyes:`,
				description: `:heart_eyes: \`${ship}\`% :heart_eyes:`,
			});

			return message.channel.send({ embeds: [perfectMatch] });
		} else {
			const match = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `${mention1.user.username} and ${mention2.user.username} match well`,
				description: `:heart: \`${ship}\`% :heart:`,
			});

			return message.channel.send({ embeds: [match] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const user1 = interaction.options.getUser('user1');
		const user2 = interaction.options.getUser('user2') || interaction.user;

		const ship = Math.floor(Math.random() * 100) + 1;

		if (ship == 100) {
			const perfectMatch = await this.Embed.Base({
				accessor: interaction,
				text: this,
				title: `${user1.username} and ${user2.username} are meant for each other! :eyes:`,
				description: `:heart_eyes: \`${ship}\`% :heart_eyes:`,
			});

			return await interaction.reply({ embeds: [perfectMatch] });
		}
		if (ship <= 50) {
			const badmatch = await this.Embed.Base({
				accessor: interaction,
				text: this,
				title: `${user1.username} and ${user2.username} dont ship well. Oof`,
				description: `:broken_heart: \`${ship}\`% :broken_heart:`,
			});
			return interaction.reply({ embeds: [badmatch] });
		}

		const match = await this.Embed.Base({
			accessor: interaction,
			text: this,
			title: `${user1.username} and ${user2.username} match well`,
			description: `:heart: \`${ship}\`% :heart:`,
		});

		return await interaction.reply({ embeds: [match] });
	}
}
