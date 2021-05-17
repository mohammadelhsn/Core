import { Snowflake } from 'discord.js';
import {
	Cached_Guild,
	Welcome,
	Roles,
	Leave,
	Channels,
	Strings,
} from './Interfaces/CachedGuild';

export default class CachedGuild {
	id: Snowflake;
	prefix: string;
	lang: string;
	welcome: Welcome;
	roles: Roles;
	leave: Leave;
	Channels: Channels;
	Strings: Strings;
	constructor(items: Cached_Guild) {
		this.id = items.id;
		this.prefix = items.prefix;
		this.lang = items.lang;
		this.welcome = items.welcome;
		this.roles = items.roles;
		this.leave = items.leave;
		this.Channels = items.Channels;
		this.Strings = items.Strings;
	}
}
