import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { GuildEmoji } from 'discord.js';

export default class EmojiCreateEvent extends BaseEvent {
	constructor() {
		super('emojiCreate');
	}
	async run(client: DiscordClient, emoji: GuildEmoji) {
		const guild = emoji.guild;
	}
}
