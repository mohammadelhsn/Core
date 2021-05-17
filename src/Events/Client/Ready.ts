import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import Guild from '../../Utils/Structures/CachedGuild';

export default class ReadyEvent extends BaseEvent {
	constructor() {
		super('ready');
	}
	async run(client: DiscordClient) {
		console.log(`✅ | ${client.user.tag} has logged in!`);

		let status = `${client.guilds.cache.size} servers | ${client.users.cache.size} users`;
		client.user.setPresence({
			activity: { name: status, type: 'WATCHING' },
			status: 'dnd',
		});

		console.log(client.guilds.cache);

		/* 		for (const g of client.guilds.cache) {
			const self = this;
			const guildId = g[1].id;
			const Prefix = await this.Settings.Prefix(guildId, true, false);
			const Lang = await this.Translator.Getlang(guildId, true, false);
			const Memberlog = await this.Channels.Memberlog(guildId, true, false);
			const Modlog = await this.Channels.Modlog(guildId, true, false);
			const Rolelog = await this.Channels.Rolelog(guildId, true, false);
			const Appeals = await this.Channels.Appeals(guildId, true, false);
			const Reports = await this.Channels.Reports(guildId, true, false);
			const Actionlog = await this.Channels.Actionlog(guildId, true, false);
			const Suggestions = await this.Channels.Suggestions(guildId, true, false);
			const Messagelog = await this.Channels.Messagelog(guildId, true, false);
			const Serverlog = await this.Channels.Serverlog(guildId, true, false);
			const Invitelog = await this.Channels.Invitelog(guildId, true, false);
			const Channellog = await this.Channels.Channellog(guildId, true, false);
			const Emojilog = await this.Channels.Emojilog(guildId, true, false);
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
			const guild = new Guild({
				id: guildId,
				prefix: Prefix,
				lang: Lang,
				welcome: Welcome,
				leave: Leave,
				roles: {
					modrole: Modrole,
					adminrole: Adminrole,
					muterole: Muterole,
					warningrole: Warningrole,
				},
				Channels: {
					memberlog: Memberlog,
					modlog: Modlog,
					rolelog: Rolelog,
					appeals: Appeals,
					reports: Reports,
					actionlog: Actionlog,
					suggestions: Suggestions,
					messagelog: Messagelog,
					serverlog: Serverlog,
					invitelog: Invitelog,
					channellog: Channellog,
					emojilog: Emojilog,
					publicmodlog: Publicmodlog,
				},
				Strings: {
					error_message: this.Utils.Capitalize(
						this.Translator.Getstring(Lang, 'error_message')
					),
					generating: this.Utils.Capitalize(
						this.Translator.Getstring(Lang, 'generating')
					),
					SomeRandomAPI: `${this.Utils.Capitalize(
						this.Translator.Getstring(Lang, 'provided_by')
					)}: \`Some-Random-API\``,
					NekosFun: `${this.Utils.Capitalize(
						this.Translator.Getstring(Lang, 'provided_by')
					)}: \`Nekos Fun API\``,
					NekosBot: `${this.Utils.Capitalize(
						this.Translator.Getstring(Lang, 'provided_by')
					)}: \`Neko Bot API\``,
					NekosLife: `${this.Utils.Capitalize(
						this.Translator.Getstring(Lang, 'provided_by')
					)}: \`Nekos Life API\``,
					DiscordIG: `${this.Utils.Capitalize(
						this.Translator.Getstring(Lang, 'provided_by')
					)}: \`Discord-Image-Generation\``,
					Duncte123: `${this.Utils.Capitalize(
						this.Translator.Getstring(Lang, 'provided_by')
					)}: \`Duncte123 API\``,
					DogCeoAPI: `${this.Utils.Capitalize(
						this.Translator.Getstring(Lang, 'provided_by')
					)}: \`Dog CEO API\``,
					FunResponses: `${this.Utils.Capitalize(
						this.Translator.Getstring(Lang, 'provided_by')
					)}: \`Fun-Responses\``,
					Alexflipnote: `${this.Utils.Capitalize(
						this.Translator.Getstring(Lang, 'provided_by')
					)}: \`Alexflipnote API\``,
					status: this.Translator.Getstring(Lang, 'status'),
					category: this.Translator.Getstring(Lang, 'category'),
					working: this.Translator.Getstring(Lang, 'working'),
					name: this.Translator.Getstring(Lang, 'name'),
					aliases: this.Translator.Getstring(Lang, 'aliases'),
					usage: this.Translator.Getstring(Lang, 'usage'),
					description: this.Translator.Getstring(Lang, 'description'),
					accessible_by: this.Translator.Getstring(Lang, 'accessible_by'),
					permissions: this.Translator.Getstring(Lang, 'permissions'),
					subCommands: this.Translator.Getstring(Lang, 'sub_commands'),
					example: this.Translator.Getstring(Lang, 'example'),
					guild_only: this.Translator.Getstring(Lang, 'guildonly'),
					owner_only: this.Translator.Getstring(Lang, 'owner_only'),
					cooldown: this.Translator.Getstring(Lang, 'cooldown'),
					user_permissions: this.Translator.Getstring(Lang, 'user_permissions'),
					yes: this.Translator.Getstring(Lang, 'yes'),
					no: this.Translator.Getstring(Lang, 'no'),
					none: this.Translator.Getstring(Lang, 'none'),
					is_required: this.Translator.Getstring(Lang, 'is_required'),
					is_optional: this.Translator.Getstring(Lang, 'is_optional'),
					seconds: this.Translator.Getstring(Lang, 'seconds'),
				},
			});
			client.database.set(guildId, guild);
		} */
	}
}
