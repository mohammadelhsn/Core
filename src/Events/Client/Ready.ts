import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import Guild from '../../Utils/Structures/CachedGuild';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import Collection from '@discordjs/collection';

export default class ReadyEvent extends BaseEvent {
	constructor() {
		super('ready');
	}
	async run(client: DiscordClient) {
		console.log(`✅ | ${client.user.tag} has logged in!`);

		let status = `${client.guilds.cache.size} servers | ${client.users.cache.size} users`;

		client.user.setPresence({
			activities: [{ name: status, type: 'WATCHING' }],
			status: 'online',
		});

		// const commands = this.Slash.All().toJSON();

		// const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

		// rest
		// 	.put(
		// 		Routes.applicationGuildCommands(client.user.id, '890636612839563325'),
		// 		{ body: commands }
		// 	)
		// 	.then(() => console.log('Successfully registered application commands.'))
		// 	.catch((err) => {
		// 		console.log(err);
		// 		console.log(err.errors);
		// 	});

		for (const g of client.guilds.cache) {
			const channels = [];
			const guildId = g[1].id;
			const Prefix = await this.Settings.Prefix(guildId, true, false);
			const Modlog = await this.Channels.Modlog(guildId, true, false);
			const Appeals = await this.Channels.Appeals(guildId, true, false);
			const Reports = await this.Channels.Reports(guildId, true, false);
			const Actionlog = await this.Channels.Actionlog(guildId, true, false);
			const Suggestions = await this.Channels.Suggestions(guildId, true, false);
			const Publicmodlog = await this.Channels.Publicmodlog(
				guildId,
				true,
				false
			);
			const Modrole = await this.Settings.Modrole(guildId, true, false);
			const Adminrole = await this.Settings.Adminrole(guildId, true, false);
			const Muterole = await this.Settings.Muterole(guildId, true, false);
			const Warningrole = await this.Settings.Warningrole(guildId, true, false);
			const Welcome = await this.Settings.WelcomeSystem(guildId, true, false);
			const Leave = await this.Settings.LeaveSystem(guildId, true, false);
			const Events = await this.Settings.Events(guildId, true);

			const guild = new Guild({
				id: guildId,
				prefix: Prefix,
				welcome: Welcome,
				leave: Leave,
				roles: {
					modrole: Modrole,
					adminrole: Adminrole,
					muterole: Muterole,
					warningrole: Warningrole,
				},
				Channels: {
					modlog: Modlog,
					appeals: Appeals,
					reports: Reports,
					actionlog: Actionlog,
					suggestions: Suggestions,
					publicmodlog: Publicmodlog,
				},
				Events: {
					channelCreate: new this.Helpers.ChannelCreate(Events, guildId),
					channelDelete: new this.Helpers.ChannelDelete(Events, guildId),
					channelUpdate: new this.Helpers.ChannelUpdate(Events, guildId),
					emojiCreate: new this.Helpers.EmojiCreate(Events, guildId),
					emojiDelete: new this.Helpers.EmojiDelete(Events, guildId),
					emojiUpdate: new this.Helpers.EmojiUpdate(Events, guildId),
					guildBanAdd: new this.Helpers.BanAdd(Events, guildId),
					guildBanRemove: new this.Helpers.BanRemove(Events, guildId),
					guildMemberAdd: new this.Helpers.MemberAdd(Events, guildId),
					guildMemberRemove: new this.Helpers.MemberRemove(Events, guildId),
					guildMemberUpdate: new this.Helpers.MemberUpdate(Events, guildId),
					inviteCreate: new this.Helpers.InviteCreate(Events, guildId),
					inviteDelete: new this.Helpers.InviteDelete(Events, guildId),
					voiceMemberJoin: new this.Helpers.VCJoin(Events, guildId),
					voiceMemberLeave: new this.Helpers.VCLeave(Events, guildId),
					voiceMemberMoved: new this.Helpers.VCMove(Events, guildId),
					guildUpdate: new this.Helpers.GuildUpdate(Events, guildId),
					messageDelete: new this.Helpers.MessageDelete(Events, guildId),
					messageDeleteBulk: new this.Helpers.BulkDelete(Events, guildId),
					messageUpdate: new this.Helpers.MessageUpdate(Events, guildId),
				},
			});
			client.database.set(guildId, guild);
		}
	}
}
