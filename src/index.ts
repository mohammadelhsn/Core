import { registerCommands, registerEvents } from './utils/Register';
import { Manager } from 'erela.js';
import * as dotenv from 'dotenv';
import DiscordClient from './bot/bot';
const client = new DiscordClient();

dotenv.config();

//client.manager = new Manager({})

(async () => {
	await registerCommands(client, '../command');
	await registerEvents(client, '../event');
	await client.login(process.env.DISCORD_TOKEN);
})();
