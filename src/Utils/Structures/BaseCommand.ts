import { Message } from 'discord.js';
import DiscordClient from '../../Client/Client';
import StateManager from '../StateManager';
import Functions from '../Functions';

export default abstract class BaseCommand {
	con = StateManager.con;
	Colour = new Functions.Colour();
	Translator = new Functions.Translator();
	Utils = new Functions.Utils();
	Channels = new Functions.Channels();
	Settings = new Functions.Settings();
	Economy = new Functions.Economy();
	Xp = new Functions.Xp();
	ErrorEmbed = new Functions.ErrorEmbed();
	SuccessEmbed = new Functions.SuccessEmbed();
	Embed = new Functions.Embed();
	HelpEmbed = new Functions.HelpEmbed();
	GeneratingEmbed = new Functions.GeneratingEmbed();
	ImageEmbed = new Functions.ImageEmbed();
	Moderation = new Functions.Moderation();
	constructor(
		private name: string,
		private category: string,
		private aliases: Array<string>,
		private usage?: string,
		private description?: string,
		private accessibleby?: string,
		private Subcommands?: string[],
		private example?: string[],
		private botpermissions?: string[],
		private userpermissions?: string[],
		private guildOnly?: boolean | string,
		private ownerOnly?: boolean | string,
		private nsfw?: boolean | string,
		private cooldown?: number,
		private status?: 'working' | 'debug' | 'WIP'
	) {}

	getName(): string {
		return this.name;
	}
	getCategory(): string {
		return this.category;
	}
	getAliases(): Array<string> {
		return this.aliases;
	}

	getUsage(): string {
		return this.usage ? this.usage : 'N/A';
	}
	getDescription(): string {
		return this.description ? this.description : 'N/A';
	}
	getAccessible(): string {
		return this.accessibleby ? this.accessibleby : 'Members';
	}
	getSubcommands(): string[] {
		return this.Subcommands ? this.Subcommands : [];
	}
	getExamples(): string[] {
		return this.example ? this.example : [];
	}
	getBotpermissions(): string[] {
		return this.botpermissions ? this.botpermissions : [];
	}
	getUserpermissions(): string[] {
		return this.userpermissions ? this.userpermissions : [];
	}
	getGuildonly(): string | boolean {
		return this.guildOnly ? this.guildOnly : true;
	}
	getOwneronly(): string | boolean {
		return this.ownerOnly ? this.ownerOnly : false;
	}
	getNsfw(): string | boolean {
		return this.nsfw ? this.nsfw : false;
	}
	getCooldown(): number {
		return this.cooldown ? this.cooldown : 3000;
	}
	getStatus(): 'working' | 'debug' | 'WIP' {
		return this.status ? this.status : 'working';
	}

	abstract run(
		client: DiscordClient,
		message: Message,
		args: Array<string> | null
	);
}
