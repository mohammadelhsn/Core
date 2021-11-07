import DiscordClient from '../../Client/Client';
import StateManager from '../StateManager';
import Functions from '../Functions';
import Emojis from '../../../Emojis.json';
import Colours from '../../../Colours.json';
import Schemas from '../Schemas';

export default abstract class BaseEvent {
	protected con = StateManager.con;
	protected Colour = new Functions.Colour();
	protected Translator = new Functions.Translator();
	protected Utils = new Functions.Utils();
	protected Channels = new Functions.Channels();
	protected Settings = new Functions.Settings();
	protected ErrorEmbed = new Functions.ErrorEmbed();
	protected SuccessEmbed = new Functions.SuccessEmbed();
	protected Embed = new Functions.Embed();
	protected HelpEmbed = new Functions.HelpEmbed();
	protected GeneratingEmbed = new Functions.GeneratingEmbed();
	protected ImageEmbed = new Functions.ImageEmbed();
	protected Moderation = new Functions.Moderation();
	protected Slash = new Functions.SlashCommands();
	protected Emojis = Emojis;
	protected Colours = Colours;
	protected Schemas = Schemas;
	constructor(private name: string) {}

	getName(): string {
		return this.name;
	}
	abstract run(client: DiscordClient, ...args: any): void;
}
