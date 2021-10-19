import { Pool } from 'pg';
import DiscordClient from '../Client/Client';
import StateManager from './StateManager';
import Funcs from './Structures/Interfaces/Funcs';
import {
	Snowflake,
	Message,
	MessageEmbed,
	Collection,
	MessageReaction,
	HexColorString,
	AwaitMessagesOptions,
	Permissions,
	PermissionResolvable,
	ReactionCollectorOptions,
	PresenceStatus,
	UserFlags,
	Channel,
	GuildChannel,
	ThreadChannel,
	TextBasedChannels,
	PermissionString,
	CommandInteraction,
	InteractionCollector,
	GuildMember,
	Guild,
	User,
	GuildEmoji,
	Role,
} from 'discord.js';
import CachedGuild from './Structures/CachedGuild';
import Colours from '../../Colours.json';
import Languages from '../../Languages.json';
import Descriptions from '../../Descriptions.json';
import CachedGuildTypes from './Structures/Interfaces/CachedGuild';
import Emojis from '../../Emojis.json';
import Schemas from './Schemas';
import moment from 'moment';
import { ChannelTypes } from 'discord.js/typings/enums';
import {
	APIInteractionDataResolvedChannel,
	ChannelType,
} from 'discord-api-types';
import { roleMention } from '@discordjs/builders';

namespace Functions {
	export class Colour {
		constructor() {
			this.Set = this.Set.bind(this);
		}
		Set(
			colour?: keyof Funcs.colours,
			options?: Funcs.ColourOpts
		): HexColorString {
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
				// @ts-ignore
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
							`SELECT lang FROM Guilds WHERE guildId = '${id}'`
						);
						const lang: string = await res.rows[0].lang;

