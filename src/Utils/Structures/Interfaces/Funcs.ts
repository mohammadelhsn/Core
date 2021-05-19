import { Snowflake, MessageEmbed, Message, EmbedFieldData } from 'discord.js';
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
	}
	export type toFetch =
		| 'prefix'
		| 'lang'
		| 'channels'
		| 'roles'
		| 'strings'
		| 'welcome'
		| 'leave';
	export interface EmbedOpts {
		iconURL: string;
		description: string;
		text: string | BaseCommand;
		title?: string;
		fields?: EmbedFieldData[];
		link?: string;
		image?: string;
	}
	export interface BaseErrorOpts {
		iconURL: string;
		id: Snowflake;
		error_message: string;
		text: string | BaseCommand;
		image?: string;
		link?: string;
		fields?: EmbedFieldData[];
	}
	export interface ErrorEmbedOpts {
		iconURL: string;
		id: Snowflake;
		text: string | BaseCommand;
		fields?: EmbedFieldData[];
		image?: string;
		link?: string;
	}
	export interface CooldownErrorOpts {
		iconURL: string;
		id: Snowflake;
		toUse: string;
		seconds: string | number;
		text: string | BaseCommand;
		fields?: EmbedFieldData[];
		image?: string;
		link?: string;
	}
	export interface SuccessEmbedOpts {
		iconURL: string;
		id: Snowflake;
		success_message: string;
		text: string | BaseCommand;
		fields?: EmbedFieldData[];
		image?: string;
		link?: string;
	}
	export interface HelpEmbedOpts {
		iconURL: string;
		command: BaseCommand;
		message: Message;
	}
	export interface BaseGeneratingOpts {
		iconURL: string;
		id: Snowflake;
		provider: string;
		text: string | BaseCommand;
		image?: string;
		link?: string;
		fields?: EmbedFieldData[];
	}
	export interface GeneratingEmbedOpts {
		iconURL: string;
		id: Snowflake;
		text: string | BaseCommand;
		image?: string;
		link?: string;
		fields?: EmbedFieldData[];
	}
	export interface ImageEmbedOpts {
		iconURL: string;
		title: string;
		description: string;
		image: string;
		text: string | BaseCommand;
		link?: string;
		fields?: EmbedFieldData[];
	}
	export interface InsertModerationOpts {
		reason?: string;
		user?: Snowflake;
		modlog?: Snowflake;
		publicmodlog?: Snowflake;
		modlogId?: Snowflake;
		publicmodlogId?: Snowflake;
		moderationDate?: Date;
		updatedAt?: Date;
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
