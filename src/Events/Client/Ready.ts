import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import Guild from '../../Utils/Structures/CachedGuild';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

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

		// const commands = [
		// 	new SlashCommandBuilder()
		// 		.setName('advice')
		// 		.setDescription('Sends you some advice'),
		// 	new SlashCommandBuilder().setName('baka').setDescription('B- BAKA!'),
		// 	new SlashCommandBuilder()
		// 		.setName('foxgirl')
		// 		.setDescription('Sends a picture of a foxgirl'),
		// 	new SlashCommandBuilder().setName('joke').setDescription('Sends a joke'),
		// 	new SlashCommandBuilder()
		// 		.setName('neko')
		// 		.setDescription('Sends a picture of a neko'),
		// 	new SlashCommandBuilder()
		// 		.setName('pickup')
		// 		.setDescription('Sends a pickup line 😏'),
		// 	new SlashCommandBuilder()
		// 		.setName('roast')
		// 		.setDescription('Sends a roast 🔥'),
		// 	new SlashCommandBuilder()
		// 		.setName('sexyrate')
		// 		.setDescription('Returns a rating of 100 for you or the mentioned user')
		// 		.addUserOption((opt) =>
		// 			opt
		// 				.setName('user')
		// 				.setDescription('The person whom you want to get a sexy rating for')
		// 				.setRequired(false)
		// 		),
		// 	new SlashCommandBuilder()
		// 		.setName('ship')
		// 		.setDescription('Ship people!')
		// 		.addUserOption((opt) =>
		// 			opt
		// 				.setName('user1')
		// 				.setDescription('First user who you want to ship')
		// 				.setRequired(true)
		// 		)
		// 		.addUserOption((opt) =>
		// 			opt
		// 				.setName('user2')
		// 				.setDescription('Second user who you want to ship')
		// 				.setRequired(false)
		// 		),
		// 	new SlashCommandBuilder()
		// 		.setName('simprate')
		// 		.setDescription("Get a user's simp rating")
		// 		.addUserOption((opt) =>
		// 			opt
		// 				.setName('user')
		// 				.setDescription('The person who you want to get a simp rating for')
		// 				.setRequired(false)
		// 		),
		// 	new SlashCommandBuilder()
		// 		.setName('waifu')
		// 		.setDescription('Generates a waifu, just for you!'),
		// 	new SlashCommandBuilder()
		// 		.setName('wallpaper')
		// 		.setDescription(
		// 			'Sends a picture of a wallpaper for you to use! (Mobile and PC wallpapers)'
		// 		),
		// 	new SlashCommandBuilder()
		// 		.setName('equelmemes')
		// 		.setDescription('Sends a meme from r/Equelmeme'),
		// 	new SlashCommandBuilder()
		// 		.setName('otmeme')
		// 		.setDescription('Sends a meme from the OT trilogy'),
		// 	new SlashCommandBuilder()
		// 		.setName('prequelmeme')
		// 		.setDescription('Sends a meme from r/Prequelmemes'),
		// 	new SlashCommandBuilder()
		// 		.setName('sequelmeme')
		// 		.setDescription('Sends a sequel meme'),
		// 	new SlashCommandBuilder()
		// 		.setName('anime')
		// 		.setDescription('Search an anime by name')
		// 		.addStringOption((opt) =>
		// 			opt
		// 				.setName('query')
		// 				.setDescription('The anime you want information about')
		// 				.setRequired(true)
		// 		),
		// 	new SlashCommandBuilder()
		// 		.setName('collection')
		// 		.setDescription('Search the Discord JS collection docs')
		// 		.addStringOption((opt) =>
		// 			opt
		// 				.setName('query')
		// 				.setDescription('Your collection query')
		// 				.setRequired(true)
		// 		),
		// 	new SlashCommandBuilder()
		// 		.setName('docs')
		// 		.setDescription('Search the Discord JS docs (stable)')
		// 		.addStringOption((opt) =>
		// 			opt
		// 				.setName('query')
		// 				.setDescription('Discord.js stable query')
		// 				.setRequired(true)
		// 		),
		// 	new SlashCommandBuilder()
		// 		.setName('google')
		// 		.setDescription('Do a google search using the bot!')
		// 		.addStringOption((opt) =>
		// 			opt
		// 				.setName('query')
		// 				.setDescription('Query for Google search')
		// 				.setRequired(true)
		// 		),
		// 	new SlashCommandBuilder()
		// 		.setName('lyrics')
		// 		.setDescription('Get the lyrics for any song')
		// 		.addStringOption((opt) =>
		// 			opt
		// 				.setName('query')
		// 				.setDescription('The song name you want lyrics of')
		// 				.setRequired(true)
		// 		),
		// 	new SlashCommandBuilder()
		// 		.setName('reddit')
		// 		.setDescription('Do a search for a subreddit or a reddit user')
		// 		.addSubcommand((sub) =>
		// 			sub
		// 				.setName('subreddit')
		// 				.setDescription('Search subreddits')
		// 				.addStringOption((opt) =>
		// 					opt
		// 						.setName('query')
		// 						.setDescription(
		// 							'A subreddit name you want to get information on'
		// 						)
		// 						.setRequired(true)
		// 				)
		// 		)
		// 		.addSubcommand((sub) =>
		// 			sub
		// 				.setName('user')
		// 				.setDescription('Search users on reddit')
		// 				.addStringOption((opt) =>
		// 					opt
		// 						.setName('query')
		// 						.setDescription(
		// 							'A reddit username you want to get information on'
		// 						)
		// 						.setRequired(true)
		// 				)
		// 		),
		// 	new SlashCommandBuilder()
		// 		.setName('roblox')
		// 		.setDescription('Get information on a ROBLOX user')
		// 		.addStringOption((opt) =>
		// 			opt
		// 				.setName('query')
		// 				.setDescription(
		// 					'ROBLOX username who you want to get information about'
		// 				)
		// 				.setRequired(true)
		// 		),
		// 	new SlashCommandBuilder()
		// 		.setName('youtube')
		// 		.setDescription('Get information on a YouTube video or YouTube channel')
		// 		.addSubcommand((sub) =>
		// 			sub
		// 				.setName('channel')
		// 				.setDescription('Get information on a YouTube channel')
		// 				.addStringOption((opt) =>
		// 					opt
		// 						.setName('query')
		// 						.setDescription('YouTube channel name')
		// 						.setRequired(true)
		// 				)
		// 		)
		// 		.addSubcommand((sub) =>
		// 			sub
		// 				.setName('video')
		// 				.setDescription('Get information on a video')
		// 				.addStringOption((opt) =>
		// 					opt
		// 						.setName('query')
		// 						.setDescription('Name of the video you want to search')
		// 						.setRequired(true)
		// 				)
		// 		),
		// 	new SlashCommandBuilder()
		// 		.setName('info')
		// 		.setDescription('Get information on a server / user / role / channel')
		// 		.addSubcommand((sub) =>
		// 			sub
		// 				.setName('user')
		// 				.setDescription('Get information on a user')
		// 				.addUserOption((opt) =>
		// 					opt
		// 						.setName('user')
		// 						.setDescription('User who you want to get information on')
		// 						.setRequired(false)
		// 				)
		// 		)
		// 		.addSubcommand((sub) =>
		// 			sub
		// 				.setName('role')
		// 				.setDescription('Get information on a role')
		// 				.addRoleOption((opt) =>
		// 					opt
		// 						.setName('role')
		// 						.setDescription('Role you want to get information on')
		// 						.setRequired(true)
		// 				)
		// 		)
		// 		.addSubcommand((sub) =>
		// 			sub
		// 				.setName('channel')
		// 				.setDescription('Get information on a channel')
		// 				.addChannelOption((opt) =>
		// 					opt
		// 						.setName('channel')
		// 						.setDescription('Channel you want to get information on')
		// 						.setRequired(false)
		// 				)
		// 		)
		// 		.addSubcommand((sub) =>
		// 			sub.setName('server').setDescription('Get information on the server')
		// 		),
		// 	new SlashCommandBuilder().setName('cry').setDescription('😢'),
		// 	new SlashCommandBuilder()
		// 		.setName('cuddle')
		// 		.setDescription('Cuddle the mentioned user')
		// 		.addUserOption((opt) =>
		// 			opt
		// 				.setName('user')
		// 				.setDescription('The user you want to cuddle')
		// 				.setRequired(true)
		// 		),
		// 	new SlashCommandBuilder().setName('facepalm').setDescription('🤦‍♂️🤦🤦‍♀️'),
		// 	new SlashCommandBuilder()
		// 		.setName('feed')
		// 		.setDescription('Feed the mentioned user')
		// 		.addUserOption((opt) =>
		// 			opt
		// 				.setName('user')
		// 				.setDescription('The user you want to feed')
		// 				.setRequired(true)
		// 		),
		// 	new SlashCommandBuilder()
		// 		.setName('hug')
		// 		.setDescription('Hug the mentioned user')
		// 		.addUserOption((opt) =>
		// 			opt
		// 				.setName('user')
		// 				.setDescription('The user you want to hug')
		// 				.setRequired(true)
		// 		),
		// 	new SlashCommandBuilder().setName('laugh').setDescription('🤣'),
		// 	new SlashCommandBuilder()
		// 		.setName('lick')
		// 		.setDescription('Lick the mentioned user')
		// 		.addUserOption((opt) =>
		// 			opt
		// 				.setName('user')
		// 				.setDescription('The user you want to lick')
		// 				.setRequired(true)
		// 		),
		// 	new SlashCommandBuilder()
		// 		.setName('mwah')
		// 		.setDescription('Kiss the mentioned user')
		// 		.addUserOption((opt) =>
		// 			opt
		// 				.setName('user')
		// 				.setDescription('The user you want to kiss')
		// 				.setRequired(true)
		// 		),
		// 	new SlashCommandBuilder()
		// 		.setName('pat')
		// 		.setDescription('Pat the mentioned user')
		// 		.addUserOption((opt) =>
		// 			opt
		// 				.setName('user')
		// 				.setDescription('The user you want to pat')
		// 				.setRequired(true)
		// 		),
		// 	new SlashCommandBuilder()
		// 		.setName('poke')
		// 		.setDescription('Poke the mentioned user')
		// 		.addUserOption((opt) =>
		// 			opt
		// 				.setName('user')
		// 				.setDescription('The user you want to poke')
		// 				.setRequired(true)
		// 		),

		// 	new SlashCommandBuilder()
		// 		.setName('slap')
		// 		.setDescription('Slap the mentioned user')
		// 		.addUserOption((opt) =>
		// 			opt
		// 				.setName('user')
		// 				.setDescription('The user you want to slap')
		// 				.setRequired(true)
		// 		),
		// 	new SlashCommandBuilder().setName('smug').setDescription('Smug'),
		// 	new SlashCommandBuilder()
		// 		.setName('tickle')
		// 		.setDescription('Tickle the mentioned user')
		// 		.addUserOption((opt) =>
		// 			opt
		// 				.setName('user')
		// 				.setDescription('The user you want to tickle')
		// 				.setRequired(true)
		// 		),
		// 	new SlashCommandBuilder().setName('wink').setDescription('wink'),
		// ].map((cmd) => cmd.toJSON());

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