						guild.lang = lang;
					}
					return guild.lang;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT lang FROM Guilds WHERE guildId = '${id}'`
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
		Emojis = Emojis;
		constructor() {
			this.con = StateManager.con;
			this.client = globalThis.client;
			this.cache = this.client.database;
			this.Pagination = this.Pagination.bind(this);
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
		async Pagination(
			pages: MessageEmbed[],
			emojiList = ['⏪', '⏩'],
			timeout = 120000,
			opts: Funcs.PaginationOpts
		) {
			// THIS IS NOT MY FUNCTION BUT I'VE UPDATED THE CODE BECAUSE IT BROKE IN DJS V13
			// IF THE ORIGINAL OWNER WOULD LIKE ME TO REMOVE THIS I CAN Contact me here: ProcessVersion#4472
			console.log(opts);
			if (!opts) throw new Error('At least one choice must be present!');
			if (opts.message == null && opts.interaction == null)
				throw new Error('Channel is inaccessible.');
			if (!pages) throw new Error('Pages are not given.');
			if (emojiList.length !== 2) throw new Error('Need two emojis.');
			let page = 0;
			const curPage =
				opts.message == null
					? await opts.interaction.channel.send({
							embeds: [
								pages[page].setFooter(`Page ${page + 1} / ${pages.length}`),
							],
					  })
					: await opts.message.channel.send({
							embeds: [
								pages[page].setFooter(`Page ${page + 1} / ${pages.length}`),
							],
					  });

			for (const emoji of emojiList) await curPage.react(emoji);

			const options = {
				filter: (reaction, user) =>
					emojiList.includes(reaction.emoji.name) && !user.bot,

				time: timeout,
			};

			const reactionCollector = curPage.createReactionCollector(options);

			reactionCollector.on('collect', (reaction, user) => {
				reaction.users.remove(
					opts.message == null
						? opts.interaction.user.id
						: opts.message.author.id
				);

				switch (reaction.emoji.name) {
					case emojiList[0]:
						page = page > 0 ? --page : pages.length - 1;
						break;
					case emojiList[1]:
						page = page + 1 < pages.length ? ++page : 0;
						break;
					default:
						break;
				}

				curPage.edit({
					embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
				});
			});

			reactionCollector.on('end', (_, reason) => {
				if (!curPage.deleted) {
					curPage.reactions.removeAll();
				}
			});
			return curPage;
		}
		Paginate(opts?: Funcs.PaginateOpts, ...args: MessageEmbed[]) {
			console.log(opts.message);

			if (opts.interaction == null && opts.message == null)
				throw new Error('Message or Interaction must be passed in!');
			if (!opts.emojiList) opts.emojiList = ['⏪', '⏩'];
			if (!opts.timeout) opts.timeout = 120000;

			if (opts.embeds) {
				if (opts.embeds.length <= 1)
					throw new ReferenceError('Not long enough to paginate!');

				if (opts.message)
					return this.Pagination(opts.embeds, opts.emojiList, opts.timeout, {
						message: opts.message,
					});
				return this.Pagination(opts.embeds, opts.emojiList, opts.timeout, {
					interaction: opts.interaction,
				});
			}

			if (args.length <= 1)
				throw new ReferenceError('Not enough embeds to paginate');

			if (opts.message) {
				this.Pagination(opts.embeds, opts.emojiList, opts.timeout, {
					message: opts.message,
				});
				return;
			}
			return this.Pagination(opts.embeds, opts.emojiList, opts.timeout, {
				interaction: opts.interaction,
			});
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
		Delete(message: Message, timeout?: number) {
			if (!message) throw new Error('Missing message object');
			if (!timeout) timeout = 10000;

			setTimeout(function () {
				message.delete().catch((err) => console.log(err));
			}, timeout);
		}
		ResolvePermission(...permissions: PermissionString[]): bigint[] {
			const newPermissions: bigint[] = [];

			for (const perm of permissions) {
				const permission = Permissions.FLAGS[perm];
				newPermissions.push(permission);
			}

			return newPermissions;
		}
		StatusEmoji(status: PresenceStatus) {
			if (status == 'dnd') return this.Emojis.dnd_emoji;
			if (status == 'idle') return this.Emojis.idle_emoji;
			if (status == 'online') return this.Emojis.online_emoji;
			return this.Emojis.offline_emoji;
		}
		StatusText(status: PresenceStatus) {
			if (status == 'dnd') return 'DND';
			if (status == 'idle') return 'Idle';
			if (status == 'online') return 'Online';
			return 'Offline / Invisible';
		}
		ToCodeBlock(string: string) {
			return `\`${string}\``;
		}
		GetFlags(uFlags: Readonly<UserFlags> | UserFlags) {
			const userflag = {
				DISCORD_EMPLOYEE: this.Emojis.discord_staff,
				DISCORD_PARTNER: this.Emojis.discord_partner,
				BUGHUNTER_LEVEL_1: this.Emojis.bug_hunter,
				BUGHUNTER_LEVEL_2: this.Emojis.bug_hunter_2,
				HYPESQUAD_EVENTS: this.Emojis.hypesquad_events,
				HOUSE_BRAVERY: this.Emojis.hypesquad_bravery,
				HOUSE_BRILLIANCE: this.Emojis.hypesquad_brilliance,
				HOUSE_BALANCE: this.Emojis.hypesquad_balance,
				EARLY_SUPPORTER: this.Emojis.earlysupporter,
				TEAM_USER: 'Team User',
				SYSTEM: this.Emojis.system,
				VERIFIED_BOT: this.Emojis.bot_emoji,
				VERIFIED_DEVELOPER: this.Emojis.discord_bot_dev,
			};

			if (uFlags !== null) {
				const flags = new UserFlags(uFlags);
				const flag = flags.toArray();
				return `${
					flag.length > 0 ? flag.map((f) => userflag[f]).join(' ') : 'N/A'
				}`;
			}
		}
		ChannelType(
			channel:
				| Channel
				| GuildChannel
				| APIInteractionDataResolvedChannel
				| ThreadChannel
				| TextBasedChannels
		) {
			if (channel.type == 'DM') return 'DM';
			if (channel.type == 'GROUP_DM') return 'Group DM';
			if (channel.type == 'GUILD_CATEGORY') return 'Category';
			if (channel.type == 'GUILD_NEWS') return 'News';
			if (channel.type == 'GUILD_NEWS_THREAD') return 'News thread';
			if (channel.type == 'GUILD_PRIVATE_THREAD') return 'Private thread';
			if (channel.type == 'GUILD_PUBLIC_THREAD') return 'Public thread';
			if (channel.type == 'GUILD_STAGE_VOICE') return 'Stage channel';
			if (channel.type == 'GUILD_STORE') return 'Store channel';
			if (channel.type == 'GUILD_TEXT') return 'Text';
			if (channel.type == 'GUILD_VOICE') return 'Voice';
			return 'Unknown';
		}
		GetGuildId(
			toGrab:
				| Message
				| GuildEmoji
				| CommandInteraction
				| Role
				| GuildChannel
				| Guild
		) {
			if (toGrab instanceof Guild) return toGrab.id;
			return toGrab.guild.id;
		}
		GetIcon(
			toGrab: GuildMember | Guild | CommandInteraction | Message | User,
			type?: 'guild' | 'user',
			dynamic?: boolean
		) {
			if (!dynamic) dynamic = true;
			if (toGrab instanceof Guild) return toGrab.iconURL({ dynamic: dynamic });
			if (toGrab instanceof User)
				return toGrab.displayAvatarURL({ dynamic: dynamic });
			if (!type) type = 'user';
			if (toGrab instanceof GuildMember && type == 'guild')
				return toGrab.guild.iconURL({ dynamic: dynamic });
			else if (toGrab instanceof GuildMember)
				return toGrab.user.displayAvatarURL({ dynamic: dynamic });
			if (toGrab instanceof Message && type == 'guild')
				return toGrab.guild.iconURL({ dynamic: dynamic });
			else if (toGrab instanceof Message)
				return toGrab.author.displayAvatarURL({ dynamic: dynamic });
			if (toGrab instanceof CommandInteraction && type == 'guild')
				return toGrab.guild.iconURL({ dynamic: dynamic });
			else return toGrab.user.displayAvatarURL({ dynamic: dynamic });
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
			this.Modlog = this.Modlog.bind(this);
			this.Appeals = this.Appeals.bind(this);
			this.Reports = this.Reports.bind(this);
			this.Actionlog = this.Actionlog.bind(this);
			this.Suggestions = this.Suggestions.bind(this);
			this.Publicmodlog = this.Publicmodlog.bind(this);
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
							`SELECT logging FROM Guilds WHERE guildId = '${id}'`
						);
						const modlog: string = await new Schemas.Logging(
							res.rows[0].logging
						).data.modlog;

						guild.Channels.modlog = modlog;
					}
					return guild.Channels.modlog;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT logging FROM Guilds WHERE guildId = '${id}'`
					);
					const modlog: string = await new Schemas.Logging(res.rows[0].logging)
						.data.modlog;

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
							`SELECT logging FROM Guilds WHERE guildId = '${id}'`
						);
						const appeals: string = await new Schemas.Logging(
							res.rows[0].logging
						).data.appeals;

						guild.Channels.appeals = appeals;
					}
					return guild.Channels.appeals;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT logging FROM Guilds WHERE guildId = '${id}'`
					);
					const appeals: string = await new Schemas.Logging(res.rows[0].logging)
						.data.appeals;
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
							`SELECT logging FROM Guilds WHERE guildId = '${id}'`
						);
						const reports: string = await new Schemas.Logging(
							res.rows[0].logging
						).data.reports;

						guild.Channels.reports = reports;
					}
					return guild.Channels.reports;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT logging FROM Guilds WHERE guildId = '${id}'`
					);
					const reports: string = await new Schemas.Logging(res.rows[0].logging)
						.data.reports;
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
							`SELECT logging FROM Guilds WHERE guildId = '${id}'`
						);
						const actionlog: string = await new Schemas.Logging(
							res.rows[0].logging
						).data.actionlog;

						guild.Channels.actionlog = actionlog;
					}
					return guild.Channels.actionlog;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT logging FROM Guilds WHERE guildId = '${id}'`
					);
					const actionlog: string = await new Schemas.Logging(
						res.rows[0].logging
					).data.actionlog;
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
							`SELECT logging FROM Guilds WHERE guildId = '${id}'`
						);
						const suggestions: string = await new Schemas.Logging(
							res.rows[0].logging
						).data.suggestions;

						guild.Channels.suggestions = suggestions;
					}
					return guild.Channels.suggestions;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT logging FROM Guilds WHERE guildId = '${id}'`
					);
					const suggestions: string = await new Schemas.Logging(
						res.rows[0].logging
					).data.suggestions;
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
							`SELECT logging FROM Guilds WHERE guildId = '${id}'`
						);
						const publicmodlog: string = await new Schemas.Logging(
							res.rows[0].logging
						).data.publicmodlog;

						guild.Channels.publicmodlog = publicmodlog;
					}
					return guild.Channels.publicmodlog;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT logging FROM Guilds WHERE guildId = '${id}'`
					);
					const publicmodlog: string = await new Schemas.Logging(
						res.rows[0].logging
					).data.publicmodlog;
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
							`SELECT prefix FROM Guilds WHERE guildId = '${id}'`
						);
						const prefix: string = await res.rows[0].prefix;

						guild.prefix = prefix;
					}
					return guild.prefix;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT prefix FROM Guilds WHERE guildId = '${id}'`
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
							`SELECT roles FROM Guilds WHERE guildId = '${id}'`
						);
						const adminrole: string = await new Schemas.Roles(res.rows[0].roles)
							.data.adminrole;

						guild.roles.adminrole = adminrole;
					}
					return guild.roles.adminrole;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT roles FROM Guilds WHERE guildId = '${id}'`
					);
					const adminrole: string = await new Schemas.Roles(res.rows[0].roles)
						.data.adminrole;
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
							`SELECT roles FROM Guilds WHERE guildId = '${id}'`
						);

						const modrole: string = await new Schemas.Roles(res.rows[0].roles)
							.data.modrole;

						guild.roles.modrole = modrole;
					}
					return guild.roles.modrole;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT roles FROM Guilds WHERE guildId = '${id}'`
					);
					const modrole: string = await new Schemas.Roles(res.rows[0].roles)
						.data.modrole;
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
							`SELECT roles FROM Guilds WHERE guildId = '${id}'`
						);
						const warningrole: string = await new Schemas.Roles(
							res.rows[0].roles
						).data.warningrole;

						guild.roles.warningrole = warningrole;
					}
					return guild.roles.warningrole;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT roles FROM Guilds WHERE guildId = '${id}'`
					);
					const warningrole: string = await new Schemas.Roles(res.rows[0].roles)
						.data.warningrole;
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
							`SELECT roles FROM Guilds WHERE guildId = '${id}'`
						);
						const muterole: string = await new Schemas.Roles(res.rows[0].roles)
							.data.muterole;

						guild.roles.muterole = muterole;
					}
					return guild.roles.muterole;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT roles FROM Guilds WHERE guildId = '${id}'`
					);
					const muterole: string = await new Schemas.Roles(res.rows[0].roles)
						.data.muterole;
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
							`SELECT welcome from Guilds WHERE guildId = '${id}'`
						);

						const index = await new Schemas.Welcome(res.rows[0].welcome).data;

						const obj: CachedGuildTypes.Welcome = {
							isenabled: index.isenabled,
							media: index.media,
							message: index.message,
							channel: index.channel,
						};

						guild.welcome = obj;
					}
					return guild.welcome;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT welcome FROM Guilds WHERE guildId = '${id}'`
					);

					const index = new Schemas.Welcome(res.rows[0].welcome).data;

					const obj: CachedGuildTypes.Welcome = {
						isenabled: index.isenabled,
						media: index.media,
						message: index.message,
						channel: index.channel,
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
							`SELECT leave FROM Guilds WHERE guildId = '${id}'`
						);

						const index = await new Schemas.Leave(res.rows[0].leave).data;

						const obj: CachedGuildTypes.Leave = {
							isenabled: index.isenabled,
							media: index.media,
							message: index.message,
							channel: index.channel,
						};

						guild.leave = obj;
					}
					return guild.leave;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT leave FROM Guilds WHERE guildId = '${id}'`
					);

					const index = await new Schemas.Leave(res.rows[0].leave).data;

					const obj: CachedGuildTypes.Leave = {
						isenabled: index.isenabled,
						media: index.media,
						message: index.message,
						channel: index.channel,
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
		async Events(id: Snowflake, force?: boolean, cache?: boolean) {
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
							`SELECT events FROM Guilds WHERE guildId = '${id}'`
						);

						const index = await new Schemas.Events(res.rows[0].events).data;

						guild.Events = index;
					}
					return guild.Events;
				}
				if (force == true) {
					const res = await con.query(
						`SELECT events FROM Guilds WHERE guildId = '${id}'`
					);

					const index = await new Schemas.Events(res.rows[0].events).data;

					if (cache == true) {
						guild.Events = index;
					}
					return index;
				}
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async Disabled(id: Snowflake) {
			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT disableditems FROM Guilds WHERE guildid = '${id}'`
				);
				const data =
					res.rows.length > 0
						? new Schemas.Disabled(res.rows[0].disableditems)
						: null;
				return data;
			} finally {
				con.release();
			}
		}
		async Logging(id: Snowflake) {
			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT logging FROM Guilds WHERE guildid = '${id}'`
				);
				const data =
					res.rows.length > 0 ? new Schemas.Logging(res.rows[0].logging) : null;
				return data;
			} finally {
				con.release();
			}
		}
		async Protected(id: Snowflake) {
			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT protected FROM Guilds WHERE guildid = '${id}'`
				);
				const data =
					res.rows.length > 0
						? new Schemas.Protected(res.rows[0].protected)
						: null;
				return data;
			} finally {
				con.release();
			}
		}
		async Tags(id: Snowflake) {
			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT tags FROM Guilds WHERE guildid = '${id}'`
				);
				const data =
					res.rows.length > 0 ? new Schemas.Tags(res.rows[0].tags) : null;
				return data;
			} finally {
				con.release();
			}
		}
		async Ranks(id: Snowflake) {
			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT ranks FROM Guilds WHERE guildid = '${id}'`
				);
				const data =
					res.rows.length > 0 ? new Schemas.Ranks(res.rows[0].ranks) : null;
				return data;
			} finally {
				con.release();
			}
		}
		async Notes(id: Snowflake) {
			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT notes FROM Guilds WHERE guildid = '${id}'`
				);
				const data =
					res.rows.length > 0 ? new Schemas.Notes(res.rows[0].notes) : null;
				return data;
			} finally {
				con.release();
			}
		}
	}
	export class Embed {
		con: Pool;
		client: DiscordClient;
		cache: Collection<Snowflake, CachedGuild>;
		Capitalize: Utils['Capitalize'];
		Set: Colour['Set'];
		GetGuildId: Utils['GetGuildId'];
		GetIcon: Utils['GetIcon'];
		constructor() {
			this.con = StateManager.con;
			this.client = globalThis.client;
			this.cache = this.client.database;
			this.Capitalize = new Utils().Capitalize;
			this.Set = new Colour().Set;
			this.GetGuildId = new Utils().GetGuildId;
			this.GetIcon = new Utils().GetIcon;
			this.Base = this.Base.bind(this);
		}
		Base(opts: Funcs.EmbedOpts) {
			if (!opts.title) opts.title = null;
			if (!opts.fields) opts.fields = null;
			if (!opts.link) opts.link = null;
			if (!opts.image) opts.image = null;
			if (!opts.colour) opts.colour = this.Set();
			if (!opts.iconURL && !opts.accessor) throw new Error('Manual or default');
			if (!opts.iconURL && opts.accessor)
				opts.iconURL = this.GetIcon(opts.accessor);

			if (typeof opts.text != 'string')
				opts.text = `${opts.text.getName()} command`;

			const footer = `${this.Capitalize(opts.text)} | ${
				this.client.user.username
			}`;

			const embed = new MessageEmbed()
				.setAuthor(this.client.user.username, opts.iconURL)
				.setTitle(this.Capitalize(opts.title == null ? opts.text : opts.title))
				.setDescription(opts.description)
				.setTimestamp()
				.setThumbnail(opts.iconURL)
				.setColor(opts.colour)
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
		GetIcon: Utils['GetIcon'];
		GetGuildId: Utils['GetGuildId'];
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
			this.GetIcon = new Utils().GetIcon;
			this.GetGuildId = new Utils().GetGuildId;
		}
		async Base(opts: Funcs.SuccessEmbedOpts) {
			if (!opts.fields) opts.fields = null;
			if (!opts.image) opts.image = null;
			if (!opts.link) opts.link = null;
			if (!opts.iconURL && !opts.accessor) throw new Error('Manual or default');
			if (!opts.iconURL && opts.accessor)
				opts.iconURL = this.GetIcon(opts.accessor);
			if (!opts.id && !opts.accessor) throw new Error('Manual or defualt');
			if (!opts.id && opts.accessor) opts.id = this.GetGuildId(opts.accessor);

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
				colour: opts.colour,
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
		GetIcon: Utils['GetIcon'];
		GetGuildId: Utils['GetGuildId'];
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
			this.GetIcon = new Utils().GetIcon;
			this.GetGuildId = new Utils().GetGuildId;
		}
		async Base(opts: Funcs.BaseErrorOpts) {
			if (!opts.fields) opts.fields = null;
			if (!opts.image) opts.image = null;
			if (!opts.link) opts.link = null;
			if (!opts.iconURL && !opts.accessor) throw new Error('Manual or default');
			if (!opts.iconURL && opts.accessor)
				opts.iconURL = this.GetIcon(opts.accessor);
			if (!opts.id && !opts.accessor) throw new Error('Manual or defualt');
			if (!opts.id && opts.accessor) opts.id = this.GetGuildId(opts.accessor);

			const lang = await this.Getlang(opts.id);

			const embed = this.Embed({
				accessor: opts.accessor,
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
				colour: opts.colour,
			});
			return embed;
		}
		async ApiError(opts: Funcs.ErrorEmbedOpts) {
			return await this.Base({
				accessor: opts.accessor,
				iconURL: opts.iconURL,
				text: opts.text,
				id: opts.id,
				error_message: 'API error',
				fields: opts.fields,
				image: opts.image,
				link: opts.link,
				colour: opts.colour,
			});
		}
		async NsfwError(opts: Funcs.ErrorEmbedOpts) {
			return await this.Base({
				accessor: opts.accessor,
				iconURL: opts.iconURL,
				text: opts.text,
				id: opts.id,
				error_message: 'NSFW error',
				fields: opts.fields,
				image: opts.image,
				link: opts.link,
				colour: opts.colour,
			});
		}
		async CooldownError(opts: Funcs.CooldownErrorOpts) {
			const lang = await this.Getlang(opts.id);

			const second = `${opts.seconds} ${this.Getstring(lang, 'seconds')}`;
			const description = `${this.Capitalize(
				this.Getstring(lang, 'cooldown_message', second, opts.toUse)
			)}`;

			return await this.Base({
				accessor: opts.accessor,
				iconURL: opts.iconURL,
				id: opts.id,
				text: opts.text,
				error_message: description,
				fields: opts.fields,
				link: opts.link,
				image: opts.image,
				colour: opts.colour,
			});
		}
		async UnexpectedError(opts: Funcs.ErrorEmbedOpts) {
			const lang = await this.Getlang(opts.id);

			const description = this.Getstring(lang, 'unexpected_error');

			return await this.Base({
				accessor: opts.accessor,
				iconURL: opts.iconURL,
				text: opts.text,
				id: opts.id,
				error_message: description,
				fields: opts.fields,
				image: opts.image,
				link: opts.link,
				colour: opts.colour,
			});
		}
		async InvalidChoice(opts: Funcs.ErrorEmbedOpts) {
			return await this.Base({
				accessor: opts.accessor,
				iconURL: opts.iconURL,
				id: opts.id,
				text: opts.text,
				error_message: 'Invalid choice',
				fields: opts.fields,
				image: opts.image,
				link: opts.link,
				colour: opts.colour,
			});
		}
		async NoResult(opts: Funcs.ErrorEmbedOpts) {
			return await this.Base({
				accessor: opts.accessor,
				iconURL: opts.iconURL,
				id: opts.id,
				text: opts.text,
				error_message: 'No result(s) found',
				fields: opts.fields,
				link: opts.link,
				image: opts.image,
				colour: opts.colour,
			});
		}
		async ClientPermissions(opts: Funcs.PermissionsErrorOpts) {
			return await this.Base({
				accessor: opts.accessor,
				iconURL: opts.iconURL,
				id: opts.id,
				text: opts.text,
				error_message: `I need ${
					opts.perms.length > 1
						? `one of the following permissions ${opts.perms
								.map((p) => `${p}`)
								.join(', ')}`
						: `the following permission ${opts.perms[0]}`
				}`,
				fields: opts.fields,
				link: opts.link,
				image: opts.image,
				colour: opts.colour,
			});
		}
		async UserPermissions(opts: Funcs.PermissionsErrorOpts) {
			return await this.Base({
				accessor: opts.accessor,
				iconURL: opts.iconURL,
				id: opts.id,
				text: opts.text,
				error_message: `You need ${
					opts.perms.length > 1
						? `one of the following permissions ${opts.perms
								.map((p) => `${p}`)
								.join(', ')}`
						: `the following permission ${opts.perms[0]}`
				}`,
				fields: opts.fields,
				link: opts.link,
				image: opts.image,
				colour: opts.colour,
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
			const { iconURL, command, event } = opts;
			const { interaction, message } = event;

			if (message == null && interaction == null)
				throw new Error('Must pass in an interaction or message');

			const { lang, prefix, Strings } = this.cache.get(
				message == null ? interaction.guild.id : message.guild.id
			);

			const strings = {
				titles: {
					status: Strings.status,
					working: Strings.working,
					name: Strings.name,
					category: Strings.category,
					aliases: Strings.aliases,
					usage: Strings.usage,
					description: Strings.description,
					accessible_by: Strings.accessible_by,
					permissions: Strings.permissions,
					subCommands: Strings.subCommands,
					example: Strings.example,
					guild_only: Strings.guild_only,
					owner_only: Strings.owner_only,
					cooldown: Strings.cooldown,
					user_permissions: Strings.user_permissions,
				},
				values: {
					yes: Strings.yes,
					no: Strings.no,
					none: Strings.none,
					is_required: Strings.is_required,
					is_optional: Strings.is_optional,
					seconds: Strings.seconds,
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
					.map((e) => `\`${prefix}${e}\``)
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
					{ name: 'Usage', value: `\`${prefix}${command.getUsage()}\`` },
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
						value: `\`${
							command.getGuildonly() == true
								? this.Capitalize(strings.values.yes)
								: this.Capitalize(strings.values.no)
						}\``,
					},
					{
						name: `NSFW?`,
						value: `\`${
							command.getNsfw() == true
								? this.Capitalize(strings.values.yes)
								: this.Capitalize(strings.values.no)
						}\``,
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
					{ name: this.Capitalize(strings.titles.example), value: examples },
				],
			});

			if (message != null)
				return this.Paginate(
					{ message: message },
					embed,
					embed2,
					embed3,
					embed4
				);
			return this.Paginate(
				{ interaction: interaction },
				embed,
				embed2,
				embed3,
				embed4
			);
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
		GetIcon: Utils['GetIcon'];
		GetGuildId: Utils['GetGuildId'];
		constructor() {
			this.con = StateManager.con;
			this.client = globalThis.client;
			this.cache = this.client.database;
			this.Embed = new Embed().Base;
			this.Capitalize = new Utils().Capitalize;
			this.Set = new Colour().Set;
			this.Getstring = new Translator().Getstring;
			this.Getlang = new Translator().Getlang;
			this.GetIcon = new Utils().GetIcon;
			this.GetGuildId = new Utils().GetGuildId;
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
			if (!opts.iconURL && !opts.accessor) throw new Error('Manual or default');
			if (!opts.iconURL && opts.accessor)
				opts.iconURL = this.GetIcon(opts.accessor);
			if (!opts.id && !opts.accessor) throw new Error('Manual or defualt');
			if (!opts.id && opts.accessor) opts.id = this.GetGuildId(opts.accessor);

			const lang = await this.Getlang(opts.id);

			const title: string = `${this.Capitalize(
				this.Getstring(lang, 'generating')
			)}...`;
			const description: string = `${this.Capitalize(
				this.Getstring(lang, 'provided_by')
			)}: \`${opts.provider}\``;

			return this.Embed({
				accessor: opts.accessor,
				iconURL: opts.iconURL,
				text: opts.text,
				title: title,
				description: description,
				fields: opts.fields,
				link: opts.link,
				image: opts.image,
				colour: opts.colour,
			});
		}
		async DogCeoApi(opts: Funcs.GeneratingEmbedOpts) {
			return await this.Base({
				colour: opts.colour,
				accessor: opts.accessor,
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
				colour: opts.colour,
				accessor: opts.accessor,
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
				colour: opts.colour,
				accessor: opts.accessor,
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
				colour: opts.colour,
				accessor: opts.accessor,
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
				colour: opts.colour,
				accessor: opts.accessor,
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
				colour: opts.colour,
				accessor: opts.accessor,
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
				colour: opts.colour,
				accessor: opts.accessor,
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
		GetIcon: Utils['GetIcon'];
		GetGuildId: Utils['GetGuildId'];
		constructor() {
			this.con = StateManager.con;
			this.client = globalThis.client;
			this.cache = this.client.database;
			this.Embed = new Embed().Base;
			this.Capitalize = new Utils().Capitalize;
			this.Set = new Colour().Set;
			this.Base = this.Base.bind(this);
			this.GetIcon = new Utils().GetIcon;
			this.GetGuildId = new Utils().GetGuildId;
		}
		async Base(opts: Funcs.ImageEmbedOpts) {
			if (!opts.fields) opts.fields = null;
			if (!opts.link) opts.link = null;
			if (!opts.iconURL && !opts.accessor) throw new Error('Manual or default');
			if (!opts.iconURL && opts.accessor)
				opts.iconURL = this.GetIcon(opts.accessor);

			return await this.Embed({
				colour: opts.colour,
				accessor: opts.accessor,
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
		async InsertModeration(
			id: Snowflake,
			moderation: string,
			caseNumber: number,
			moderatorId: Snowflake,
			opts?: Funcs.InsertModerationOpts
		) {
			const obj: CachedGuildTypes.moderation = {
				moderation: moderation,
				caseNumber: caseNumber,
				moderatorId: moderatorId,
				reason: opts?.reason ? opts?.reason : null,
				user: opts?.user ? opts?.user : null,
				modlog: opts?.modlog ? opts?.modlog : null,
				publicmodlog: opts?.publicmodlog ? opts?.publicmodlog : null,
				messageId: opts?.modlogId ? opts?.modlogId : null,
				publicMessageId: opts?.publicmodlogId ? opts?.publicmodlogId : null,
				moderationdate: opts?.moderationDate ? opts?.moderationDate : null,
				lastupdated: opts?.updatedAt ? opts?.updatedAt : null,
				updateby: opts?.updatedBy ? opts?.updatedBy : null,
			};
			const con = await this.con.connect();
			try {
				const res = await con.query(
					`SELECT moderations FROM Guilds WHERE guildid = '${id}'`
				);

				const { data } = new Schemas.Moderations(res.rows[0].moderations);

				data.push(obj);

				await con.query(`BEGIN`);
				await con.query(
					`UPDATE Guilds SET moderations = '${new Schemas.Moderations(
						data
					).toString()}' WHERE guildId = '${id}'`
				);
				await con.query(`COMMIT`);
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async FetchModeration(id: Snowflake, caseNumber: number) {
			const con = await this.con.connect();
			try {
				const res = await con.query(
					`SELECT moderations FROM Guilds WHERE guildid = '${id}'`
				);
				const { data } = new Schemas.Moderations(res.rows[0].moderations);
				const moderation = data.filter((m) => m.caseNumber == caseNumber);

				if (moderation.length == 0) return null;
				return moderation[0];
			} catch (error) {
				console.log(error);
			} finally {
				con.release();
			}
		}
		async GetCaseNumber(id: Snowflake): Promise<number> {
			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT moderations FROM Guilds WHERE guildid = '${id}'`
				);
				const { data } = new Schemas.Moderations(res.rows[0].moderations);
				let caseNumber = data.length;
				caseNumber++;
				return caseNumber;
			} finally {
				con.release();
			}
		}
	}
}

export = Functions;
