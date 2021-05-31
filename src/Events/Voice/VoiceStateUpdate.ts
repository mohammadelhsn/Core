import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { VoiceState } from 'discord.js';

export default class VoiceStateUpdateEvent extends BaseEvent {
	constructor() {
		super('voiceStateUpdate');
	}
	async run(client: DiscordClient, oldState: VoiceState, newState: VoiceState) {
		if (oldState.member.user.bot || newState.member.user.bot) return;
		if (oldState.channelID == null && newState.channelID != null) {
			// user joined the channel
		}
		if (oldState.channelID != null && newState.channelID == null) {
			// user left the channel
		}
		if (oldState.channelID != null && newState.channelID != null) {
			// user moved channels
		}
		return;
	}
}
