import { Pool } from 'pg';
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
		constructor() {
			this.Set = this.Set.bind(this);
		}
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
		con: Pool;
		client: DiscordClient;
		cache: Collection<Snowflake, CachedGuild>;
		constructor() {
			this.con = StateManager.con;
			this.client = globalThis.client;
			this.cache = this.client.database;
			this.Translate = this.Translate.bind(this);
			this.Getlang = this.Getlang.bind(this);
			this.Getstring = this.Getstring.bind(this);
			this.Getdescription = this.Getdescription.bind(this);
		}
		async Translate(lang: string, text: string) {}
		async Getlang(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT lang FROM GuildConfigurable WHERE guildId = '${id}'`
						);
						const lang: string = await res.rows[0].lang;

						guild.lang = lang;
					}
					return guild.lang;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT lang FROM GuildConfigurable WHERE guildId = '${id}'`
					);
					const lang: string = await res.rows[0].lang;
					if (cache == true) {
						guild.lang = lang;
					}
					return lang;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		Getstring(lang: string, string: string, ...vars: string[]): string {
			let locale = Languages[lang][string];

			if (vars.length > 0) {
				for (let i in vars) {
					locale = locale.replace(/%VAR%/, i);
				}
			}
			return locale;
		}
		Getdescription(lang: string, string: string): string {
			const locale = Descriptions[lang][string];
			return locale;
		}
	}
	export class Utils {
		con: Pool;
		client: DiscordClient;
		cache: Collection<Snowflake, CachedGuild>;
		Pagination: Funcs.pagination;
		constructor() {
			this.con = StateManager.con;
			this.client = globalThis.client;
			this.cache = this.client.database;
			this.Pagination = pagination;
			this.Duration = this.Duration.bind(this);
			this.Capitalize = this.Capitalize.bind(this);
			this.Paginate = this.Paginate.bind(this);
			this.FormatNumber = this.FormatNumber.bind(this);
			this.FetchCache = this.FetchCache.bind(this);
			this.Mentionrole = this.Mentionrole.bind(this);
			this.Mentionchannel = this.Mentionchannel.bind(this);
			this.Mentionuser = this.Mentionuser.bind(this);
		}
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
		Paginate(
			message: Message,
			opts?: Funcs.PaginateOpts,
			...args: MessageEmbed[]
		): Promise<void> {
			if (!opts.emojiList) opts.emojiList = ['⏪', '⏩'];
			if (!opts.timeout) opts.timeout = 120000;

			if (opts.embeds) {
				if (opts.embeds.length <= 1)
					throw new ReferenceError('Not long enough to paginate!');

				return this.Pagination(
					message,
					opts.embeds,
					opts.emojiList,
					opts.timeout
				);
			}

			if (args.length <= 1)
				throw new ReferenceError('Not enough embeds to paginate');

			return this.Pagination(message, args, opts.emojiList, opts.timeout);
		}
		Capitalize(string: string): string {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		FormatNumber(x: string | number): string {
			if (typeof x != 'number') parseInt(x);
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
		FetchCache(id: Snowflake, toFetch?: Funcs.toFetch) {
			try {
				const guild = this.cache.get(id);
				if (!guild) return null;

				if (toFetch == 'prefix') return guild.prefix;
				if (toFetch == 'lang') return guild.lang;
				if (toFetch == 'channels') return guild.Channels;
				if (toFetch == 'roles') return guild.roles;
				if (toFetch == 'leave') return guild.leave;
				if (toFetch == 'strings') return guild.Strings;
				if (toFetch == 'welcome') return guild.welcome;

				return guild;
			} catch (error) {}
		}
		Mentionrole(id: Snowflake): string {
			return `<@&${id}>`;
		}
		Mentionchannel(id: Snowflake): string {
			return `<#${id}>`;
		}
		Mentionuser(id: Snowflake): string {
			return `<@${id}>`;
		}
	}
	export class Channels {
		con: Pool;
		client: DiscordClient;
		cache: Collection<Snowflake, CachedGuild>;
		constructor() {
			this.con = StateManager.con;
			this.client = globalThis.client;
			this.cache = this.client.database;
			this.Memberlog = this.Memberlog.bind(this);
			this.Modlog = this.Modlog.bind(this);
			this.Rolelog = this.Rolelog.bind(this);
			this.Appeals = this.Appeals.bind(this);
			this.Reports = this.Reports.bind(this);
			this.Actionlog = this.Actionlog.bind(this);
			this.Suggestions = this.Suggestions.bind(this);
			this.Messagelog = this.Messagelog.bind(this);
			this.Serverlog = this.Serverlog.bind(this);
			this.Invitelog = this.Invitelog.bind(this);
			this.Channellog = this.Channellog.bind(this);
			this.Emojilog = this.Emojilog.bind(this);
			this.Publicmodlog = this.Publicmodlog.bind(this);
		}
		async Memberlog(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT memberlog FROM GuildLogging WHERE guildId = '${id}'`
						);
						const memberlog: string = await res.rows[0].memberlog;

						guild.Channels.memberlog = memberlog;
					}
					return guild.Channels.memberlog;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT memberlog FROM GuildLogging WHERE guildId = '${id}'`
					);
					const memberlog: string = await res.rows[0].memberlog;
					if (cache == true) {
						guild.Channels.memberlog = memberlog;
					}
					return memberlog;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Modlog(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT modlog FROM GuildLogging WHERE guildId = '${id}'`
						);
						const modlog: string = await res.rows[0].modlog;

						guild.Channels.modlog = modlog;
					}
					return guild.Channels.modlog;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT modlog FROM GuildLogging WHERE guildId = '${id}'`
					);
					const modlog: string = await res.rows[0].modlog;
					if (cache == true) {
						guild.Channels.modlog = modlog;
					}
					return modlog;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Rolelog(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT rolelog FROM GuildLogging WHERE guildId = '${id}'`
						);
						const rolelog: string = await res.rows[0].rolelog;

						guild.Channels.rolelog = rolelog;
					}
					return guild.Channels.rolelog;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT rolelog FROM GuildLogging WHERE guildId = '${id}'`
					);
					const rolelog: string = await res.rows[0].rolelog;
					if (cache == true) {
						guild.Channels.rolelog = rolelog;
					}
					return rolelog;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Appeals(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT appeals FROM GuildLogging WHERE guildId = '${id}'`
						);
						const appeals: string = await res.rows[0].appeals;

						guild.Channels.appeals = appeals;
					}
					return guild.Channels.appeals;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT appeals FROM GuildLogging WHERE guildId = '${id}'`
					);
					const appeals: string = await res.rows[0].appeals;
					if (cache == true) {
						guild.Channels.appeals = appeals;
					}
					return appeals;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Reports(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT reports FROM GuildLogging WHERE guildId = '${id}'`
						);
						const reports: string = await res.rows[0].reports;

						guild.Channels.reports = reports;
					}
					return guild.Channels.reports;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT reports FROM GuildLogging WHERE guildId = '${id}'`
					);
					const reports: string = await res.rows[0].reports;
					if (cache == true) {
						guild.Channels.reports = reports;
					}
					return reports;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Actionlog(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT actionlog FROM GuildLogging WHERE guildId = '${id}'`
						);
						const actionlog: string = await res.rows[0].actionlog;

						guild.Channels.actionlog = actionlog;
					}
					return guild.Channels.actionlog;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT actionlog FROM GuildLogging WHERE guildId = '${id}'`
					);
					const actionlog: string = await res.rows[0].actionlog;
					if (cache == true) {
						guild.Channels.actionlog = actionlog;
					}
					return actionlog;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Suggestions(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT suggestions FROM GuildLogging WHERE guildId = '${id}'`
						);
						const suggestions: string = await res.rows[0].suggestions;

						guild.Channels.suggestions = suggestions;
					}
					return guild.Channels.suggestions;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT suggestions FROM GuildLogging WHERE guildId = '${id}'`
					);
					const suggestions: string = await res.rows[0].suggestions;
					if (cache == true) {
						guild.Channels.suggestions = suggestions;
					}
					return suggestions;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Messagelog(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT messagelog FROM GuildLogging WHERE guildId = '${id}'`
						);
						const messagelog: string = await res.rows[0].messagelog;

						guild.Channels.messagelog = messagelog;
					}
					return guild.Channels.messagelog;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT messagelog FROM GuildLogging WHERE guildId = '${id}'`
					);
					const messagelog: string = await res.rows[0].messagelog;
					if (cache == true) {
						guild.Channels.messagelog = messagelog;
					}
					return messagelog;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Serverlog(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT serverlog FROM GuildLogging WHERE guildId = '${id}'`
						);
						const serverlog: string = await res.rows[0].serverlog;

						guild.Channels.serverlog = serverlog;
					}
					return guild.Channels.serverlog;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT serverlog FROM GuildLogging WHERE guildId = '${id}'`
					);
					const serverlog: string = await res.rows[0].serverlog;
					if (cache == true) {
						guild.Channels.serverlog = serverlog;
					}
					return serverlog;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Invitelog(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT invitelog FROM GuildLogging WHERE guildId = '${id}'`
						);
						const invitelog: string = await res.rows[0].invitelog;

						guild.Channels.invitelog = invitelog;
					}
					return guild.Channels.invitelog;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT invitelog FROM GuildLogging WHERE guildId = '${id}'`
					);
					const invitelog: string = await res.rows[0].invitelog;
					if (cache == true) {
						guild.Channels.invitelog = invitelog;
					}
					return invitelog;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Channellog(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT channellog FROM GuildLogging WHERE guildId = '${id}'`
						);
						const channellog: string = await res.rows[0].channellog;

						guild.Channels.channellog = channellog;
					}
					return guild.Channels.channellog;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT channellog FROM GuildLogging WHERE guildId = '${id}'`
					);
					const channellog: string = await res.rows[0].channellog;
					if (cache == true) {
						guild.Channels.channellog = channellog;
					}
					return channellog;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Emojilog(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT emojilog FROM GuildLogging WHERE guildId = '${id}'`
						);
						const emojilog: string = await res.rows[0].emojilog;

						guild.Channels.emojilog = emojilog;
					}
					return guild.Channels.emojilog;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT emojilog FROM GuildLogging WHERE guildId = '${id}'`
					);
					const emojilog: string = await res.rows[0].emojilog;
					if (cache == true) {
						guild.Channels.emojilog = emojilog;
					}
					return emojilog;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Publicmodlog(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT publicmodlog FROM GuildLogging WHERE guildId = '${id}'`
						);
						const publicmodlog: string = await res.rows[0].publicmodlog;

						guild.Channels.publicmodlog = publicmodlog;
					}
					return guild.Channels.publicmodlog;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT publicmodlog FROM GuildLogging WHERE guildId = '${id}'`
					);
					const publicmodlog: string = await res.rows[0].publicmodlog;
					if (cache == true) {
						guild.Channels.publicmodlog = publicmodlog;
					}
					return publicmodlog;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
	}
	export class Settings {
		con: Pool;
		client: DiscordClient;
		cache: Collection<Snowflake, CachedGuild>;
		constructor() {
			this.con = StateManager.con;
			this.client = globalThis.client;
			this.cache = this.client.database;
			this.Prefix = this.Prefix.bind(this);
			this.Adminrole = this.Adminrole.bind(this);
			this.Modrole = this.Modrole.bind(this);
			this.Muterole = this.Muterole.bind(this);
			this.WelcomeSystem = this.WelcomeSystem.bind(this);
			this.LeaveSystem = this.LeaveSystem.bind(this);
		}
		async Prefix(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT prefix FROM GuildConfigurable WHERE guildId = '${id}'`
						);
						const prefix: string = await res.rows[0].prefix;

						guild.prefix = prefix;
					}
					return guild.prefix;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT prefix FROM GuildConfigurable WHERE guildId = '${id}'`
					);
					const prefix: string = await res.rows[0].prefix;
					if (cache == true) {
						guild.prefix = prefix;
					}
					return prefix;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Adminrole(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT adminrole FROM serverroles WHERE guildId = '${id}'`
						);
						const adminrole: string = await res.rows[0].adminrole;

						guild.roles.adminrole = adminrole;
					}
					return guild.roles.adminrole;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT adminrole FROM serverroles WHERE guildId = '${id}'`
					);
					const adminrole: string = await res.rows[0].adminrole;
					if (cache == true) {
						guild.roles.adminrole = adminrole;
					}
					return adminrole;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Modrole(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT modrole FROM serverroles WHERE guildId = '${id}'`
						);
						const modrole: string = await res.rows[0].modrole;

						guild.roles.modrole = modrole;
					}
					return guild.roles.modrole;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT modrole FROM serverroles WHERE guildId = '${id}'`
					);
					const modrole: string = await res.rows[0].modrole;
					if (cache == true) {
						guild.roles.modrole = modrole;
					}
					return modrole;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Warningrole(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT warningrole FROM serverroles WHERE guildId = '${id}'`
						);
						const warningrole: string = await res.rows[0].warningrole;

						guild.roles.warningrole = warningrole;
					}
					return guild.roles.warningrole;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT warningrole FROM serverroles WHERE guildId = '${id}'`
					);
					const warningrole: string = await res.rows[0].warningrole;
					if (cache == true) {
						guild.roles.warningrole = warningrole;
					}
					return warningrole;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Muterole(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT muterole FROM serverroles WHERE guildId = '${id}'`
						);
						const muterole: string = await res.rows[0].muterole;

						guild.roles.muterole = muterole;
					}
					return guild.roles.muterole;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT muterole FROM serverroles WHERE guildId = '${id}'`
					);
					const muterole: string = await res.rows[0].muterole;
					if (cache == true) {
						guild.roles.muterole = muterole;
					}
					return muterole;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async WelcomeSystem(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT * FROM welcomesystem WHERE guildId = '${id}'`
						);

						const index = res.rows[0];

						const obj: Welcome = {
							isEnabled: index.isenabled,
							media: index.media,
							welcomeMessage: index.welcomemessage,
							channelId: index.welcomechannel,
						};

						guild.welcome = obj;
					}
					return guild.welcome;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT * FROM welcomesystem WHERE guildId = '${id}'`
					);

					const index = res.rows[0];

					const obj: Welcome = {
						isEnabled: index.isenabled,
						media: index.media,
						welcomeMessage: index.welcomemessage,
						channelId: index.welcomechannel,
					};
					if (cache == true) {
						guild.welcome = obj;
					}
					return obj;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async LeaveSystem(id: Snowflake, force?: boolean, cache?: boolean) {
			const con = await this.con.connect();
			try {
				if (!force) force = false;
				if (!cache) cache = true;

				const guild = this.cache.get(id);

				if (this.cache.size == 0 || !guild) {
					force = true;
					cache = false;
				}

				if (force == false) {
					if (cache == true) {
						const res = await con.query(
							`SELECT * FROM leavesystem WHERE guildId = '${id}'`
						);

						const index = res.rows[0];

						const obj: Leave = {
							isEnabled: index.isenabled,
							media: index.media,
							leaveMessage: index.leavemessage,
							channelId: index.leavechannel,
						};

						guild.leave = obj;
					}
					return guild.leave;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT * FROM welcomesystem WHERE guildId = '${id}'`
					);

					const index = res.rows[0];

					const obj: Leave = {
						isEnabled: index.isenabled,
						media: index.media,
						leaveMessage: index.leavemessage,
						channelId: index.leavechannel,
					};
					if (cache == true) {
						guild.leave = obj;
					}
					return obj;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
	}
	export class Economy {}
	export class Xp {}
	export class Embed {
		con: Pool;
		client: DiscordClient;
		cache: Collection<Snowflake, CachedGuild>;
		Capitalize: Utils['Capitalize'];
		Set: Colour['Set'];
		constructor() {
			this.con = StateManager.con;
			this.client = globalThis.client;
			this.cache = this.client.database;
			this.Capitalize = new Utils().Capitalize;
			this.Set = new Colour().Set;
			this.Base = this.Base.bind(this);
		}
		Base(opts: Funcs.EmbedOpts) {
			if (!opts.title) opts.title = null;
			if (!opts.fields) opts.fields = null;
			if (!opts.link) opts.link = null;
			if (!opts.image) opts.image = null;

			if (typeof opts.text != 'string')
				opts.text = `${opts.text.getName()} command`;

			const footer = `${this.Capitalize(opts.text)} | ${
				this.client.user.username
			}`;

			const embed = new MessageEmbed()
				.setAuthor(this.client.user.username, opts.iconURL)
				.setTitle(this.Capitalize(opts.text))
				.setDescription(opts.description)
				.setTimestamp()
				.setThumbnail(opts.iconURL)
				.setColor(this.Set())
				.setFooter(footer, opts.iconURL);

			if (opts.fields != null) {
				for (let f of opts.fields) {
					embed.addField(f.name, f.value, f.inline == true ? true : false);
				}
			}

			if (opts.link != null) {
				embed.setAuthor(this.client.user.username, opts.iconURL, opts.link);
				embed.setURL(opts.link);
			}

			if (opts.image != null) embed.setImage(opts.image);

			return embed;
		}
	}
	export class SuccessEmbed {
		con: Pool;
		client: DiscordClient;
		cache: Collection<Snowflake, CachedGuild>;
		Capitalize: Utils['Capitalize'];
		Set: Colour['Set'];
		Getstring: Translator['Getstring'];
		Getlang: Translator['Getlang'];
		Embed: Embed['Base'];
		constructor() {
			this.con = StateManager.con;
			this.client = globalThis.client;
			this.cache = this.client.database;
			this.Capitalize = new Utils().Capitalize;
			this.Set = new Colour().Set;
			this.Getlang = new Translator().Getlang;
			this.Getstring = new Translator().Getstring;
			this.Embed = new Embed().Base;
			this.Base = this.Base.bind(this);
		}
		async Base(opts: Funcs.SuccessEmbedOpts) {
			if (!opts.fields) opts.fields = null;
			if (!opts.image) opts.image = null;
			if (!opts.link) opts.link = null;

			const lang = await this.Getlang(opts.id);

			const embed = this.Embed({
				iconURL: opts.iconURL,
				text: opts.text,
				title: `${Emojis.success_emoji} | ${this.Capitalize(
					this.Getstring(lang, 'success')
				)}`,
				description: `${this.Capitalize(opts.success_message)}`,
				fields: opts.fields,
				image: opts.image,
				link: opts.link,
			});

			return embed;
		}
	}
	export class ErrorEmbed {
		con: Pool;
		client: DiscordClient;
		cache: Collection<Snowflake, CachedGuild>;
		Capitalize: Utils['Capitalize'];
		Getlang: Translator['Getlang'];
		Getstring: Translator['Getstring'];
		Set: Colour['Set'];
		Embed: Embed['Base'];
		constructor() {
			this.con = StateManager.con;
			this.client = globalThis.client;
			this.cache = this.client.database;
			this.Capitalize = new Utils().Capitalize;
			this.Getlang = new Translator().Getlang;
			this.Getstring = new Translator().Getstring;
			this.Set = new Colour().Set;
			this.Embed = new Embed().Base;
			this.Base = this.Base.bind(this);
			this.ApiError = this.ApiError.bind(this);
			this.NsfwError = this.NsfwError.bind(this);
			this.CooldownError = this.CooldownError.bind(this);
			this.UnexpectedError = this.UnexpectedError.bind(this);
			this.InvalidChoice = this.InvalidChoice.bind(this);
			this.NoResult = this.NoResult.bind(this);
			this.ClientPermissions = this.ClientPermissions.bind(this);
			this.UserPermissions = this.UserPermissions.bind(this);
		}
		async Base(opts: Funcs.BaseErrorOpts) {
			if (!opts.fields) opts.fields = null;
			if (!opts.image) opts.image = null;
			if (!opts.link) opts.link = null;

			const lang = await this.Getlang(opts.id);

			const embed = this.Embed({
				iconURL: opts.iconURL,
				text: opts.text,
				title: `${Emojis.error_emoji} | ${this.Capitalize(
					this.Getstring(lang, 'error_message')
				)}`,
				description: `\`\`\`Error details: ${this.Capitalize(
					opts.error_message
				)}\`\`\``,
				image: opts.image,
				fields: opts.fields,
				link: opts.link,
			});
			return embed;
		}
		async ApiError(opts: Funcs.ErrorEmbedOpts) {
			return await this.Base({
				iconURL: opts.iconURL,
				text: opts.text,
				id: opts.id,
				error_message: 'API error',
				fields: opts.fields,
				image: opts.image,
				link: opts.link,
			});
		}
		async NsfwError(opts: Funcs.ErrorEmbedOpts) {
			return await this.Base({
				iconURL: opts.iconURL,
				text: opts.text,
				id: opts.id,
				error_message: 'NSFW error',
				fields: opts.fields,
				image: opts.image,
				link: opts.link,
			});
		}
		async CooldownError(opts: Funcs.CooldownErrorOpts) {
			const lang = await this.Getlang(opts.id);

			const second = `${opts.seconds} ${this.Getstring(lang, 'seconds')}`;
			const description = `${this.Capitalize(
				this.Getstring(lang, 'cooldown_message', second, opts.toUse)
			)}`;

			return await this.Base({
				iconURL: opts.iconURL,
				id: opts.id,
				text: opts.text,
				error_message: description,
				fields: opts.fields,
				link: opts.link,
				image: opts.image,
			});
		}
		async UnexpectedError(opts: Funcs.ErrorEmbedOpts) {
			const lang = await this.Getlang(opts.id);

			const description = this.Getstring(lang, 'unexpected_error');

			return await this.Base({
				iconURL: opts.iconURL,
				text: opts.text,
				id: opts.id,
				error_message: description,
				fields: opts.fields,
				image: opts.image,
				link: opts.link,
			});
		}
		async InvalidChoice(opts: Funcs.ErrorEmbedOpts) {
			return await this.Base({
				iconURL: opts.iconURL,
				id: opts.id,
				text: opts.text,
				error_message: 'Invalid choice',
				fields: opts.fields,
				image: opts.image,
				link: opts.link,
			});
		}
		async NoResult(opts: Funcs.ErrorEmbedOpts) {
			return await this.Base({
				iconURL: opts.iconURL,
				id: opts.id,
				text: opts.text,
				error_message: 'No result(s) found',
				fields: opts.fields,
				link: opts.link,
				image: opts.image,
			});
		}
		async ClientPermissions(opts: Funcs.ErrorEmbedOpts) {
			return await this.Base({
				iconURL: opts.iconURL,
				id: opts.id,
				text: opts.text,
				error_message: 'I am missing the required permissions for this command',
				fields: opts.fields,
				link: opts.link,
				image: opts.image,
			});
		}
		async UserPermissions(opts: Funcs.ErrorEmbedOpts) {
			return await this.Base({
				iconURL: opts.iconURL,
				id: opts.id,
				text: opts.text,
				error_message:
					'You are missing the required permissions for this command',
				fields: opts.fields,
				link: opts.link,
				image: opts.image,
			});
		}
	}
	export class HelpEmbed {
		con: Pool;
		client: DiscordClient;
		cache: Collection<Snowflake, CachedGuild>;
		Getlang: Translator['Getlang'];
		Getstring: Translator['Getstring'];
		Translate: Translator['Translate'];
		Set: Colour['Set'];
		Paginate: Utils['Paginate'];
		Capitalize: Utils['Capitalize'];
		Prefix: Settings['Prefix'];
		Embed: Embed['Base'];
		constructor() {
			this.con = StateManager.con;
			this.client = globalThis.client;
			this.cache = this.client.database;
			this.Getlang = new Translator().Getlang;
			this.Getstring = new Translator().Getstring;
			this.Translate = new Translator().Translate;
			this.Set = new Colour().Set;
			this.Paginate = new Utils().Paginate;
			this.Capitalize = new Utils().Capitalize;
			this.Prefix = new Settings().Prefix;
			this.Embed = new Embed().Base;
			this.Base = this.Base.bind(this);
		}
		async Base(opts: Funcs.HelpEmbedOpts) {
			const { message, iconURL, command } = opts;

			const lang = await this.Getlang(message.guild.id);
			const prefix = await this.Prefix(message.guild.id);

			const strings = {
				titles: {
					status: this.Getstring(lang, 'status'),
					working: this.Getstring(lang, 'working'),
					name: this.Getstring(lang, 'name'),
					category: this.Getstring(lang, 'category'),
					aliases: this.Getstring(lang, 'aliases'),
					usage: this.Getstring(lang, 'usage'),
					description: this.Getstring(lang, 'description'),
					accessible_by: this.Getstring(lang, 'accessible_by'),
					permissions: this.Getstring(lang, 'permissions'),
					subCommands: this.Getstring(lang, 'sub_commands'),
					example: this.Getstring(lang, 'example'),
					guild_only: this.Getstring(lang, 'guildonly'),
					owner_only: this.Getstring(lang, 'owner_only'),
					cooldown: this.Getstring(lang, 'cooldown'),
					user_permissions: this.Getstring(lang, 'user_permissions'),
				},
				values: {
					yes: this.Getstring(lang, 'yes'),
					no: this.Getstring(lang, 'no'),
					none: this.Getstring(lang, 'none'),
					is_required: this.Getstring(lang, 'is_required'),
					is_optional: this.Getstring(lang, 'is_optional'),
					seconds: this.Getstring(lang, 'seconds'),
				},
			};

			let alias: string;
			let botperms: string;
			let userperms: string;
			let subcommands: string;
			let examples: string;

			if (command.getAliases().length == 0) {
				alias = `\`${this.Capitalize(strings.values.none)}\``;
			} else {
				alias = command
					.getAliases()
					.map((e) => `\`${e}\``)
					.join(', ');
			}

			if (command.getBotpermissions().length == 0) {
				botperms = `\`${this.Capitalize(strings.values.none)}\``;
			} else {
				botperms = command
					.getBotpermissions()
					.map((e) => `\`${e}\``)
					.join(', ');
			}

			if (command.getUserpermissions().length == 0) {
				userperms = `\`${this.Capitalize(strings.values.none)}\``;
			} else {
				userperms = command
					.getUserpermissions()
					.map((e) => `\`${e}\``)
					.join(', ');
			}

			if (command.getExamples().length == 0) {
				examples = `\`${this.Capitalize(strings.values.none)}\``;
			} else {
				examples = command
					.getExamples()
					.map((e) => `\`${e}\``)
					.join(', ');
			}

			if (command.getSubcommands().length == 0) {
				subcommands = `\`${this.Capitalize(strings.values.none)}\``;
			} else {
				subcommands = command
					.getSubcommands()
					.map((e) => `\`${e}\``)
					.join(', ');
			}

			const title = `${this.Capitalize(command.getName())} help | ${
				strings.titles.status
			}: ${
				command.getStatus() == 'working'
					? `${this.Capitalize(strings.titles.working)}`
					: command.getStatus()
			}`;

			const description = `\`<>\` ${strings.values.is_required} | \`()\` ${strings.values.is_optional}`;

			const embed = this.Embed({
				iconURL: iconURL,
				title: title,
				description: description,
				text: 'Help command',
				fields: [
					{
						name: this.Capitalize(strings.titles.name),
						value: `\`${command.getName()}\``,
					},
					{
						name: this.Capitalize(strings.titles.category),
						value: `\`${command.getCategory()}\``,
					},
					{
						name: this.Capitalize(strings.titles.cooldown),
						value: `\`${Math.floor(
							(command.getCooldown() / 1000) % 60
						).toString()}\` ${strings.values.seconds}`,
					},
					{ name: this.Capitalize(strings.titles.aliases), value: alias },
				],
			});
			const embed2 = this.Embed({
				iconURL: iconURL,
				title: title,
				description: description,
				text: 'Help command',
				fields: [
					{
						name: this.Capitalize(strings.titles.accessible_by),
						value: `\`${command.getAccessible()}\``,
					},
					{
						name: this.Capitalize(strings.titles.description),
						value: `\`${command.getDescription()}\``,
					},
					{ name: 'Usage', value: `\`${command.getUsage()}\`` },
				],
			});
			const embed3 = this.Embed({
				iconURL: iconURL,
				title: title,
				description: description,
				text: 'Help commmand',
				fields: [
					{
						name: `${this.Capitalize(strings.titles.guild_only)}?`,
						value: `${
							command.getGuildonly() == true
								? this.Capitalize(strings.values.yes)
								: this.Capitalize(strings.values.no)
						}`,
					},
					{
						name: `NSFW?`,
						value: `${
							command.getNsfw() == true
								? this.Capitalize(strings.values.yes)
								: this.Capitalize(strings.values.no)
						}`,
					},
					{
						name: `${this.Capitalize(strings.titles.owner_only)}?`,
						value: `\`${
							command.getOwneronly() == true
								? this.Capitalize(strings.values.yes)
								: this.Capitalize(strings.values.no)
						}\``,
					},
				],
			});
			const embed4 = this.Embed({
				iconURL: iconURL,
				title: title,
				description: description,
				text: 'Help command',
				fields: [
					{
						name: this.Capitalize(strings.titles.permissions),
						value: botperms,
					},
					{
						name: this.Capitalize(strings.titles.user_permissions),
						value: userperms,
					},
					{
						name: this.Capitalize(strings.titles.subCommands),
						value: subcommands,
					},
				],
			});

			return this.Paginate(message, {}, embed, embed2, embed3, embed4);
		}
	}
	export class GeneratingEmbed {
		con: Pool;
		client: DiscordClient;
		cache: Collection<Snowflake, CachedGuild>;
		Embed: Embed['Base'];
		Capitalize: Utils['Capitalize'];
		Set: Colour['Set'];
		Getstring: Translator['Getstring'];
		Getlang: Translator['Getlang'];
		constructor() {
			this.con = StateManager.con;
			this.client = globalThis.client;
			this.cache = this.client.database;
			this.Embed = new Embed().Base;
			this.Capitalize = new Utils().Capitalize;
			this.Set = new Colour().Set;
			this.Getstring = new Translator().Getstring;
			this.Getlang = new Translator().Getlang;
			this.Base = this.Base.bind(this);
			this.DogCeoApi = this.DogCeoApi.bind(this);
			this.NekosLife = this.NekosLife.bind(this);
			this.NekosBot = this.NekosBot.bind(this);
			this.DiscordIG = this.DiscordIG.bind(this);
			this.Duncte123 = this.Duncte123.bind(this);
			this.SomeRandomApi = this.SomeRandomApi.bind(this);
			this.NekosFun = this.NekosFun.bind(this);
		}
		async Base(opts: Funcs.BaseGeneratingOpts) {
			if (!opts.image) opts.image = null;
			if (!opts.fields) opts.fields = null;
			if (!opts.link) opts.link = null;

			const lang = await this.Getlang(opts.id);

			const title: string = `${this.Capitalize(
				this.Getstring(lang, 'generating')
			)}...`;
			const description: string = `${this.Capitalize(
				this.Getstring(lang, 'provided_by')
			)}: \`${opts.provider}\``;

			return this.Embed({
				iconURL: opts.iconURL,
				text: opts.text,
				title: title,
				description: description,
				fields: opts.fields,
				link: opts.link,
				image: opts.image,
			});
		}
		async DogCeoApi(opts: Funcs.GeneratingEmbedOpts) {
			return await this.Base({
				iconURL: opts.iconURL,
				text: opts.text,
				id: opts.id,
				provider: `Dog CEO API`,
				fields: opts.fields,
				image: opts.image,
				link: opts.link,
			});
		}
		async NekosLife(opts: Funcs.GeneratingEmbedOpts) {
			return await this.Base({
				iconURL: opts.iconURL,
				text: opts.text,
				id: opts.id,
				provider: `Nekos Life API`,
				fields: opts.fields,
				image: opts.image,
				link: opts.link,
			});
		}
		async NekosBot(opts: Funcs.GeneratingEmbedOpts) {
			return await this.Base({
				iconURL: opts.iconURL,
				text: opts.text,
				id: opts.id,
				provider: `NekoBot API`,
				fields: opts.fields,
				image: opts.image,
				link: opts.link,
			});
		}
		async DiscordIG(opts: Funcs.GeneratingEmbedOpts) {
			return await this.Base({
				iconURL: opts.iconURL,
				text: opts.text,
				id: opts.id,
				provider: `Discord-image-generation`,
				fields: opts.fields,
				image: opts.image,
				link: opts.link,
			});
		}
		async Duncte123(opts: Funcs.GeneratingEmbedOpts) {
			return await this.Base({
				iconURL: opts.iconURL,
				text: opts.text,
				id: opts.id,
				provider: `Duncte123 API`,
				fields: opts.fields,
				image: opts.image,
				link: opts.link,
			});
		}
		async NekosFun(opts: Funcs.GeneratingEmbedOpts) {
			return await this.Base({
				iconURL: opts.iconURL,
				text: opts.text,
				id: opts.id,
				provider: `Nekos Fun API`,
				fields: opts.fields,
				image: opts.image,
				link: opts.link,
			});
		}
		async SomeRandomApi(opts: Funcs.GeneratingEmbedOpts) {
			return await this.Base({
				iconURL: opts.iconURL,
				text: opts.text,
				id: opts.id,
				provider: `Some Random API`,
				fields: opts.fields,
				image: opts.image,
				link: opts.link,
			});
		}
	}
	export class ImageEmbed {
		con: Pool;
		client: DiscordClient;
		cache: Collection<Snowflake, CachedGuild>;
		Embed: Embed['Base'];
		Capitalize: Utils['Capitalize'];
		Set: Colour['Set'];
		constructor() {
			this.con = StateManager.con;
			this.client = globalThis.client;
			this.cache = this.client.database;
			this.Embed = new Embed().Base;
			this.Capitalize = new Utils().Capitalize;
			this.Set = new Colour().Set;
			this.Base = this.Base.bind(this);
		}
		async Base(opts: Funcs.ImageEmbedOpts) {
			if (!opts.fields) opts.fields = null;
			if (!opts.link) opts.link = null;

			return await this.Embed({
				iconURL: opts.iconURL,
				text: opts.text,
				title: opts.title,
				description: opts.description,
				image: opts.image,
				fields: opts.fields,
				link: opts.link,
			});
		}
	}
	export class Moderation {
		con: Pool;
		client: DiscordClient;
		cache: Collection<Snowflake, CachedGuild>;
		constructor() {
			this.con = StateManager.con;
			this.client = globalThis.client;
			this.cache = this.client.database;
		}
	}
}

export = Functions;
