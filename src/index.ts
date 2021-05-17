import { registerCommands, registerEvents } from './utils/registry';
import { Manager } from 'erela.js';
import * as dotenv from 'dotenv';
import DiscordClient from './client/client';
const client = new DiscordClient();

dotenv.config();

//client.manager = new Manager({})

(async () => {
	await registerCommands(client, '../commands');
	await registerEvents(client, '../events');
	await client.login(process.env.DISCORD_TOKEN);
})();
