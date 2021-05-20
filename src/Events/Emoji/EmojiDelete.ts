import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { GuildEmoji } from 'discord.js';

export default class EmojiDeleteEvent extends BaseEvent {
	constructor() {
		super('emojiDelete');
	}
	async run(client: DiscordClient, emoji: GuildEmoji) {}
}
