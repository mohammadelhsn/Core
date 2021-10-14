import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message, Permissions } from 'discord.js';

export default class EnableCommand extends BaseCommand {
	constructor() {
		super(
			'enable',
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
	async run(
		client: DiscordClient,
		message: Message,
		args: string[]
	): Promise<Message | void> {
		if (
			!message.member.permissions.has([
				Permissions.FLAGS.MANAGE_GUILD || Permissions.FLAGS.ADMINISTRATOR,
			])
		) {
			const embed = await this.ErrorEmbed.UserPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				perms: ['MANAGE_GUILD', 'ADMINISTRATOR'],
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		const toEnable = args.join(' ');

		const categories = {
			aww: 'aww',
			bot: 'bot',
			config: 'config',
			canvas: 'canvas',
			facts: 'facts',
			fun: 'fun',
			logging: 'logging',
			manager: 'manager',
			memes: 'memes',
			owner: 'owner',
			miscellaneous: 'miscellaneous',
			moderation: 'moderation',
			music: 'music',
			'reaction images': 'reaction images',
			'server utilities': 'server utilities',
		};

		const value: BaseCommand | string =
			client.commands.get(toEnable) ||
			client.commands.get(client.aliases.get(toEnable)) ||
			categories[`${toEnable}`];

		const con = await this.con.connect();

		try {
			const disabled = await this.Settings.Disabled(message.guild.id);

			if (typeof value == 'string') {
				if (disabled.data.categories.includes(value)) {
					const newValue = disabled.data.categories.filter((c) => c != value);

					disabled.data.categories = newValue;

					await con.query(`BEGIN`);
					await con.query(
						`UPDATE Guilds SET disableditems = '${disabled.toString()}' WHERE guildid = '${
							message.guild.id
						}'`
					);
					await con.query(`COMMIT`);

					const embed = await this.SuccessEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						success_message: `Successfully enabled \`${value}\``,
					});

					return message.channel.send({ embeds: [embed] });
				}

				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message: 'This category is already enabled.',
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}
			if (disabled.data.commands.includes(value.getName())) {
				const newValue = disabled.data.commands.filter(
					(c) => c != value.getName()
				);

				disabled.data.commands = newValue;

				await con.query(`BEGIN`);
				await con.query(
					`UPDATE Guilds SET disableditems = '${disabled.toString()}' WHERE guildid = '${
						message.guild.id
					}'`
				);
				await con.query(`COMMIT`);

				const embed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					success_message: `Successfully enabled \`${value.getName()}\``,
				});

				return message.channel.send({ embeds: [embed] });
			}
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'This command is already enabled.',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		} finally {
			con.release();
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
