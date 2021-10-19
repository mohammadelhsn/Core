import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class MembercountCommand extends BaseCommand {
	constructor() {
		super(
			'membercount',
			'server utilities',
			[],
			'',
			'See the guild membercount',
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
		const membercount = {
			membercount: `${message.guild.memberCount}`,
			humanCount: `${
				message.guild.members.cache.filter((member) => !member.user.bot).size
			}`,
			botCount: `${
				message.guild.members.cache.filter((member) => member.user.bot).size
			}`,
			online: `${
				message.guild.members.cache.filter(
					(o) => o.presence.status === 'online'
				).size
			}`,
			idle: `${
				message.guild.members.cache.filter((i) => i.presence.status === 'idle')
					.size
			}`,
			dnd: `${
				message.guild.members.cache.filter(
					(dnd) => dnd.presence.status === 'dnd'
				).size
			}`,
			offline: `${
				message.guild.members.cache.filter(
					(off) => off.presence.status === 'offline'
				).size
			}`,
			guild: `${message.guild.name}`,
		};

		if (!args[0]) {
			const embed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Membercount command',
				description: `${membercount.guild} membercount!`,
				fields: [
					{
						name: 'Total membercount',
						value: `\`${this.Utils.FormatNumber(membercount.membercount)}\``,
					},
					{
						name: 'Human count',
						value: `\`${this.Utils.FormatNumber(membercount.humanCount)}\``,
					},
					{
						name: `${this.Emojis.bot_emoji} | Bot count`,
						value: `\`${this.Utils.FormatNumber(membercount.botCount)}\``,
					},
					{
						name: `${this.Emojis.online_emoji} | Members online`,
						value: `\`${this.Utils.FormatNumber(membercount.online)}\``,
					},
					{
						name: `${this.Emojis.idle_emoji} | Idle members`,
						value: `\`${this.Utils.FormatNumber(membercount.idle)}\``,
					},
					{
						name: `${this.Emojis.dnd_emoji} | DND members`,
						value: `\`${this.Utils.FormatNumber(membercount.dnd)}\``,
					},
					{
						name: `${this.Emojis.offline_emoji} | Offline/invisible members`,
						value: `\`${this.Utils.FormatNumber(membercount.offline)}\``,
					},
				],
			});

			return message.channel.send({ embeds: [embed] });
		}

		return await this.HelpEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			command: this,
			event: { message: message },
		});
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
