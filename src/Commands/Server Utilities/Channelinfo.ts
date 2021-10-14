import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message, TextChannel } from 'discord.js';

export default class ChannelinfoCommand extends BaseCommand {
	constructor() {
		super(
			'channelinfo',
			'server utilities',
			[],
			'(mention)',
			'Get a channels information',
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
		const channel =
			message.mentions.channels.first() ||
			message.guild.channels.cache.find((c) => c.name === args[0]) ||
			message.guild.channels.cache.find((c) => c.id === args[0]);

		if (!channel) {
			const channel = message.channel;

			const channelinfo = {
				name: (channel as TextChannel).name,
				id: channel.id,
				guild: (channel as TextChannel).guild.name,
				type: channel.type,
				createdAt: channel.createdAt,
				deleted: `${channel.deleted ? 'Yes' : 'No'}`,
				nsfw: `${(channel as TextChannel).nsfw ? 'Yes' : 'No'}`,
			};

			const embed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `Channelinfo command`,
				description: `<#${channelinfo.id}>`,
				fields: [
					{ name: 'Channel name:', value: `\`${channelinfo.name}\`` },
					{
						name: 'Channel type',
						value: `\`${this.Utils.Capitalize(channelinfo.type)}\``,
					},
					{ name: 'Deleted?', value: `\`${channelinfo.deleted}\`` },
					{ name: 'NSFW?', value: `\`${channelinfo.nsfw}\`` },
					{ name: 'Channel created at', value: `\`${channelinfo.createdAt}\`` },
				],
			});
			return message.channel.send({ embeds: embed });
		} else if (args[0].toLowerCase().includes('help')) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		} else {
			const channelinfo = {
				name: (channel as TextChannel).name,
				id: channel.id,
				guild: (channel as TextChannel).guild.name,
				type: channel.type,
				createdAt: channel.createdAt,
				deleted: `${channel.deleted ? 'Yes' : 'No'}`,
				nsfw: `${(channel as TextChannel).nsfw ? 'Yes' : 'No'}`,
			};

			const embed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: `${channelinfo.guild} Channelinfo`,
				description: `<#${channelinfo.id}>`,
				fields: [
					{ name: 'Channel name:', value: `\`${channelinfo.name}\`` },
					{
						name: 'Channel type',
						value: `\`${this.Utils.Capitalize(channelinfo.type)}\``,
					},
					{ name: 'Deleted?', value: `\`${channelinfo.deleted}\`` },
					{ name: 'NSFW?', value: `\`${channelinfo.nsfw}\`` },
					{ name: 'Channel created at', value: `\`${channelinfo.createdAt}\`` },
				],
			});
			return message.channel.send({ embeds: [embed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
