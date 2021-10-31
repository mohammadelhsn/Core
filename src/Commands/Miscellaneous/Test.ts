import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	Message,
	MessageFlags,
	Permissions,
	Interaction,
	CommandInteraction,
	MessageEmbed,
} from 'discord.js';
import BaseObj from '../../Utils/Structures/BaseObj';
import axios from 'axios';
import Responses from '../../Utils/Structures/Interfaces/Response';

export default class TesstCommand extends BaseCommand {
	constructor() {
		super(
			'tesst',
			'miscellaneous',
			[],
			'',
			'A simple testing command',
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
		const embed = await this.Embed.Base({
			description: 'Test',
			accessor: message,
			text: this,
			fields: [
				{
					name: 'Check mark',
					value: `${this.Emojis.upvote}, ${this.Emojis.downvote}, ${this.Emojis.verified}`,
				},
				{
					name: 'Row 2 ',
					value: `${this.Emojis.bruh} ${this.Emojis.eyesshaking} ${this.Emojis.cry} ${this.Emojis.wot}`,
				},
				{
					name: 'Row 3',
					value: `${this.Emojis.streaming_emoji} ${this.Emojis.online_emoji} ${this.Emojis.offline_emoji} ${this.Emojis.dnd_emoji} ${this.Emojis.idle_emoji}`,
				},
				{
					name: 'Row 4',
					value: `${this.Emojis.loading} ${this.Emojis.loading_discord} ${this.Emojis.bot_emoji} ${this.Emojis.information_emoji}`,
				},
				{
					name: 'Row 5',
					value: `${this.Emojis.hypesquad_brilliance} ${this.Emojis.hypesquad_bravery} ${this.Emojis.hypesquad_balance} ${this.Emojis.discord_partner} ${this.Emojis.discord_bot_dev}`,
				},
			],
		});

		return message.reply({ embeds: [embed] });
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
