import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class RolesCommand extends BaseCommand {
	constructor() {
		super(
			'roles',
			'config',
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
			'WIP'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const toUpdate = args[0];
		const newValue =
			message.mentions.roles.first() ||
			message.guild.roles.cache.find((r) => r.name == args[1]) ||
			message.guild.roles.cache.find((r) => r.id == args[1]) ||
			'disable';

		if (!toUpdate) {
			// show current settings
		}

		if (
			toUpdate != 'adminrole' &&
			toUpdate != 'modrole' &&
			toUpdate != 'warningrole' &&
			toUpdate != 'muterole'
		) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				error_message: 'Not the right choice',
				text: this,
			});

			const msg: Message = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}
		if (!newValue) {
			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				error_message: 'Missing a required argumnent',
				text: this,
			});

			const msg: Message = await message.channel.send({ embed: errEmbed });
			return msg.delete({ timeout: 10000 });
		}
		// disable here
		if (newValue == 'disable') {
			return;
		}
		// update / enable here
	}
}
