import { Client, ClientOptions, Collection } from 'discord.js';
import { Manager } from 'erela.js';
import BaseEvent from '../Utils/Structures/BaseEvent';
import BaseCommand from '../Utils/Structures/BaseCommand';

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
