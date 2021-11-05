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
	Util,
	Options,
} from 'discord.js';
import CachedGuild from './Structures/CachedGuild';
import Colours from '../../Colours.json';
import Languages from '../../Languages.json';
import Descriptions from '../../Descriptions.json';
import CachedGuildTypes from './Structures/Interfaces/CachedGuild';
import Emojis from '../../Emojis.json';
import Schemas from './Schemas';
import moment, { relativeTimeThreshold } from 'moment';
import { ChannelTypes } from 'discord.js/typings/enums';
import {
	APIApplicationCommandOption,
	APIInteractionDataResolvedChannel,
} from 'discord-api-types';
import {
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from '@discordjs/builders';
import types from 'discord-api-types/v9';

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
		protected con: Pool;
		protected client: DiscordClient;
		protected cache: Collection<Snowflake, CachedGuild>;
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
		protected con: Pool;
		protected client: DiscordClient;
		protected cache: Collection<Snowflake, CachedGuild>;
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
			accessor: CommandInteraction | Message
		) {
			// THIS IS NOT MY FUNCTION BUT I'VE UPDATED THE CODE BECAUSE IT BROKE IN DJS V13
			// IF THE ORIGINAL OWNER WOULD LIKE ME TO REMOVE THIS I CAN Contact me here: ProcessVersion#4472
			if (!pages) throw new Error('Pages are not given.');
			if (emojiList.length !== 2) throw new Error('Need two emojis.');
			let page = 0;
			const curPage =
				accessor instanceof CommandInteraction
					? await accessor.channel.send({
							embeds: [
								pages[page].setFooter(`Page ${page + 1} / ${pages.length}`),
							],
					  })
					: await accessor.channel.send({
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
					accessor instanceof CommandInteraction
						? accessor.user.id
						: accessor.author.id
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
			if (!opts.emojiList) opts.emojiList = ['⏪', '⏩'];
			if (!opts.timeout) opts.timeout = 120000;

			if (opts.embeds) {
				if (opts.embeds.length <= 1)
					throw new ReferenceError('Not long enough to paginate!');

				return this.Pagination(
					opts.embeds,
					opts.emojiList,
					opts.timeout,
					opts.accessor
				);
			}

			if (args.length <= 1)
				throw new ReferenceError('Not enough embeds to paginate');

			return this.Pagination(args, opts.emojiList, opts.timeout, opts.accessor);
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
			} catch (error) {
				console.log(error);
			}
		}
		/** @deprecated */
		Mentionrole(id: Snowflake): string {
			return `<@&${id}>`;
		}
		/** @deprecated */
		Mentionchannel(id: Snowflake): string {
			return `<#${id}>`;
		}
		/** @deprecated */
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
			if (status == 'dnd') return this.Emojis.dnd;
			if (status == 'idle') return this.Emojis.idle;
			if (status == 'online') return this.Emojis.online;
			return this.Emojis.offline;
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
				DISCORD_EMPLOYEE: this.Emojis.discord_employee,
				DISCORD_PARTNER: this.Emojis.discord_partner,
				BUGHUNTER_LEVEL_1: this.Emojis.bughunter_1,
				BUGHUNTER_LEVEL_2: this.Emojis.bughunter_2,
				HYPESQUAD_EVENTS: this.Emojis.hypesquad_events,
				HOUSE_BRAVERY: this.Emojis.hypesquad_bravery,
				HOUSE_BRILLIANCE: this.Emojis.hypesquad_brilliance,
				HOUSE_BALANCE: this.Emojis.hypesquad_balance,
				EARLY_SUPPORTER: this.Emojis.early_supporter,
				TEAM_USER: 'Team User',
				SYSTEM: this.Emojis.system,
				VERIFIED_BOT: this.Emojis['7235bot'],
				VERIFIED_DEVELOPER: this.Emojis.verified_bot_dev,
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
				return toGrab.displayAvatarURL({ dynamic: dynamic });
			if (toGrab instanceof Message && type == 'guild')
				return toGrab.guild.iconURL({ dynamic: dynamic });
			else if (toGrab instanceof Message)
				return toGrab.member.displayAvatarURL({ dynamic: dynamic });
			if (toGrab instanceof CommandInteraction && type == 'guild')
				return toGrab.guild.iconURL({ dynamic: dynamic });

			if (toGrab.member instanceof GuildMember) {
				return toGrab.member.displayAvatarURL({ dynamic: true });
			}

			const user = toGrab.guild.members.cache.find(
				(member) => member.id == toGrab.user.id
			);
			return user.displayAvatarURL({ dynamic: true });
		}
		async FetchChannel(id: Snowflake) {
			return (
				this.client.channels.cache.find((ch) => ch.id == id) ||
				(await this.client.channels.fetch(id))
			);
		}
		async FetchUser(id: Snowflake) {
			return (
				this.client.users.cache.find((u) => u.id == id) ||
				(await this.client.users.fetch(id))
			);
		}
	}

	export class Channels {
		protected con: Pool;
		protected client: DiscordClient;
		protected cache: Collection<Snowflake, CachedGuild>;
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
		protected con: Pool;
		protected client: DiscordClient;
		protected cache: Collection<Snowflake, CachedGuild>;
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
		protected con: Pool;
		protected client: DiscordClient;
		protected cache: Collection<Snowflake, CachedGuild>;
		protected Capitalize: Utils['Capitalize'];
		protected Set: Colour['Set'];
		protected GetGuildId: Utils['GetGuildId'];
		protected GetIcon: Utils['GetIcon'];
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
		protected con: Pool;
		protected client: DiscordClient;
		protected cache: Collection<Snowflake, CachedGuild>;
		protected Capitalize: Utils['Capitalize'];
		protected Set: Colour['Set'];
		protected Getstring: Translator['Getstring'];
		protected Getlang: Translator['Getlang'];
		protected Embed: Embed['Base'];
		protected GetIcon: Utils['GetIcon'];
		protected GetGuildId: Utils['GetGuildId'];
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
				title: `${Emojis.success} | ${this.Capitalize(
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
		protected con: Pool;
		protected client: DiscordClient;
		protected cache: Collection<Snowflake, CachedGuild>;
		protected Capitalize: Utils['Capitalize'];
		protected Getlang: Translator['Getlang'];
		protected Getstring: Translator['Getstring'];
		protected Set: Colour['Set'];
		protected Embed: Embed['Base'];
		protected GetIcon: Utils['GetIcon'];
		protected GetGuildId: Utils['GetGuildId'];
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
				title: `${Emojis.error} | ${this.Capitalize(
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
			if (!opts.id && !opts.accessor) throw new Error('Manual or defualt');
			if (!opts.id && opts.accessor) opts.id = this.GetGuildId(opts.accessor);

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
		protected con: Pool;
		protected client: DiscordClient;
		protected cache: Collection<Snowflake, CachedGuild>;
		protected Getlang: Translator['Getlang'];
		protected Getstring: Translator['Getstring'];
		protected Translate: Translator['Translate'];
		protected Set: Colour['Set'];
		protected Paginate: Utils['Paginate'];
		protected Capitalize: Utils['Capitalize'];
		protected Prefix: Settings['Prefix'];
		protected Embed: Embed['Base'];
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
			const { iconURL, command, accessor } = opts;

			const { lang, prefix, Strings } = this.cache.get(
				accessor instanceof CommandInteraction
					? accessor.guild.id
					: accessor.guild.id
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

			return this.Paginate(
				{ accessor: accessor },
				embed,
				embed2,
				embed3,
				embed4
			);
		}
	}
	export class GeneratingEmbed {
		protected con: Pool;
		protected client: DiscordClient;
		protected cache: Collection<Snowflake, CachedGuild>;
		protected Embed: Embed['Base'];
		protected Capitalize: Utils['Capitalize'];
		protected Set: Colour['Set'];
		protected Getstring: Translator['Getstring'];
		protected Getlang: Translator['Getlang'];
		protected GetIcon: Utils['GetIcon'];
		protected GetGuildId: Utils['GetGuildId'];
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
		protected con: Pool;
		protected client: DiscordClient;
		protected cache: Collection<Snowflake, CachedGuild>;
		protected Embed: Embed['Base'];
		protected Capitalize: Utils['Capitalize'];
		protected Set: Colour['Set'];
		protected GetIcon: Utils['GetIcon'];
		protected GetGuildId: Utils['GetGuildId'];
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
		protected con: Pool;
		protected client: DiscordClient;
		protected cache: Collection<Snowflake, CachedGuild>;
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

	export class SlashCommands {
		protected _Advice: SlashCommandBuilder;
		protected _Baka: SlashCommandBuilder;
		protected _Foxgirl: SlashCommandBuilder;
		protected _Joke: SlashCommandBuilder;
		protected _Neko: SlashCommandBuilder;
		protected _Pickup: SlashCommandBuilder;
		protected _Roast: SlashCommandBuilder;
		protected _Sexyrate: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Ship: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Simprate: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Waifu: SlashCommandBuilder;
		protected _Wallpaper: SlashCommandBuilder;
		protected _Equelmemes: SlashCommandBuilder;
		protected _Sequelmemes: SlashCommandBuilder;
		protected _Prequelmemes: SlashCommandBuilder;
		protected _OTMeme: SlashCommandBuilder;
		protected _Anime: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Collection: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Docs: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Google: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Lyrics: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Reddit: SlashCommandSubcommandsOnlyBuilder;
		protected _Roblox: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _YouTube: SlashCommandSubcommandsOnlyBuilder;
		protected _Info: SlashCommandSubcommandsOnlyBuilder;
		protected _Cry: SlashCommandBuilder;
		protected _Cuddle: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Feed: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Facepalm: SlashCommandBuilder;
		protected _Hug: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Laugh: SlashCommandBuilder;
		protected _Lick: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Mwah: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Pat: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Poke: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Slap: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Smug: SlashCommandBuilder;
		protected _Tickle: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Wink: SlashCommandBuilder;
		protected Commands: Array<
			| SlashCommandSubcommandsOnlyBuilder
			| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
		>;
		protected _Weather: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Help: Omit<
			SlashCommandBuilder,
			'addSubcommandGroup' | 'addSubcommand'
		>;
		protected _Meme: SlashCommandBuilder;
		protected _News: SlashCommandSubcommandsOnlyBuilder;
		protected _Quote: SlashCommandBuilder;
		protected _Urban: SlashCommandSubcommandsOnlyBuilder;
		protected _Aww: Omit<
			SlashCommandBuilder,
			'addSubcommand' | 'addSubcommandGroup'
		>;
		protected _Botclear: SlashCommandBuilder;
		protected _Botinfo: SlashCommandBuilder;
		protected _Changelog: SlashCommandBuilder;
		protected _Invite: SlashCommandBuilder;
		protected _Ping: SlashCommandBuilder;
		protected _Support: SlashCommandBuilder;
		protected _Uptime: SlashCommandBuilder;
		protected _Botnick: Omit<
			SlashCommandBuilder,
			'addSubcommand' | 'addSubcommandGroup'
		>;
		protected client: DiscordClient;
		constructor() {
			this.client = globalThis.client as DiscordClient;
			this._Aww = null;
			this._Botclear = null;
			this._Botinfo = null;
			this._Changelog = null;
			this._Invite = null;
			this._Ping = null;
			this._Support = null;
			this._Uptime = null;
			this._Botnick = null;
			this._Advice = null;
			this._Baka = null;
			this._Foxgirl = null;
			this._Joke = null;
			this._Neko = null;
			this._Pickup = null;
			this._Roast = null;
			this._Sexyrate = null;
			this._Ship = null;
			this._Simprate = null;
			this._Waifu = null;
			this._Wallpaper = null;
			this._Equelmemes = null;
			this._Sequelmemes = null;
			this._Prequelmemes = null;
			this._Anime = null;
			this._Collection = null;
			this._Docs = null;
			this._Google = null;
			this._Lyrics = null;
			this._Reddit = null;
			this._Roblox = null;
			this._YouTube = null;
			this._Info = null;
			this._Cry = null;
			this._Cuddle = null;
			this._Feed = null;
			this._Facepalm = null;
			this._Hug = null;
			this._Laugh = null;
			this._Lick = null;
			this._Mwah = null;
			this._Pat = null;
			this._Poke = null;
			this._Slap = null;
			this._Smug = null;
			this._Tickle = null;
			this._Wink = null;
			this._Weather = null;
			this._Help = null;
			this._Meme = null;
			this._News = null;
			this._Quote = null;
			this._Urban = null;
			this.Commands = [];
		}
		Advice() {
			this._Advice = new SlashCommandBuilder()
				.setName('advice')
				.setDescription(this.client.commands.get('advice').getDescription());
			this.Commands.push(this._Advice);
			return this;
		}
		Baka() {
			this._Baka = new SlashCommandBuilder()
				.setName('baka')
				.setDescription(this.client.commands.get('baka').getDescription());
			this.Commands.push(this._Baka);
			return this;
		}
		Foxgirl() {
			this._Foxgirl = new SlashCommandBuilder()
				.setName('foxgirl')
				.setDescription(this.client.commands.get('foxgirl').getDescription());
			this.Commands.push(this._Foxgirl);
			return this;
		}
		Joke() {
			this._Joke = new SlashCommandBuilder()
				.setName('joke')
				.setDescription(this.client.commands.get('joke').getDescription());
			this.Commands.push(this._Joke);
			return this;
		}
		Neko() {
			this._Neko = new SlashCommandBuilder()
				.setName('neko')
				.setDescription(this.client.commands.get('neko').getDescription());
			this.Commands.push(this._Neko);
			return this;
		}
		Pickup() {
			this._Pickup = new SlashCommandBuilder()
				.setName('pickup')
				.setDescription(this.client.commands.get('pickup').getDescription());
			this.Commands.push(this._Pickup);
			return this;
		}
		Roast() {
			this._Roast = new SlashCommandBuilder()
				.setName('roast')
				.setDescription(this.client.commands.get('roast').getDescription());
			this.Commands.push(this._Roast);
			return this;
		}
		Sexyrate() {
			this._Sexyrate = new SlashCommandBuilder()
				.setName('sexyrate')
				.setDescription(this.client.commands.get('sexyrate').getDescription())
				.addUserOption((opt) =>
					opt
						.setName('user')
						.setDescription('The person whom you want to get a sexy rating for')
						.setRequired(false)
				);
			this.Commands.push(this._Sexyrate);
			return this;
		}
		Ship() {
			this._Ship = new SlashCommandBuilder()
				.setName('ship')
				.setDescription(this.client.commands.get('ship').getDescription())
				.addUserOption((opt) =>
					opt
						.setName('user1')
						.setDescription('First user who you want to ship')
						.setRequired(true)
				)
				.addUserOption((opt) =>
					opt
						.setName('user2')
						.setDescription('Second user who you want to ship')
						.setRequired(false)
				);
			this.Commands.push(this._Ship);
			return this;
		}
		Simprate() {
			this._Simprate = new SlashCommandBuilder()
				.setName('simprate')
				.setDescription(this.client.commands.get('simprate').getDescription())
				.addUserOption((opt) =>
					opt
						.setName('user')
						.setDescription('The person who you want to get a simp rating for')
						.setRequired(false)
				);
			this.Commands.push(this._Simprate);
			return this;
		}
		Waifu() {
			this._Waifu = new SlashCommandBuilder()
				.setName('waifu')
				.setDescription(this.client.commands.get('waifu').getDescription());
			this.Commands.push(this._Waifu);
			return this;
		}
		Wallpaper() {
			this._Wallpaper = new SlashCommandBuilder()
				.setName('wallpaper')
				.setDescription(this.client.commands.get('wallpaper').getDescription());
			this.Commands.push(this._Wallpaper);
			return this;
		}
		Equelmemes() {
			this._Equelmemes = new SlashCommandBuilder()
				.setName('equelmeme')
				.setDescription(this.client.commands.get('equelmeme').getDescription());
			this.Commands.push(this._Equelmemes);
			return this;
		}
		Sequelmemes() {
			this._Sequelmemes = new SlashCommandBuilder()
				.setName('sequelmeme')
				.setDescription(
					this.client.commands.get('sequelmeme').getDescription()
				);
			this.Commands.push(this._Sequelmemes);
			return this;
		}
		Prequelmemes() {
			this._Prequelmemes = new SlashCommandBuilder()
				.setName('prequelmeme')
				.setDescription(
					this.client.commands.get('prequelmeme').getDescription()
				);
			this.Commands.push(this._Prequelmemes);
			return this;
		}
		OTMeme() {
			this._OTMeme = new SlashCommandBuilder()
				.setName('otmeme')
				.setDescription(this.client.commands.get('otmeme').getDescription());
			this.Commands.push(this._OTMeme);
			return this;
		}
		Anime() {
			this._Anime = new SlashCommandBuilder()
				.setName('anime')
				.setDescription(this.client.commands.get('anime').getDescription())
				.addStringOption((opt) =>
					opt
						.setName('query')
						.setDescription('The anime you want information about')
						.setRequired(true)
				);
			this.Commands.push(this._Anime);
			return this;
		}
		Collection() {
			this._Collection = new SlashCommandBuilder()
				.setName('collection')
				.setDescription(this.client.commands.get('collection').getDescription())
				.addStringOption((opt) =>
					opt
						.setName('query')
						.setDescription('Your collection query')
						.setRequired(true)
				);
			this.Commands.push(this._Collection);
			return this;
		}
		Docs() {
			this._Docs = new SlashCommandBuilder()
				.setName('docs')
				.setDescription(this.client.commands.get('docs').getDescription())
				.addStringOption((opt) =>
					opt
						.setName('query')
						.setDescription('Discord.js stable query')
						.setRequired(true)
				);
			this.Commands.push(this._Docs);
			return this;
		}
		Google() {
			this._Google = new SlashCommandBuilder()
				.setName('google')
				.setDescription(this.client.commands.get('google').getDescription())
				.addStringOption((opt) =>
					opt
						.setName('query')
						.setDescription('Query for Google search')
						.setRequired(true)
				);
			this.Commands.push(this._Google);
			return this;
		}
		Lyrics() {
			this._Lyrics = new SlashCommandBuilder()
				.setName('lyrics')
				.setDescription(this.client.commands.get('lyrics').getDescription())
				.addStringOption((opt) =>
					opt
						.setName('query')
						.setDescription('The song name you want lyrics of')
						.setRequired(true)
				);
			this.Commands.push(this._Lyrics);
			return this;
		}
		Reddit() {
			this._Reddit = new SlashCommandBuilder()
				.setName('reddit')
				.setDescription(this.client.commands.get('reddit').getDescription())
				.addSubcommand((sub) =>
					sub
						.setName('subreddit')
						.setDescription('Search subreddits')
						.addStringOption((opt) =>
							opt
								.setName('query')
								.setDescription(
									'A subreddit name you want to get information on'
								)
								.setRequired(true)
						)
				)
				.addSubcommand((sub) =>
					sub
						.setName('user')
						.setDescription('Search users on reddit')
						.addStringOption((opt) =>
							opt
								.setName('query')
								.setDescription(
									'A reddit username you want to get information on'
								)
								.setRequired(true)
						)
				);
			this.Commands.push(this._Reddit);
			return this;
		}
		Roblox() {
			this._Roblox = new SlashCommandBuilder()
				.setName('roblox')
				.setDescription(this.client.commands.get('roblox').getDescription())
				.addStringOption((opt) =>
					opt
						.setName('query')
						.setDescription(
							'ROBLOX username who you want to get information about'
						)
						.setRequired(true)
				);
			this.Commands.push(this._Roblox);
			return this;
		}
		YouTube() {
			this._YouTube = new SlashCommandBuilder()
				.setName('youtube')
				.setDescription(this.client.commands.get('youtube').getDescription())
				.addSubcommand((sub) =>
					sub
						.setName('channel')
						.setDescription('Get information on a YouTube channel')
						.addStringOption((opt) =>
							opt
								.setName('query')
								.setDescription('YouTube channel name')
								.setRequired(true)
						)
				)
				.addSubcommand((sub) =>
					sub
						.setName('video')
						.setDescription('Get information on a video')
						.addStringOption((opt) =>
							opt
								.setName('query')
								.setDescription('Name of the video you want to search')
								.setRequired(true)
						)
				);
			this.Commands.push(this._YouTube);
			return this;
		}
		Info() {
			this._Info = new SlashCommandBuilder()
				.setName('info')
				.setDescription(this.client.commands.get('info').getDescription())
				.addSubcommand((sub) =>
					sub
						.setName('user')
						.setDescription('Get information on a user')
						.addUserOption((opt) =>
							opt
								.setName('user')
								.setDescription('User who you want to get information on')
								.setRequired(false)
						)
				)
				.addSubcommand((sub) =>
					sub
						.setName('role')
						.setDescription('Get information on a role')
						.addRoleOption((opt) =>
							opt
								.setName('role')
								.setDescription('Role you want to get information on')
								.setRequired(true)
						)
				)
				.addSubcommand((sub) =>
					sub
						.setName('channel')
						.setDescription('Get information on a channel')
						.addChannelOption((opt) =>
							opt
								.setName('channel')
								.setDescription('Channel you want to get information on')
								.setRequired(false)
						)
				)
				.addSubcommand((sub) =>
					sub.setName('server').setDescription('Get information on the server')
				)
				.addSubcommand((sub) =>
					sub
						.setName('avatar')
						.setDescription("View a user's avatar")
						.addUserOption((opt) =>
							opt
								.setName('user')
								.setDescription('User mention to view their avatar')
								.setRequired(false)
						)
				)
				.addSubcommand((sub) =>
					sub
						.setName('membercount')
						.setDescription('View the membercount of the guild')
				);
			this.Commands.push(this._Info);
			return this;
		}
		Cry() {
			this._Cry = new SlashCommandBuilder().setName('cry').setDescription('😢');
			this.Commands.push(this._Cry);
			return this;
		}
		Cuddle() {
			this._Cuddle = new SlashCommandBuilder()
				.setName('cuddle')
				.setDescription(this.client.commands.get('cuddle').getDescription())
				.addUserOption((opt) =>
					opt
						.setName('user')
						.setDescription('The user you want to cuddle')
						.setRequired(true)
				);
			this.Commands.push(this._Cuddle);
			return this;
		}
		Facepalm() {
			this._Facepalm = new SlashCommandBuilder()
				.setName('facepalm')
				.setDescription(this.client.commands.get('facepalm').getDescription());
			this.Commands.push(this._Facepalm);
			return this;
		}
		Feed() {
			this._Feed = new SlashCommandBuilder()
				.setName('feed')
				.setDescription(this.client.commands.get('feed').getDescription())
				.addUserOption((opt) =>
					opt
						.setName('user')
						.setDescription('The user you want to feed')
						.setRequired(true)
				);
			this.Commands.push(this._Feed);
			return this;
		}
		Hug() {
			this._Hug = new SlashCommandBuilder()
				.setName('hug')
				.setDescription(this.client.commands.get('hug').getDescription())
				.addUserOption((opt) =>
					opt
						.setName('user')
						.setDescription('The user you want to hug')
						.setRequired(true)
				);
			this.Commands.push(this._Hug);
			return this;
		}
		Laugh() {
			this._Laugh = new SlashCommandBuilder()
				.setName('laugh')
				.setDescription(this.client.commands.get('laugh').getDescription());
			this.Commands.push(this._Laugh);
			return this;
		}
		Lick() {
			this._Lick = new SlashCommandBuilder()
				.setName('lick')
				.setDescription('Lick the mentioned user')
				.addUserOption((opt) =>
					opt
						.setName('user')
						.setDescription(this.client.commands.get('lick').getDescription())
						.setRequired(true)
				);
			this.Commands.push(this._Lick);
			return this;
		}
		Mwah() {
			this._Mwah = new SlashCommandBuilder()
				.setName('mwah')
				.setDescription(this.client.commands.get('mwah').getDescription())
				.addUserOption((opt) =>
					opt
						.setName('user')
						.setDescription('The user you want to kiss')
						.setRequired(true)
				);
			this.Commands.push(this._Mwah);
			return this;
		}
		Pat() {
			this._Pat = new SlashCommandBuilder()
				.setName('pat')
				.setDescription(this.client.commands.get('pat').getDescription())
				.addUserOption((opt) =>
					opt
						.setName('user')
						.setDescription('The user you want to pat')
						.setRequired(true)
				);
			return this;
		}
		Poke() {
			this._Poke = new SlashCommandBuilder()
				.setName('poke')
				.setDescription(this.client.commands.get('poke').getDescription())
				.addUserOption((opt) =>
					opt
						.setName('user')
						.setDescription('The user you want to poke')
						.setRequired(true)
				);
			this.Commands.push(this._Poke);
			return this;
		}
		Slap() {
			this._Slap = new SlashCommandBuilder()
				.setName('slap')
				.setDescription(this.client.commands.get('slap').getDescription())
				.addUserOption((opt) =>
					opt
						.setName('user')
						.setDescription('The user you want to slap')
						.setRequired(true)
				);
			this.Commands.push(this._Slap);
			return this;
		}
		Smug() {
			this._Smug = new SlashCommandBuilder()
				.setName('smug')
				.setDescription(this.client.commands.get('smug').getDescription());
			this.Commands.push(this._Smug);
			return this;
		}
		Tickle() {
			this._Tickle = new SlashCommandBuilder()
				.setName('tickle')
				.setDescription(this.client.commands.get('tickle').getDescription())
				.addUserOption((opt) =>
					opt
						.setName('user')
						.setDescription('The user you want to tickle')
						.setRequired(true)
				);
			this.Commands.push(this._Tickle);
			return this;
		}
		Wink() {
			this._Wink = new SlashCommandBuilder()
				.setName('wink')
				.setDescription(this.client.commands.get('wink').getDescription());
			this.Commands.push(this._Wink);
			return this;
		}
		Weather() {
			this._Weather = new SlashCommandBuilder()
				.setName('weather')
				.setDescription(this.client.commands.get('weather').getDescription())
				.addStringOption((opt) =>
					opt
						.setName('query')
						.setDescription('Location for weather information')
						.setRequired(true)
				);
			this.Commands.push(this._Weather);
			return this;
		}
		Help() {
			this._Help = new SlashCommandBuilder()
				.setName('help')
				.setDescription(this.client.commands.get('help').getDescription())
				.addStringOption((opt) =>
					opt
						.setName('query')
						.setDescription(
							'Command or category name you want to get information on'
						)
				);
			this.Commands.push(this._Help);
			return this;
		}
		Meme() {
			this._Meme = new SlashCommandBuilder()
				.setName('meme')
				.setDescription(this.client.commands.get('meme').getDescription());
			this.Commands.push(this._Meme);
			return this;
		}
		News() {
			this._News = new SlashCommandBuilder()
				.setName('news')
				.setDescription(this.client.commands.get('news').getDescription())
				.addSubcommand((sub) =>
					sub
						.setName('alltime')
						.setDescription('Search the all time news')
						.addStringOption((opt) =>
							opt
								.setName('query')
								.setDescription('Your all-time news query')
								.setRequired(true)
						)
				)
				.addSubcommand((sub) =>
					sub
						.setName('top')
						.setDescription('The top news at the current time')
						.addStringOption((opt) =>
							opt
								.setName('query')
								.setDescription('Your top news query')
								.setRequired(true)
						)
				);
			this.Commands.push(this._News);
			return this;
		}
		Quote() {
			this._Quote = new SlashCommandBuilder()
				.setName('quote')
				.setDescription(this.client.commands.get('quote').getDescription());
			this.Commands.push(this._Quote);
			return this;
		}
		Urban() {
			this._Urban = new SlashCommandBuilder()
				.setName('urban')
				.setDescription(this.client.commands.get('urban').getDescription())
				.addSubcommand((opt) =>
					opt
						.setName('random')
						.setDescription('Get a random word from urban dictionary')
				)
				.addSubcommand((opt) =>
					opt
						.setName('search')
						.setDescription('Search urban dictionary')
						.addStringOption((opt) =>
							opt
								.setName('query')
								.setDescription('Your word query to search on urban dictionary')
								.setRequired(true)
						)
				);
			this.Commands.push(this._Urban);
			return this;
		}
		Aww() {
			this._Aww = new SlashCommandBuilder()
				.setName('aww')
				.setDescription('Get a picture of various animals')
				.addStringOption((opt) =>
					opt
						.setName('animal')
						.setDescription("The animal you'd like a picture of")
						.setRequired(true)
						.addChoice('bird', 'bird')
						.addChoice('cat', 'cat')
						.addChoice('dog', 'dog')
						.addChoice('fox', 'fox')
						.addChoice('kangaroo', 'kangaroo')
						.addChoice('koala', 'koala')
						.addChoice('panda', 'panda')
						.addChoice('racoon', 'racoon')
						.addChoice('redpanda', 'redpanda')
						.addChoice('shibe', 'shibe')
						.addChoice('whale', 'whale')
				);
			this.Commands.push(this._Aww);
			return this;
		}
		Botclear() {
			this._Botclear = new SlashCommandBuilder()
				.setName('botclear')
				.setDescription(this.client.commands.get('botclear').getDescription());
			this.Commands.push(this._Botclear);
			return this;
		}
		Botinfo() {
			this._Botinfo = new SlashCommandBuilder()
				.setName('botinfo')
				.setDescription(this.client.commands.get('botinfo').getDescription());
			this.Commands.push(this._Botinfo);
			return this;
		}
		Botnick() {
			this._Botnick = new SlashCommandBuilder()
				.setName('botnick')
				.setDescription(this.client.commands.get('botnick').getDescription())
				.addStringOption((opt) =>
					opt
						.setName('name')
						.setDescription('The new nickname you want to give the bot')
						.setRequired(true)
				);
			this.Commands.push(this._Botnick);
			return this;
		}
		Changelog() {
			this._Changelog = new SlashCommandBuilder()
				.setName('changelog')
				.setDescription(this.client.commands.get('changelog').getDescription());
			this.Commands.push(this._Changelog);
			return this;
		}
		Invite() {
			this._Invite = new SlashCommandBuilder()
				.setName('invite')
				.setDescription(this.client.commands.get('invite').getDescription());
			this.Commands.push(this._Invite);
			return this;
		}
		Ping() {
			this._Ping = new SlashCommandBuilder()
				.setName('ping')
				.setDescription(this.client.commands.get('ping').getDescription());
			this.Commands.push(this._Ping);
			return this;
		}
		Support() {
			this._Support = new SlashCommandBuilder()
				.setName('support')
				.setDescription(this.client.commands.get('support').getDescription());
			this.Commands.push(this._Support);
			return this;
		}
		Uptime() {
			this._Uptime = new SlashCommandBuilder()
				.setName('uptime')
				.setDescription(this.client.commands.get('uptime').getDescription());
			this.Commands.push(this._Uptime);
			return this;
		}
		All() {
			this.Advice();
			this.Anime();
			this.Baka();
			this.Collection();
			this.Cry();
			this.Cuddle();
			this.Docs();
			this.Equelmemes();
			this.Facepalm();
			this.Feed();
			this.Foxgirl();
			this.Google();
			this.Hug();
			this.Info();
			this.Joke();
			this.Laugh();
			this.Lick();
			this.Lyrics();
			this.Mwah();
			this.Neko();
			this.OTMeme();
			this.Pat();
			this.Pickup();
			this.Poke();
			this.Prequelmemes();
			this.Reddit();
			this.Roast();
			this.Roblox();
			this.Sequelmemes();
			this.Sexyrate();
			this.Ship();
			this.Simprate();
			this.Slap();
			this.Smug();
			this.Tickle();
			this.Waifu();
			this.Wallpaper();
			this.YouTube();
			this.Wink();
			this.Weather();
			this.Help();
			this.Meme();
			this.News();
			this.Quote();
			this.Urban();
			this.Aww();
			this.Botclear();
			this.Botinfo();
			this.Changelog();
			this.Invite();
			this.Ping();
			this.Support();
			this.Uptime();
			this.Botnick();
			return this;
		}
		toJSON() {
			for (let cmd of this.Commands) {
				this.Commands.map((command) => command.toJSON());
			}
			return this.Commands;
		}
	}
}

export = Functions;
