import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';
import iso from 'iso-639-1';

export default class LanguageCommand extends BaseCommand {
	constructor() {
		super(
			'setlang',
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
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		if (!message.member.hasPermission(['ADMINISTRATOR'])) {
			const embed = await this.ErrorEmbed.UserPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				perms: ['ADMINISTRATOR'],
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		const language = args.join(' ');

		if (!language) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'You must specify a new language!',
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		const code = iso.getCode(language);

		if (!code) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'This language is not supported!',
			});

			const msg = await message.channel.send({ embed: embed });
			return msg.delete({ timeout: 10000 });
		}

		const con = await this.con.connect();

		try {
			await con.query(`BEGIN`);
			await con.query(
				`UPDATE Guilds SET lang = '${code}' WHERE guildid = '${message.guild.id}'`
			);
			await con.query(`COMMIT`);

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				success_message: `Successfully set guild language to \`${code}\``,
			});

			return message.channel.send({ embed: embed });
		} finally {
			con.release();
		}
	}
}
