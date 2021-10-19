import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class HugCommand extends BaseCommand {
	constructor() {
		super(
			'hug',
			'reaction images',
			[],
			'<mention>',
			'Hug the mentioned user',
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
		const lang = await this.Translator.Getlang(message.guild.id);
		const self = this;

		let user;
		const mention = message.mentions.users.first();

		if (mention) {
			user = mention;
		} else {
			user = args[0];
		}

		if (!user) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'You are missing the mention',
			});
			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return msg.delete({ timeout: 10000 });
		} else if (user == args[0] && user.toLowerCase().includes('help')) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				accessor: message,
			});
		} else {
			const generatingEmbed = await this.GeneratingEmbed.NekosFun({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});

			const m = await message.channel.send({ embeds: [generatingEmbed] });
			try {
				const res = await this.Reactions.Hug();

				if (res.error == true) {
					m.delete();

					const errEmbed = await this.ErrorEmbed.ApiError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});

					const msg = await message.channel.send({ embeds: [errEmbed] });
					return this.Utils.Delete(msg);
				}

				const hugEmbed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Hug command',
					description: `<@${message.author.id}> has hugged ${user}! Aww!`,
					image: res.file,
				});

				m.delete();
				return message.channel.send({ embeds: [hugEmbed] });
			} catch (e) {
				m.delete();
				console.log(e);

				const errEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});
				return message.channel.send({ embeds: [errEmbed] });
			}
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const user = interaction.options.getUser('user');

		if (!user) {
			const errEmbed = await this.ErrorEmbed.Base({
				text: this,
				error_message: 'Missing required user mention',
				accessor: interaction,
			});

			return await interaction.reply({ embeds: [errEmbed] });
		}

		const generatingEmbed = await this.GeneratingEmbed.NekosFun({
			accessor: interaction,
			text: this,
		});

		await interaction.reply({ embeds: [generatingEmbed] });

		try {
			const res = await this.Reactions.Hug();

			if (res.error == true) {
				const errEmbed = await this.ErrorEmbed.ApiError({
					text: this,
					accessor: interaction,
				});

				return await interaction.editReply({ embeds: [errEmbed] });
			}

			const hugEmbed = await this.ImageEmbed.Base({
				accessor: interaction,
				text: this,
				title: 'Hug command',
				description: `${interaction.user.toString()} has hugged ${user.toString()}! Aww!`,
				image: res.file,
			});

			return await interaction.editReply({ embeds: [hugEmbed] });
		} catch (error) {
			console.log(error);

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				accessor: interaction,
				text: this,
			});
			return interaction.editReply({ embeds: [errEmbed] });
		}
	}
}
