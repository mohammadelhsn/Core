import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class BotnickCommand extends BaseCommand {
	constructor() {
		super('botnick', '', []);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		if (
			!message.member.hasPermission(['MANAGE_NICKNAMES' || 'ADMINISTRATOR'])
		) {
			const embed = await this.ErrorEmbed.UserPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		if (!message.guild.me.hasPermission(['MANAGE_NICKNAMES'])) {
			const embed = await this.ErrorEmbed.ClientPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		let name = args.join(' ');

		if (!name) name = 'Core';

		if (name.toLowerCase() == 'help') {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		try {
			const oldNickname = message.guild.me.nickname;

			await message.guild.me.setNickname(name);

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				success_message: `Successfully set my name to \`${name}\``,
			});

			return message.channel.send({ embed: embed });
		} catch (error) {
			const embed = await this.ErrorEmbed.UnexpectedError({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});

			return message.channel.send({ embed: embed });
		}
	}
}
