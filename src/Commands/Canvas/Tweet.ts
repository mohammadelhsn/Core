import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	AwaitMessagesOptions,
	CommandInteraction,
	Message,
	MessageAttachment,
} from 'discord.js';

export default class TweetCommand extends BaseCommand {
	constructor() {
		super(
			'tweet',
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
				command: this,
				accessor: message,
			});
		}

		let timedOut = false;

		const isFromAuthor = (m) => m.author.id == message.author.id;

		const options: AwaitMessagesOptions = {
			filter: isFromAuthor,
			max: 1,
			time: 60000,
		};

		const tEmbed = this.Embed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			description: 'Please mention someone / say me for a username',
		});

		await message.channel.send({ embeds: [tEmbed] });

		const firstColl = await message.channel.awaitMessages(options);

		if (firstColl.size > 0) {
			let username;
			if (firstColl.first().content.length > 0) {
				if (firstColl.first().content.toLowerCase() == 'me') {
					username = message.author.username;
				}
			}
			if (firstColl.first().mentions.members.size > 0) {
				username = firstColl.first().mentions.members.first().user.username;
			}

			const dEmbed = this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				description: 'Mention some text for the comment!',
			});

			await message.channel.send({ embeds: [dEmbed] });

			const secondColl = await message.channel.awaitMessages(options);

			if (secondColl.size > 0) {
				const comment = secondColl.first().content;

				if (comment.toLowerCase() === 'cancel') {
					const embed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: 'Successfully cancelled selection!',
					});

					return message.channel.send({ embeds: [embed] });
				}

				const gEmbed = await this.GeneratingEmbed.SomeRandomApi({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
				});

				const m = await message.channel.send({ embeds: [gEmbed] });

				try {
					const image = await this.Canvas.Tweet(username, comment);
					const file = new MessageAttachment(image.file, 'tweet.png');

					console.log(file);

					const embed = await this.Embed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: 'Tweet command',
						description: this.Utils.FormatProvider('Some Random API'),
						image: 'attachment://tweet.png',
					});

					m.delete();
					return message.channel.send({ files: [file], embeds: [embed] });
				} catch (e) {
					m.delete();
					console.log(e);

					const embed = await this.ErrorEmbed.UnexpectedError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});

					return message.channel.send({ embeds: [embed] });
				}
			} else timedOut = true;
		} else timedOut = true;

		if (timedOut == true) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Command timed out',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
