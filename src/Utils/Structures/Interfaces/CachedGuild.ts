import { Snowflake } from 'discord.js';

namespace CachedGuildTypes {
	export interface Welcome {
		channel: Snowflake | null | 'null';
		isenabled: boolean;
		media?: string;
		message?: string;
	}
	export interface event {
		enabled: boolean;
		channel: string;
	}
	export interface events {
		channelCreate: event;
		channelDelete: event;
		channelUpdate: event;
		emojiCreate: event;
		emojiDelete: event;
		emojiUpdate: event;
		guildUpdate: event;
		inviteCreate: event;
		inviteDelete: event;
		guildBanAdd: event;
		guildBanRemove: event;
		guildMemberAdd: event;
		guildMemberRemove: event;
		guildMemberUpdate: event;
		messageDelete: event;
		messageDeleteBulk: event;
		messageUpdate: event;
		voiceMemberJoin: event;
		voiceMemberLeave: event;
		voiceMemberMoved: event;
	}

	export interface Leave {
		channel: Snowflake | null | 'null';
		isenabled: boolean;
		media?: string;
		message: string;
	}

	export interface Roles {
		modrole: Snowflake | null;
		muterole: Snowflake | null;
		adminrole: Snowflake | null;
		warningrole: Snowflake | null;
	}

	export interface Channels {
		modlog: Snowflake | null;
		appeals: Snowflake | null;
		reports: Snowflake | null;
		actionlog: Snowflake | null;
		suggestions: Snowflake | null;
		publicmodlog: Snowflake | null;
	}

	export interface Strings {
		error_message: string;
		generating: string;
		SomeRandomAPI: string;
		NekosFun: string;
		NekosBot: string;
		NekosLife: string;
		DiscordIG: string;
		Duncte123: string;
		DogCeoAPI: string;
		FunResponses: string;
		Alexflipnote: string;
		status: string;
		working: string;
		name: string;
		category: string;
		aliases: string;
		usage: string;
		description: string;
		accessible_by: string;
		permissions: string;
		subCommands: string;
		example: string;
		guild_only: string;
		owner_only: string;
		cooldown: string;
		user_permissions: string;
		yes: string;
		no: string;
		none: string;
		is_required: string;
		is_optional: string;
		seconds: string;
	}

	export interface Cached_Guild {
		id: Snowflake;
		prefix: string;
		lang: string;
		welcome: Welcome;
		leave: Leave;
		roles: Roles;
		Channels: Channels;
		Strings: Strings;
		Events: events;
	}

	export interface Blacklisted {
		roles: string[];
		users: string[];
		channels: string[];
	}
	export interface Disabled {
		commands: string[];
		categories: string[];
	}
	export interface Protected {
		users: string[];
		roles: string[];
	}
	export interface tags {
		name: string;
		content: string;
	}
	export type Tags = tags[];
	export interface ranks {
		name: string;
		id: Snowflake;
	}
	export type Ranks = ranks[];
	export interface moderation {
		moderation: string;
		user: Snowflake;
		reason: string;
		caseNumber: number;
		moderatorId: Snowflake;
		messageId: Snowflake;
		publicMessageId: Snowflake;
		modlog: Snowflake;
		publicmodlog: Snowflake;
		moderationdate: number;
		lastupdated: number;
		updateby: string;
	}
	export type Moderations = moderation[];
	export interface Note {
		userid: string;
		content: string;
	}
	export type Notes = Note[];
}

export = CachedGuildTypes;
