import { Client, ClientOptions, Collection } from 'discord.js';
import { Manager } from 'erela.js';
import BaseEvent from '../utils/structures/BaseEvent';
import BaseCommand from '../utils/structures/BaseCommand';

export default class DiscordClient extends Client {
	private _commands = new Collection<string, BaseCommand>();
	private _events = new Collection<string, BaseEvent>();
	private _aliases = new Collection<string, string>();
	public manager: Manager;

	constructor(options?: ClientOptions) {
		super(options);
	}

	get commands(): Collection<string, BaseCommand> {
		return this._commands;
	}
	get events(): Collection<string, BaseEvent> {
		return this._events;
	}
	get aliases(): Collection<string, string> {
		return this._aliases;
	}
}