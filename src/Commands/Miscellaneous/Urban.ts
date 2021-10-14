import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';
import urban from 'urban';

export default class UrbanCommand extends BaseCommand {
	constructor() {
		super(
			'urban',
			'miscellaneous',
			[],
			'',
			'Search a word on urban dictionary',
			'',
			[],
			[],
			['SEND_MESSAGES', 'EMBED_LINKS'],
			[],
			true,
			false,
			false,
			3000,
			'WIP'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const image =
			'http://cdn.marketplaceimages.windowsphone.com/v8/images/5c942bfe-6c90-45b0-8cd7-1f2129c6e319?imageType=ws_icon_medium';
		const search = args[0] ? urban(args.slice(1).join('%20')) : urban.random();

		if (!args[1] || !['search', 'random'].includes(args[0])) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				message: message,
				command: this,
			});
		}
		try {
			search.first(async (res) => {
				if (!res) {
					const errorEmbed = await this.ErrorEmbed.NoResult({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});
					const msg = await message.channel.send({ embeds: [errorEmbed] });
					return this.Utils.Delete(msg);
				}
				let {
					word,
					definition,
					example,
					thumbs_up,
					thumbs_down,
					permalink,
					author,
				} = res;

				const embed = await this.Embed.Base({
					iconURL: image,
					text: `${author ? `Written by \`${author}\`` : 'Urban command'}`,
					title: `Urban Dictionary | ${word}`,
					description: `Definition: \`${
						definition ? `${definition}` : 'N/A'
					}\``,
					fields: [
						{ name: 'Example', value: `\`${example ? `${example}` : 'N/A'}\`` },
						{
							name: `${this.Emojis.upvote}`,
							value: `${
								thumbs_up ? `${this.Utils.FormatNumber(thumbs_up)}` : '0'
							}`,
						},
						{
							name: `${this.Emojis.downvote}`,
							value: `${
								thumbs_down ? `${this.Utils.FormatNumber(thumbs_down)}` : '0'
							}`,
						},
						{
							name: 'Permalink',
							value: `[Link to ${word}](${
								permalink ? permalink : 'https://www.urbandictionary.com/'
							})`,
						},
					],
				});
				return message.channel.send({ embeds: [embed] });
			});
		} catch (e) {
			console.log(e);

			const errorEmbed = await this.ErrorEmbed.UnexpectedError({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});
			return message.channel.send({ embeds: [errorEmbed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
