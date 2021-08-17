import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, UserFlags } from 'discord.js';

export default class ServerinfoCommand extends BaseCommand {
	constructor() {
		super(
			'serverinfo',
			'server utilities',
			[],
			'',
			"See the server's information",
			'',
			[],
			[],
			['SEND_MESSAGES', 'EMBED_LINKS'],
			[],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const serverinfo = {
			name: `${message.guild.name}`,
			id: `${message.guild.id}`,
			ownerid: `${message.guild.ownerId}`,
			available: `\`${message.guild.available ? 'Yes' : 'No'}\``,
			large: `\`${message.guild.large ? 'Yes' : 'No'}\``,
			partnered: `\`${message.guild.partnered ? 'Yes' : 'No'}\``,
			verified: `\`${message.guild.verified ? 'Yes' : 'No'}\``,
			membercount: `\`${message.guild.memberCount}\``,
			humans: `\`${
				message.guild.members.cache.filter((member) => !member.user.bot).size
			}\``,
			bots: `\`${
				message.guild.members.cache.filter((member) => member.user.bot).size
			}\``,
			totalChannels: `\`${message.guild.channels.cache.size}\``,
			textChannels: `\`${
				message.guild.channels.cache.filter((ch) => ch.type === 'GUILD_TEXT')
					.size
			}\``,
			voiceChannels: `\`${
				message.guild.channels.cache.filter((ch) => ch.type === 'GUILD_VOICE')
					.size
			}\``,
			contentFilter: `\`${message.guild.explicitContentFilter}\``,
			verificationlvl: `\`${message.guild.verificationLevel}\``,
			createdAt: `\`${message.guild.createdAt}\``,
			boostCount: `\`${message.guild.premiumSubscriptionCount}\``,
			boostTier: `\`${message.guild.premiumTier}\``,
			roleCount: `\`${message.guild.roles.cache.size}\``,
			roles: `\`${message.guild.roles.cache
				.map((role) => role.toString())
				.join(' ')}\``,
		};

		if (args[0]) {
			if (args[0].toLowerCase().includes('help')) {
				return await this.HelpEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					command: this,
					message: message,
				});
			}
		} else {
			const serverinfoEmbed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `Serverinfo command`,
				description: `${serverinfo.name} serverinfo`,
				fields: [
					{ name: 'ID', value: `${serverinfo.id}` },
					{ name: 'Server owner ID:', value: `${serverinfo.ownerid}` },
					{ name: 'Created at:', value: `${serverinfo.createdAt}` },
					{
						name: 'Total channels',
						value: `${serverinfo.totalChannels}`,
						inline: true,
					},
					{
						name: 'Text channels',
						value: `${serverinfo.textChannels}`,
						inline: true,
					},
					{
						name: 'Voice channels',
						value: `${serverinfo.voiceChannels}`,
						inline: true,
					},
					{
						name: 'Membercount',
						value: `${serverinfo.membercount}`,
						inline: true,
					},
					{ name: 'Human count', value: `${serverinfo.humans}`, inline: true },
					{ name: 'Bot count', value: `${serverinfo.bots}`, inline: true },
				],
			});
			return message.channel.send({ embeds: [serverinfoEmbed] });
		}
	}
}
