import { Message, PermissionResolvable, CommandInteraction } from 'discord.js';
import DiscordClient from '../../Client/Client';
import StateManager from '../StateManager';
import Functions from '../Functions';
import Emojis from '../../../Emojis.json';
import Colours from '../../../Colours.json';
import API from '../API';
import Schemas from '../Schemas';

export default abstract class BaseCommand {
	// API functions
	Animals = new API.Animals();
	Canvas = new API.Canvas();
	Facts = new API.Facts();
	Fun = new API.Fun();
	Memes = new API.Memes();
	Miscellaneous = new API.Miscellaneous();
	Reactions = new API.Reactions();
	// Functions
	Colour = new Functions.Colour();
	Translator = new Functions.Translator();
	Utils = new Functions.Utils();
	Channels = new Functions.Channels();
	Settings = new Functions.Settings();
	ErrorEmbed = new Functions.ErrorEmbed();
	SuccessEmbed = new Functions.SuccessEmbed();
	Embed = new Functions.Embed();
	HelpEmbed = new Functions.HelpEmbed();
	GeneratingEmbed = new Functions.GeneratingEmbed();
	ImageEmbed = new Functions.ImageEmbed();
	Moderation = new Functions.Moderation();
	// Misc properties
	con = StateManager.con;
	Emojis = Emojis;
	Colours = Colours;
	Schemas = Schemas;
	constructor(
		private name: string,
		private category: string,
		private aliases: Array<string>,
		private usage?: string,
		private description?: string,
		private accessibleby?: string,
		private Subcommands?: string[],
		private example?: string[],
		private botpermissions?: PermissionResolvable[],
		private userpermissions?: PermissionResolvable[],
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
		return this.usage ? this.usage : this.name;
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
	getBotpermissions(): PermissionResolvable[] {
		return this.botpermissions ? this.botpermissions : [];
	}
	getUserpermissions(): PermissionResolvable[] {
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
		args: string[] | null
	): Promise<any>;
	abstract slash(
		client: DiscordClient,
		interaction: CommandInteraction
	): Promise<any>;
}
