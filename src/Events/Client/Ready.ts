import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import Guild from '../../Utils/Structures/CachedGuild';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import Functions from '../../Utils/Functions';

export default class ReadyEvent extends BaseEvent {
	constructor() {
		super('ready');
	}
	async run(client: DiscordClient) {
		console.log(`✅ | ${client.user.tag} has logged in!`);

		let status = `${client.guilds.cache.size} servers | ${client.users.cache.size} users`;

		client.user.setPresence({
			activities: [{ name: status, type: 'WATCHING' }],
			status: 'dnd',
		});

		const commands = new Functions.SlashCommands()
			.All()
			.toArray()
			.map((cmd) => cmd.toJSON());

		const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

		rest
			.put(
				Routes.applicationGuildCommands(client.user.id, '890636612839563325'),
				{ body: commands }
			)
			.then(() => console.log('Successfully registered application commands.'))
			.catch((err) => {
				console.log(err);
				console.log(err.errors);
			});

		for (const g of client.guilds.cache) {
			const guildId = g[1].id;
			const Prefix = await this.Settings.Prefix(guildId, true, false);
			const Lang = await this.Translator.Getlang(guildId, true, false);
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
			const Events = await this.Settings.Events(guildId, true, false);
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
					modlog: Modlog,
					appeals: Appeals,
					reports: Reports,
					actionlog: Actionlog,
					suggestions: Suggestions,
					publicmodlog: Publicmodlog,
				},
				Events: {
					channelCreate: Events.channelCreate,
					channelDelete: Events.channelDelete,
					channelUpdate: Events.channelUpdate,
					emojiCreate: Events.emojiCreate,
					emojiDelete: Events.emojiDelete,
					emojiUpdate: Events.emojiUpdate,
					guildBanAdd: Events.guildBanAdd,
					guildBanRemove: Events.guildBanRemove,
					guildMemberAdd: Events.guildBanAdd,
					guildMemberRemove: Events.guildMemberRemove,
					guildMemberUpdate: Events.guildMemberUpdate,
					inviteCreate: Events.inviteCreate,
					inviteDelete: Events.inviteDelete,
					voiceMemberJoin: Events.voiceMemberJoin,
					voiceMemberLeave: Events.voiceMemberLeave,
					voiceMemberMoved: Events.voiceMemberMoved,
					guildUpdate: Events.guildUpdate,
					messageDelete: Events.messageDelete,
					messageDeleteBulk: Events.messageDeleteBulk,
					messageUpdate: Events.messageUpdate,
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
		}
	}
}
