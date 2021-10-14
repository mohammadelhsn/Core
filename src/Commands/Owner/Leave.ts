import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class TesstCommand extends BaseCommand {
	constructor() {
		super(
			'botleave',
			'owner',
			[],
			'',
			'',
			'',
			[],
			[],
			[],
			[],
			true,
			true,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		let guild = client.guilds.cache.get(args[0]);

		if (!guild) guild = message.guild;

		guild.leave();

		const embed = await this.SuccessEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			id: message.guild.id,
			success_message: `Successfully left ${guild.name}`,
		});

		return message.channel.send({ embeds: [embed] });
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
