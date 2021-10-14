import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class WarnCommand extends BaseCommand {
	constructor() {
		super(
			'warn',
			'moderation',
			[],
			'',
			'',
			'',
			[],
			[],
			[],
			[],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const user =
			message.mentions.members.first() ||
			message.guild.members.cache.find((user) => user.user.id == args[0]) ||
			message.guild.members.cache.find(
				(user) => user.user.username.toLowerCase() == args[0]?.toLowerCase()
			);

		const reason = args.slice(1).join(' ') || 'No reason given';

		if (!user) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'You must mention someone!',
			});
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
