import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class SmackCommand extends BaseCommand {
	constructor() {
		super(
			'smack',
			'reaction images',
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
		const lang = await this.Translator.Getlang(message.guild.id);
		const self = this;
		let user;
		const mention = message.mentions.users.first();

		if (!mention) {
			user = args[0];
		} else {
			user = mention;
		}
		if (!user) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'You are missing the mention!',
			});
			const msg = await message.channel.send({ embed: errorEmbed });
			return msg.delete({ timeout: 10000 });
		} else if (user == args[0] && user.toLowerCase().includes('help')) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		} else {
			const generatingEmbed = await this.GeneratingEmbed.NekosFun({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});

			const m = await message.channel.send({ embed: generatingEmbed });
			try {
				const res = await this.Reactions.Smack();

				if (res.error == true) {
					m.delete();

					const errEmbed = await this.ErrorEmbed.ApiError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});

					const msg = await message.channel.send({ embed: errEmbed });
					return msg.delete({ timeout: 10000 });
				}

				const pokeEmbed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Spank command',
					description: `<@${message.author.id}> has spanked ${user}!`,
					image: res.file,
				});

				m.delete();
				return message.channel.send({ embed: pokeEmbed });
			} catch (e) {
				m.delete();

				const errEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});
				return message.channel.send({ embed: errEmbed });
			}
		}
	}
}