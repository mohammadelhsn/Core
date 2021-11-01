import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class RedpandaCommand extends BaseCommand {
	constructor() {
		super(
			'redpanda',
			'aww',
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
		const gEmbed = await this.GeneratingEmbed.SomeRandomApi({
			accessor: message,
			text: this,
		});

		const m = await message.channel.send({ embeds: [gEmbed] });

		try {
			const res = await this.Animals.Redpanda();

			if (res.error == true) {
				await m.delete();

				const embed = await this.ErrorEmbed.ApiError({
					accessor: message,
					text: this,
				});

				return await message.channel.send({ embeds: [embed] });
			}

			const embed = await this.ImageEmbed.Base({
				accessor: message,
				text: this,
				title: 'Red panda command',
				description: `Fact: \`${res.text}\``,
				image: res.file,
			});

			await m.delete();
			return await message.channel.send({ embeds: [embed] });
		} catch (error) {
			// console.log(error);

			if (m.deleted == false) m.delete();

			const embed = await this.ErrorEmbed.UnexpectedError({
				accessor: message,
				text: this,
			});

			return await message.channel.send({ embeds: [embed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
