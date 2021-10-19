import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class RedditCommand extends BaseCommand {
	constructor() {
		super(
			'reddit',
			'miscellaneous',
			[],
			'',
			'Do a search for a subreddit or a reddit user',
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
		const type = args[0];
		const query = args.slice(1).join(' ');

		if (!query) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'You are missing a required argument',
			});
			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return msg.delete({ timeout: 10000 });
		}

		if (!type) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				accessor: message,
			});
		}
		if (type.toLowerCase() === 'user') {
			try {
				const data = await this.Miscellaneous.RedditUser(query);
				const embed = await this.Embed.Base({
					iconURL: data.file,
					text: this,
					title: data.title,
					description: '',
					link: data.link,
					fields: [
						{
							name: 'Total karma',
							value: `\`${this.Utils.FormatNumber(
								parseInt(data.misc.totalKarma)
							)}\``,
						},
						{
							name: 'Creation date',
							value: `\`${data.misc.created_at}\``,
						},
						{
							name: 'Employee?',
							value: `\`${data.misc.employee ? 'Yes' : 'No'}\``,
						},
						{
							name: 'Premium',
							value: `\`${data.misc.premium ? 'Yes' : 'No'}\``,
						},
					],
				});
				return message.channel.send({ embeds: [embed] });
			} catch (err) {
				if (err.status == 404) {
					const errorEmbed = await this.ErrorEmbed.NoResult({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});
					const msg = await message.channel.send({ embeds: [errorEmbed] });
					return this.Utils.Delete(msg);
				} else {
					const errorEmbed = await this.ErrorEmbed.UnexpectedError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});
					return message.channel.send({ embeds: [errorEmbed] });
				}
			}
		}
		if (type.toLowerCase() === 'subreddit') {
			try {
				const data = await this.Miscellaneous.Subreddit(query);

				const embed = await this.ImageEmbed.Base({
					iconURL: data.file,
					text: this,
					title: data.title,
					description: `Description: \`${data.text}\``,
					fields: [
						{
							name: 'Subreddit type',
							value: `\`${this.Utils.Capitalize(data.misc.type)}\``,
						},
						{
							name: 'Language',
							value: `\`${data.misc.language}\``,
						},
						{
							name: 'Subscribers',
							value: `\`${data.misc.subscribers}\``,
						},
						{
							name: 'Accounts active:',
							value: `\`${data.misc.active}\``,
						},
						{
							name: 'Quarantined?',
							value: `\`${data.misc.quarantined}\``,
						},
						{
							name: 'NSFW?',
							value: `\`${data.misc.nsfw}\``,
						},
						{
							name: 'Created:',
							value: `\`${data.misc.created_at}\``,
						},
					],
					image: data.misc.banner,
					link: data.link,
				});
				return message.channel.send({ embeds: [embed] });
			} catch (err) {
				const errorEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});
				return message.channel.send({ embeds: [errorEmbed] });
			}
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
