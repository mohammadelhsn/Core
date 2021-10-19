import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	CommandInteraction,
	Message,
	MessageEmbed,
	ReactionCollectorOptions,
} from 'discord.js';

export default class TestCommand extends BaseCommand {
	constructor() {
		super(
			'test',
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
			false,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const embed = await this.ErrorEmbed.Base({
			accessor: message,
			text: this,
			iconURL: message.guild.iconURL({ dynamic: true }),
			error_message: 'Some cool success message',
		});
		const embed2 = await this.GeneratingEmbed.DiscordIG({
			accessor: message,
			text: this,
		});
		const image = await this.ImageEmbed.Base({
			accessor: message,
			text: this,
			image: message.author.displayAvatarURL({ dynamic: true }),
			title: 'Cool title',
			description: 'Cool description',
		});

		return await message.channel.send({ embeds: [embed, embed2, image] });
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const embed = await this.Embed.Base({
			accessor: interaction,
			title: 'Cool title ',
			description: 'Cool description',
			text: this,
		});

		return await interaction.reply({ embeds: [embed] });
	}
}
