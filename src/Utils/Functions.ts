import { PoolClient } from 'pg';
import DiscordClient from '../Client/Client';
import StateManager from './StateManager';
import Funcs from './Structures/Interfaces/Funcs';
import {
	Client,
	Snowflake,
	Message,
	MessageEmbed,
	Collection,
} from 'discord.js';
import pagination from 'discord.js-pagination';
import CachedGuild from './Structures/CachedGuild';
import Colours from '../../Colours.json';
import Languages from '../../Languages.json';
import Descriptions from '../../Descriptions.json';
import { Leave, Welcome } from './Structures/Interfaces/CachedGuild';
import Emojis from '../../Emojis.json';

namespace Functions {
	export class Colour {
		constructor() {}
		Set(colour?: keyof Funcs.colours, options?: Funcs.ColourOpts): string {
			if (!colour) colour = 'random';
			const colours = [
				Colours.red_dark,
				Colours.red,
				Colours.red_light,
				Colours.orange_dark,
				Colours.orange,
				Colours.green_dark,
				Colours.green,
				Colours.green_light,
				Colours.blue_dark,
				Colours.blue,
				Colours.blue_light,
				Colours.purple_dark,
				Colours.purple,
				Colours.purple_light,
				Colours.pink_dark,
				Colours.pink,
				Colours.pink_light,
				Colours.yellow,
				Colours.cyan,
				Colours.cream,
				Colours.khaki,
				Colours.white,
				Colours.gold,
			];

			let shade = null;
			if (options) {
				shade = options.shade ? options.shade : null;
			}

			if (colour != 'random' && shade != null) {
				const color = Colours[`${colour}_${shade}`];
				if (color == undefined)
					throw new ReferenceError(
						"I couldn't find this shade for this specific colour"
					);
				return color;
			}
			if (colour == 'random') {
				const ranNum = Math.floor(Math.random() * colours.length);
				const colour = colours[ranNum];
				return colour;
			}
			if (colour && shade == null) {
				const color = Colours[colour];
				if (color == undefined)
					throw new ReferenceError('I could not find this colour!');
				return color;
			}
		}
	}
	export class Translator {
		constructor() {}
		// can copy some the rest from the old since there's no DB involved
		async Getlang() {}
	}
	export class Utils {
		constructor() {}
		Duration(ms: number): string {
			const sec = Math.floor((ms / 1000) % 60).toString();
			const min = Math.floor((ms / (1000 * 60)) % 60).toString();
			const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
			const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
			return `${days.padStart(1, '0')} days, ${hrs.padStart(
				2,
				'0'
			)} hours, ${min.padStart(2, '0')} minutes and ${sec.padStart(
				2,
				'0'
			)} seconds`;
		}
		Capitalize(string: string): string {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
	}
	export class Channels {
		connection: PoolClient;
		client: DiscordClient;
		//        cache: Collection<Snowflake, CachedGuild>
	}
	export class Settings {}
	export class Economy {}
	export class Xp {}
	export class ErrorEmbed {}
	export class SuccessEmbed {}
	export class Embed {}
	export class HelpEmbed {}
	export class GeneratingEmbed {}
	export class ImageEmbed {}
	export class Moderation {}
}

export = Functions;
