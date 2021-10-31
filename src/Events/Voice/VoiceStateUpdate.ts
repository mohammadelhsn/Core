import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Message, TextBasedChannels, VoiceState } from 'discord.js';

export default class VoiceStateUpdateEvent extends BaseEvent {
	constructor() {
		super('voiceStateUpdate');
	}
	async run(client: DiscordClient, oldState: VoiceState, newState: VoiceState) {
		// const guild = newState.guild;
		// const settings = await this.Settings.Events(guild.id);
		// const lang = await this.Translator.Getlang(guild.id);
		// if (oldState.member.user.bot || newState.member.user.bot) return;
		// if (oldState.channelId == null && newState.channelId != null) {
		// 	if (settings.voiceMemberJoin.enabled == false) return;
		// 	const channel = await this.Utils.FetchChannel(
		// 		settings.voiceMemberJoin.channel
		// 	);
		// 	if (!channel || channel.deleted == true) return;
		// 	const time = Date.now();
		// 	const embed = this.Embed.Base({
		// 		iconURL: newState.member.user.displayAvatarURL({ dynamic: true }),
		// 		title: this.Translator.Getstring(lang, 'new_action'),
		// 		text: 'Voice State Update',
		// 		description: 'Event: `User joined VC`',
		// 		fields: [
		// 			{ name: 'User', value: newState.member.toString() },
		// 			{ name: 'Old channel', value: `N/A` },
		// 			{ name: 'New channel', value: newState.channel.toString() },
		// 			{
		// 				name: 'Time',
		// 				value: `${new Date(time).toLocaleString(lang, {
		// 					weekday: 'long',
		// 					year: 'numeric',
		// 					month: 'long',
		// 					day: 'numeric',
		// 				})} ${new Date(time).toLocaleTimeString()}`,
		// 			},
		// 		],
		// 	});
		// 	return await (channel as TextBasedChannels).send({ embeds: [embed] });
		// }
		// if (oldState.channelId != null && newState.channelId == null) {
		// 	if (settings.voiceMemberLeave.enabled == false) return;
		// 	const channel = await this.Utils.FetchChannel(
		// 		settings.voiceMemberLeave.channel
		// 	);
		// 	if (!channel || channel.deleted == true) return;
		// 	const time = Date.now();
		// 	const embed = this.Embed.Base({
		// 		iconURL: newState.member.user.displayAvatarURL({ dynamic: true }),
		// 		title: this.Translator.Getstring(lang, 'new_action'),
		// 		text: 'Voice State Update',
		// 		description: 'Event: `User left VC`',
		// 		fields: [
		// 			{ name: 'User', value: newState.member.toString() },
		// 			{ name: 'Old channel', value: oldState.channel.toString() },
		// 			{ name: 'New channel', value: `N/A` },
		// 			{
		// 				name: 'Time',
		// 				value: `${new Date(time).toLocaleString(lang, {
		// 					weekday: 'long',
		// 					year: 'numeric',
		// 					month: 'long',
		// 					day: 'numeric',
		// 				})} ${new Date(time).toLocaleTimeString()}`,
		// 			},
		// 		],
		// 	});
		// 	return await (channel as TextBasedChannels).send({ embeds: [embed] });
		// }
		// if (oldState.channelId != null && newState.channelId != null) {
		// 	if (settings.voiceMemberMoved.enabled == false) return;
		// 	const channel = await this.Utils.FetchChannel(
		// 		settings.voiceMemberMoved.channel
		// 	);
		// 	if (!channel || channel.deleted == true) return;
		// 	const time = Date.now();
		// 	const embed = this.Embed.Base({
		// 		iconURL: newState.member.user.displayAvatarURL({ dynamic: true }),
		// 		title: this.Translator.Getstring(lang, 'new_action'),
		// 		text: 'Voice State Update',
		// 		description: 'Event: `Voice Member Moved`',
		// 		fields: [
		// 			{ name: 'User', value: newState.member.toString() },
		// 			{ name: 'Old channel', value: oldState.channel.toString() },
		// 			{ name: 'New channel', value: newState.channel.toString() },
		// 			{
		// 				name: 'Time',
		// 				value: `${new Date(time).toLocaleString(lang, {
		// 					weekday: 'long',
		// 					year: 'numeric',
		// 					month: 'long',
		// 					day: 'numeric',
		// 				})} ${new Date(time).toLocaleTimeString()}`,
		// 			},
		// 		],
		// 	});
		// 	return await (channel as TextBasedChannels).send({ embeds: [embed] });
		// }
		// return;
	}
}
