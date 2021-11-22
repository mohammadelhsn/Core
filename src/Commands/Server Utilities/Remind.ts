import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';
import ms from 'ms';

export default class RemindCommand extends BaseCommand {
	constructor() {
		super(
			'remind',
			'server utilities',
			['remindme'],
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
		const time = ms(args[0]);
		const reminder = args.slice(1).join(' ');

		if (!time || time <= 0) {
			return await message.reply({
				content: 'Invalid time! (Try: 2m for 2 minutes) ',
			});
		}

		if (!reminder) {
			return await message.reply({ content: 'You must specify a reminder!' });
		}

		await message.reply({
			content: `Timer set for ${ms(time, { long: true })}`,
		});

		setTimeout(() => {
			message.reply({
				content: `Hey, ${message.author.toString()} here is your reminder! ${reminder}`,
			});
		}, time);

		return;
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
