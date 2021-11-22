import { Role, TextChannel } from 'discord.js';
import DiscordClient from '../Client/Client';
import Functions from './Functions';
import StateManager from './StateManager';
import CachedGuildTypes from './Structures/Interfaces/CachedGuild';

namespace Helpers {
	interface ChannelData {
		channel: TextChannel;
		enabled: boolean;
	}

	interface RoleData {
		role: Role;
		enabled: boolean;
	}

	export abstract class BaseEventHelper {
		private _data: CachedGuildTypes.event;
		private _id: string;
		private _channel: string;
		private _enabled: boolean;
		private _client = globalThis.client as DiscordClient;

		constructor(data: CachedGuildTypes.event, id: string) {
			this._data = data;
			this._id = id;
			this._channel = data.channel;
			this._enabled = data.enabled;
		}
		abstract Type(): this;
		abstract Cache(): this;
		abstract Fetch(): Promise<this>;
		abstract Get(): Promise<ChannelData>;
		abstract Insert(value: string): Promise<void>;
		abstract Disable(): Promise<void>;

		get data(): CachedGuildTypes.event {
			return this._data;
		}
		get id(): string {
			return this._id;
		}
		get enabled(): boolean {
			return this._enabled;
		}
		get client(): DiscordClient {
			return this._client;
		}
		get channel(): string {
			return this._channel;
		}
	}
	export class ChannelCreate extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.channelCreate, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}
	export class ChannelDelete extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.channelDelete, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}
	export class ChannelUpdate extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.channelUpdate, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}
	export class EmojiUpdate extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.emojiUpdate, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		Cache() {
			return this;
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}
	export class EmojiCreate extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.emojiCreate, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}
	export class EmojiDelete extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.emojiDelete, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}
	export class GuildUpdate extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.guildUpdate, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}
	export class InviteCreate extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.inviteCreate, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}
	export class InviteDelete extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.inviteDelete, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}
	export class BanAdd extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.guildBanAdd, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}

	export class BanRemove extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.guildBanRemove, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}

	export class MemberAdd extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.guildMemberAdd, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}
	export class MemberRemove extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.guildMemberRemove, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}

	export class MemberUpdate extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.guildMemberUpdate, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}

	export class MessageDelete extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.messageDelete, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}

	export class BulkDelete extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.messageDeleteBulk, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}

	export class MessageUpdate extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.messageUpdate, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}

	export class VCJoin extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.voiceMemberJoin, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}
	export class VCLeave extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.voiceMemberLeave, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}

	export class VCMove extends BaseEventHelper {
		constructor(data: CachedGuildTypes.events, id: string) {
			super(data.voiceMemberMoved, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this.enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Get() {
			if (this.channel != null && this.isEnabled() == true) {
				const channel = (await new Functions.Utils().FetchChannel(
					this.channel
				)) as TextChannel;

				return { channel: channel, enabled: this.isEnabled() };
			}
			return { channel: null, enabled: this.isEnabled() };
		}
		async Insert() {
			return;
		}
		async Disable() {
			return;
		}
	}

	export abstract class BaseRoleHelper {
		protected _data: string;
		protected _id: string;
		protected _role: string;
		protected _enabled: boolean;
		protected client = globalThis.client as DiscordClient;
		constructor(data: string, id: string) {
			this._data = data;
			this._id = id;
			this._role = data;
			this._enabled = data != null ? true : false;
		}

		abstract Type(): this;
		abstract isEnabled(): boolean;
		abstract Fetch(): Promise<this>;
		abstract Cache(): this;
		abstract Insert(): Promise<this>;
		abstract Disable(): Promise<this>;
		abstract Get(): Promise<RoleData>;
	}

	export class Modrole extends BaseRoleHelper {
		constructor(data: CachedGuildTypes.Roles, id: string) {
			super(data.modrole, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this._enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Insert() {
			return this;
		}
		async Disable() {
			return this;
		}
		async Get() {
			const enabled = this.isEnabled();

			if (enabled && this._role != null) {
				const guild = this.client.guilds.cache.get(this._id);
				const role = guild.roles.cache.find((r) => r.id == this._role);

				return { role: role, enabled: enabled };
			}

			return { role: null, enabled: false };
		}
	}

	export class Warningrole extends BaseRoleHelper {
		constructor(data: CachedGuildTypes.Roles, id: string) {
			super(data.warningrole, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this._enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Insert() {
			return this;
		}
		async Disable() {
			return this;
		}
		async Get() {
			const enabled = this.isEnabled();

			if (enabled && this._role != null) {
				const guild = this.client.guilds.cache.get(this._id);
				const role = guild.roles.cache.find((r) => r.id == this._role);

				return { role: role, enabled: enabled };
			}

			return { role: null, enabled: false };
		}
	}
	export class Muterole extends BaseRoleHelper {
		constructor(data: CachedGuildTypes.Roles, id: string) {
			super(data.muterole, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this._enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Insert() {
			return this;
		}
		async Disable() {
			return this;
		}
		async Get() {
			const enabled = this.isEnabled();

			if (enabled && this._role != null) {
				const guild = this.client.guilds.cache.get(this._id);
				const role = guild.roles.cache.find((r) => r.id == this._role);

				return { role: role, enabled: enabled };
			}

			return { role: null, enabled: false };
		}
	}

	export class Adminrole extends BaseRoleHelper {
		constructor(data: CachedGuildTypes.Roles, id: string) {
			super(data.adminrole, id);
		}

		Type() {
			return this;
		}
		isEnabled() {
			return this._enabled;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Insert() {
			return this;
		}
		async Disable() {
			return this;
		}
		async Get() {
			const enabled = this.isEnabled();

			if (enabled && this._role != null) {
				const guild = this.client.guilds.cache.get(this._id);
				const role = guild.roles.cache.find((r) => r.id == this._role);

				return { role: role, enabled: enabled };
			}

			return { role: null, enabled: false };
		}
	}

	export class Leave {
		protected data: CachedGuildTypes.Leave;
		protected id: string;
		constructor(data: CachedGuildTypes.Leave, id: string) {
			this.data = data;
			this.id = id;
		}

		Type() {
			return this;
		}
		isEnabled() {
			return false;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Insert() {
			return this;
		}
		async Disable() {
			return this;
		}
		async Get() {}
	}

	export class Welcome {
		protected data: CachedGuildTypes.Welcome;
		protected id: string;
		constructor(data: CachedGuildTypes.Welcome, id: string) {
			this.data = data;
			this.id = id;
		}

		Type() {
			return this;
		}
		isEnabled() {
			return false;
		}
		async Fetch() {
			return this;
		}
		Cache() {
			return this;
		}
		async Insert() {
			return this;
		}
		async Disable() {
			return this;
		}
		async Get() {}
	}
}

export default Helpers;
