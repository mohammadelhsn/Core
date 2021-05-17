//import { registerCommands, registerEvents } from './Utils/Register';
import { Manager } from 'erela.js';
import * as dotenv from 'dotenv';
//import DiscordClient from './Client/Client';
const client = new DiscordClient();

dotenv.config();

//client.manager = new Manager({})

(async () => {
	await registerCommands(client, '../Commands');
	await registerEvents(client, '../Events');
	await client.login(process.env.DISCORD_TOKEN);
})();
