import { Snowflake, Collection } from 'discord.js';
import {
	Cached_Guild,
	Welcome,
	Roles,
	Leave,
	Channels,
	events,
	new_events,
} from './Interfaces/CachedGuild';
import Helpers from '../Helpers';

export default class CachedGuild {
	protected _channels: Snowflake[];
	protected _roles: Snowflake[];
	public event_collection = new Collection<string, Helpers.BaseEventHelper>();
	public role_collection = new Collection<string, Helpers.BaseRoleHelper>();
	public Leave = new Collection<string, Helpers.Leave>();
	public Welcome = new Collection<string, Helpers.Welcome>();
	id: Snowflake;
	prefix: string;
	welcome: Welcome;
	roles: Roles;
	leave: Leave;
	Channels: Channels;
	Events: new_events;
	constructor(items: Cached_Guild) {
		this.id = items.id;
		this.prefix = items.prefix;
		this.welcome = items.welcome;
		this.roles = items.roles;
		this.leave = items.leave;
		this.Channels = items.Channels;
		this.Events = items.Events;
		this._channels = [];
		this._roles = [];

		if (
			this.Events.channelCreate.isEnabled() &&
			this.Events.channelCreate.channel != null
		) {
			this.event_collection.set(
				this.Events.channelCreate.channel,
				this.Events.channelCreate
			);
		}
		if (
			this.Events.channelDelete.isEnabled() &&
			this.Events.channelDelete.channel != null
		) {
			this.event_collection.set(
				this.Events.channelDelete.channel,
				this.Events.channelDelete
			);
		}
		if (
			this.Events.channelUpdate.isEnabled() &&
			this.Events.channelUpdate.channel != null
		) {
			this.event_collection.set(
				this.Events.channelUpdate.channel,
				this.Events.channelUpdate
			);
		}
		if (
			this.Events.emojiCreate.isEnabled() &&
			this.Events.emojiCreate.channel != null
		) {
			this.event_collection.set(
				this.Events.emojiCreate.channel,
				this.Events.emojiCreate
			);
		}
		if (
			this.Events.emojiDelete.isEnabled() &&
			this.Events.emojiDelete.channel != null
		) {
			this.event_collection.set(
				this.Events.emojiDelete.channel,
				this.Events.emojiDelete
			);
		}
		if (
			this.Events.emojiUpdate.isEnabled() &&
			this.Events.emojiUpdate.channel != null
		) {
			this.event_collection.set(
				this.Events.emojiUpdate.channel,
				this.Events.emojiUpdate
			);
		}
		if (
			this.Events.guildBanAdd.isEnabled() &&
			this.Events.guildBanAdd.channel != null
		) {
			this.event_collection.set(
				this.Events.guildBanAdd.channel,
				this.Events.emojiUpdate
			);
		}
		if (
			this.Events.guildBanRemove.isEnabled() &&
			this.Events.guildBanRemove.channel != null
		) {
			this.event_collection.set(
				this.Events.guildBanRemove.channel,
				this.Events.guildBanRemove
			);
		}
		if (
			this.Events.guildMemberAdd.isEnabled() &&
			this.Events.guildMemberAdd.channel != null
		) {
			this.event_collection.set(
				this.Events.guildMemberAdd.channel,
				this.Events.guildMemberAdd
			);
		}
		if (
			this.Events.guildMemberRemove.isEnabled() &&
			this.Events.guildMemberRemove.channel != null
		) {
			this.event_collection.set(
				this.Events.guildMemberRemove.channel,
				this.Events.guildMemberRemove
			);
		}
		if (
			this.Events.guildMemberUpdate.isEnabled() &&
			this.Events.guildMemberUpdate.channel != null
		) {
			this.event_collection.set(
				this.Events.guildMemberUpdate.channel,
				this.Events.guildMemberUpdate
			);
		}
		if (
			this.Events.guildUpdate.isEnabled() &&
			this.Events.guildUpdate.channel != null
		) {
			this.event_collection.set(
				this.Events.guildUpdate.channel,
				this.Events.guildUpdate
			);
		}
		if (
			this.Events.inviteCreate.isEnabled() &&
			this.Events.inviteCreate.channel != null
		) {
			this.event_collection.set(
				this.Events.inviteCreate.channel,
				this.Events.inviteCreate
			);
		}
		if (
			this.Events.inviteDelete.isEnabled() &&
			this.Events.inviteDelete.channel != null
		) {
			this.event_collection.set(
				this.Events.inviteDelete.channel,
				this.Events.inviteDelete
			);
		}
		if (
			this.Events.messageDelete.isEnabled() &&
			this.Events.messageDelete.channel != null
		) {
			this.event_collection.set(
				this.Events.messageDelete.channel,
				this.Events.messageDelete
			);
		}
		if (
			this.Events.messageDeleteBulk.isEnabled() &&
			this.Events.messageDeleteBulk.channel != null
		) {
			this.event_collection.set(
				this.Events.messageDeleteBulk.channel,
				this.Events.messageDeleteBulk
			);
		}
		if (
			this.Events.messageUpdate.isEnabled() &&
			this.Events.messageUpdate.channel != null
		) {
			this.event_collection.set(
				this.Events.messageUpdate.channel,
				this.Events.messageUpdate
			);
		}
		if (
			this.Events.voiceMemberJoin.isEnabled() &&
			this.Events.voiceMemberJoin.channel != null
		) {
			this.event_collection.set(
				this.Events.voiceMemberJoin.channel,
				this.Events.voiceMemberJoin
			);
		}
		if (
			this.Events.voiceMemberLeave.isEnabled() &&
			this.Events.voiceMemberLeave.channel != null
		) {
			this.event_collection.set(
				this.Events.voiceMemberLeave.channel,
				this.Events.voiceMemberLeave
			);
		}
		if (
			this.Events.voiceMemberMoved.isEnabled() &&
			this.Events.voiceMemberMoved.channel != null
		) {
			this.event_collection.set(
				this.Events.voiceMemberMoved.channel,
				this.Events.voiceMemberMoved
			);
		}
	}
}
