import { registerCommands, registerEvents } from './Utils/Register';
import { Message, messageLink } from 'discord.js';
import * as dotenv from 'dotenv';
import DiscordClient from './Client/Client';
import { GatewayIntentBits } from 'discord.js';
const client = new DiscordClient({
	intents: [
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
	],
});

dotenv.config();

globalThis.client = client as DiscordClient;

// @ts-ignore
Message.prototype.timeout = function (msg?: Message, timeout?: number) {
	if (!timeout) timeout = 10000;

	if (msg && msg.deletable == true) {
		setTimeout(() => {
			this.delete();
		}, timeout);
		return this;
	}
	return this;
};

(async () => {
	await registerCommands(client, '../Commands');
	await registerEvents(client, '../Events');
	await client.login(process.env.DISCORD_TOKEN);
})();
