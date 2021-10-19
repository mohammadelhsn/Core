import { Channel } from 'diagnostics_channel';
import {
	Snowflake,
	MessageEmbed,
	Message,
	EmbedFieldData,
	PermissionResolvable,
	CommandInteraction,
	Role,
	GuildChannel,
	TextChannel,
	Interaction,
	GuildEmoji,
	User,
	GuildMember,
	Guild,
	HexColorString,
	ColorResolvable,
} from 'discord.js';
import BaseCommand from '../BaseCommand';

namespace FunctionOpts {
	export type colours = {
		red: string;
		green: string;
		blue: string;
		purple: string;
		pink: string;
		orange: string;
		yellow: string;
		gold: string;
		cyan: string;
		cream: string;
		white: string;
		random: 'random';
	};
	export interface ColourOpts {
		shade?: 'dark' | 'light';
	}
	export type pagination = (
		msg: Message,
		pages: MessageEmbed[],
		emojiList?: ['⏪', '⏩'] | string[],
		timeout?: number | 120000
	) => Promise<void>;
	export interface PaginateOpts {
		embeds?: MessageEmbed[];
		emojiList?: string[];
		timeout?: number;
		accessor: accessor;
	}
	export type toFetch =
		| 'prefix'
		| 'lang'
		| 'channels'
		| 'roles'
		| 'strings'
		| 'welcome'
		| 'leave';

	type iconURL = string;
	type accessor = CommandInteraction | Message;
	type colour = ColorResolvable;
	// if no iconURL iconURL = default
	// if no ID id is default

	export interface EmbedOpts {
		iconURL?: iconURL;
		description: string;
		text: string | BaseCommand;
		title?: string;
		fields?: EmbedFieldData[];
		link?: string;
		image?: string;
		accessor?: accessor;
		colour?: colour;
	}

	export interface BaseErrorOpts {
		iconURL?: iconURL;
		id?: Snowflake;
		error_message: string;
		text: string | BaseCommand;
		image?: string;
		link?: string;
		fields?: EmbedFieldData[];
		accessor?: accessor;
		colour?: colour;
	}
	export interface ErrorEmbedOpts {
		iconURL?: iconURL;
		id?: Snowflake;
		text: string | BaseCommand;
		fields?: EmbedFieldData[];
		image?: string;
		link?: string;
		accessor?: accessor;
		colour?: colour;
	}
	export interface CooldownErrorOpts {
		iconURL?: iconURL;
		id?: Snowflake;
		toUse: string;
		seconds: string | number;
		text: string | BaseCommand;
		fields?: EmbedFieldData[];
		image?: string;
		link?: string;
		accessor?: accessor;
		colour?: colour;
	}
	export interface PermissionsErrorOpts {
		iconURL?: iconURL;
		id?: Snowflake;
		text: string | BaseCommand;
		perms: PermissionResolvable[];
		image?: string;
		link?: string;
		fields?: EmbedFieldData[];
		accessor?: accessor;
		colour?: colour;
	}
	export interface SuccessEmbedOpts {
		iconURL?: iconURL;
		id?: Snowflake;
		success_message: string;
		text: string | BaseCommand;
		fields?: EmbedFieldData[];
		image?: string;
		link?: string;
		accessor?: accessor;
		colour?: colour;
	}
	export interface GetGuildId {
		role?: Role;
		channel?: GuildChannel;
		interaction?: CommandInteraction | Interaction;
		message?: Message;
		emoji?: GuildEmoji;
	}
	export interface GetIconURL {
		interaction?: CommandInteraction;
		guild?: Guild;
		message?: Message;
		guildmember?: GuildMember;
		user?: User;
	}
	interface EventOpts {
		message?: Message;
		interaction?: CommandInteraction;
	}
	export interface HelpEmbedOpts {
		iconURL: iconURL;
		command: BaseCommand;
		accessor: accessor;
	}
	export interface BaseGeneratingOpts {
		iconURL?: string;
		id?: Snowflake;
		provider: string;
		text: string | BaseCommand;
		image?: string;
		link?: string;
		fields?: EmbedFieldData[];
		accessor?: accessor;
		colour?: colour;
	}
	export interface GeneratingEmbedOpts {
		iconURL?: iconURL;
		id?: Snowflake;
		text: string | BaseCommand;
		image?: string;
		link?: string;
		fields?: EmbedFieldData[];
		accessor?: accessor;
		colour?: colour;
	}
	export interface ImageEmbedOpts {
		iconURL?: iconURL;
		title: string;
		description: string;
		image: string;
		text: string | BaseCommand;
		link?: string;
		fields?: EmbedFieldData[];
		accessor?: accessor;
		colour?: colour;
	}
	export interface InsertModerationOpts {
		reason?: string;
		user?: Snowflake;
		modlog?: Snowflake;
		publicmodlog?: Snowflake;
		modlogId?: Snowflake;
		publicmodlogId?: Snowflake;
		moderationDate?: number;
		updatedAt?: number;
		updatedBy?: Snowflake;
	}
	export interface Values {
		id?: Snowflake | null;
		enabled?: boolean | null;
		media?: 'text' | 'image' | null;
		message?: string | null;
	}
}

export = FunctionOpts;
