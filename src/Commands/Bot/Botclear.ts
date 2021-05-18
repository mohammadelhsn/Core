import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, TextChannel } from 'discord.js';

export default class BotClearCommand extends BaseCommand {
	constructor() {
		super(
			'botclear',
			'bot',
			[],
			'',
			'',
			'',
			[],
			[],
			[],
			['MANAGE_MESSAGES'],
			true,
			false,
			false,
			10000,
			'debug'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		if (!message.member.hasPermission(['MANAGE_MESSAGES' || 'ADMINISTRATOR'])) {
			const embed = await this.ErrorEmbed.UserPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		if (
			!message.guild.me.hasPermission(['MANAGE_MESSAGES' || 'ADMINISTRATOR'])
		) {
			const embed = await this.ErrorEmbed.ClientPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		const messages = await message.channel.messages.fetch({ limit: 100 });
		const botmessages: Message[] = [];
		messages
			.filter((m) => m.author.id == client.user.id)
			.forEach((msg) => {
				botmessages.push(msg);
			});

		try {
			await (message.channel as TextChannel).bulkDelete(botmessages);

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				success_message: `Successfully cleared \`${botmessages.length}\` message(s)`,
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		} catch (error) {
			console.log(error);

			const embed = await this.ErrorEmbed.UnexpectedError({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});

			return message.channel.send({ embed: embed });
		}
	}
}