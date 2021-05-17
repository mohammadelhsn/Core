import DiscordClient from '../../Client/Client';
import StateManager from '../StateManager';
import Functions from '../Functions';

export default abstract class BaseEvent {
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
	constructor(private name: string) {}

	getName(): string {
		return this.name;
	}
	abstract run(client: DiscordClient, ...args: any): void;
}
