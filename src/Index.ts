import { registerCommands, registerEvents } from './Utils/Register';
import { Intents, Message } from 'discord.js';
import * as dotenv from 'dotenv';
import DiscordClient from './Client/Client';
const client = new DiscordClient({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_INTEGRATIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
	],
});

dotenv.config();

globalThis.client = client as DiscordClient;

// @ts-ignore
Message.prototype.timeout = function (msg?: Message, timeout?: number) {
	if (!timeout) timeout = 10000;

	if (msg) {
		if (msg.deleted == true) throw new Error('Message is already deleted!');
		setTimeout(() => {
			msg.delete();
		});
		return this;
	}

	if (this.deleted == true) throw new Error('Message is already deleted!');

	setTimeout(() => {
		this.delete();
	}, timeout);
	return this;
};

(async () => {
	await registerCommands(client, '../Commands');
	await registerEvents(client, '../Events');
	await client.login(process.env.DISCORD_TOKEN);
})();
