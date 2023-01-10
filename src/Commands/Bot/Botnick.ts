import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message, PermissionsBitField } from 'discord.js';

export default class BotnickCommand extends BaseCommand {
	constructor() {
		super(
			'botnick',
			'bot',
			[],
			'(new name)',
			'Re-name the bot',
			'',
			[],
			[],
			['ManageNicknames', 'Administrator', 'SendMessages', 'EmbedLinks'],
			['ManageNicknames', 'Administrator'],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		if (
			!message.member.permissions.has([
				PermissionsBitField.Flags.ManageNicknames ||
					PermissionsBitField.Flags.Administrator,
			])
		) {
			const embed = await this.ErrorEmbed.UserPermissions({
				accessor: message,
				text: this,
				perms: ['ManageNicknames', 'Administrator'],
			});

			return await message.reply({ embeds: [embed] });
		}

		if (
			!message.guild.members.me.permissions.has(
				PermissionsBitField.Flags.ManageNicknames
			)
		) {
			const embed = await this.ErrorEmbed.ClientPermissions({
				accessor: message,
				text: this,
				perms: ['ManageNicknames', 'Administrator'],
			});

			return await message.reply({ embeds: [embed] });
		}

		let name = args.join(' ');

		if (!name) name = 'Core';

		if (name.toLowerCase() == 'help') {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL(),
				command: this,
				accessor: message,
			});
		}

		try {
			const oldNickname = message.guild.members.me.nickname;

			await message.guild.members.me.setNickname(name);

			const embed = await this.SuccessEmbed.Base({
				accessor: message,
				text: this,
				success_message: `Successfully my nickname!`,
				fields: [
					{ name: 'Old nickname', value: `${oldNickname}` },
					{ name: 'New nickname', value: `${name}` },
				],
			});

			return await message.reply({ embeds: [embed] });
		} catch (error) {
			const embed = await this.ErrorEmbed.UnexpectedError({
				accessor: message,
				text: this,
			});

			return await message.reply({ embeds: [embed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
