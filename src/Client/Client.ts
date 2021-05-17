import { Client, ClientOptions, Collection, Snowflake } from 'discord.js';
import { Manager } from 'erela.js';
import BaseEvent from '../Utils/Structures/BaseEvent';
import BaseCommand from '../Utils/Structures/BaseCommand';
import CachedGuild from '../Utils/Structures/CachedGuild';

export default class DiscordClient extends Client {
	private _commands = new Collection<string, BaseCommand>();
	private _events = new Collection<string, BaseEvent>();
	private _aliases = new Collection<string, string>();
	private _database = new Collection<Snowflake, CachedGuild>();
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
	get database(): Collection<Snowflake, CachedGuild> {
		return this._database;
	}
}
