import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { GuildEmoji } from 'discord.js';

export default class EmojiUpdateEvent extends BaseEvent {
	constructor() {
		super('emojiUpdate');
	}
	async run(
		client: DiscordClient,
		oldEmoji: GuildEmoji,
		newEmoji: GuildEmoji
	) {}
}
