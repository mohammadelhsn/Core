import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class ChangelogCommand extends BaseCommand {
	constructor() {
		super(
			'changelog',
			'bot',
			[],
			'',
			'Sends an embed containing the most recent changes',
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
		const embed = await this.Embed.Base({
			accessor: message,
			text: this,
			title: 'Changelog command',
			description: `${client.version} changelog`,
			fields: [
				{ name: 'Additions', value: `Slash commands!!` },
				{ name: 'Modifications', value: `Lots of bug fixes` },
				{
					name: 'Removals',
					value: `Userinfo, Serverinfo, Roleinfo and Channelinfo have been combined to one command, they still show up for commands as I haven't yet removed them until the code is 100% working`,
				},
			],
		});

		return await message.reply({ embeds: [embed] });
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const embed = this.Embed.Base({
			accessor: interaction,
			text: this,
			title: 'Changelog command',
			description: `${client.version} changelog`,
			fields: [
				{ name: 'Additions', value: `Slash commands!!` },
				{ name: 'Modifications', value: `Lots of bug fixes` },
				{
					name: 'Removals',
					value: `Userinfo, Serverinfo, Roleinfo and Channelinfo have been combined to one command, they still show up for commands as I haven't yet removed them until the code is 100% working`,
				},
			],
		});

		return await interaction.reply({ embeds: [embed] });
	}
}
