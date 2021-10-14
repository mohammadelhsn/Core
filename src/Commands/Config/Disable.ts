import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message, Permissions } from 'discord.js';

export default class DisableCommand extends BaseCommand {
	constructor() {
		super(
			'disable',
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
	): Promise<void | Message> {
		// prettier-ignore
		const categories = {
			aww: 'aww',
			bot: "bot",
			config: "config",
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

		const toDisable = args.join(' ');

		const value: BaseCommand | string =
			client.commands.get(toDisable) ||
			client.commands.get(client.aliases.get(toDisable)) ||
			categories[`${toDisable}`];

		const con = await this.con.connect();

		try {
			const disabled = await this.Settings.Disabled(message.guild.id);
			if (typeof value == 'string') {
				if (!disabled.data.categories.includes(value)) {
					if (value == 'bot' || value == 'config' || value == 'owner') {
						const embed = await this.ErrorEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							text: this,
							id: message.guild.id,
							error_message: 'You cannot disable this category',
						});

						const msg = await message.channel.send({ embeds: [embed] });
						return this.Utils.Delete(msg);
					}

					disabled.data.categories.push(value);

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
						success_message: `Successfully disabled category \`${value}\``,
					});

					return message.channel.send({ embeds: [embed] });
				}

				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message: 'This category is already disabled',
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}
			if (!disabled.data.commands.includes(value.getName())) {
				if (
					value.getCategory() == 'bot' ||
					value.getCategory() == 'config' ||
					value.getCategory() == 'owner'
				) {
					const embed = await this.ErrorEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
						error_message: 'You cannot disable commands from that category',
					});

					const msg = await message.channel.send({ embeds: [embed] });
					return this.Utils.Delete(msg);
				}

				disabled.data.commands.push(value.getName());

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
					success_message: `Successfully disabled \`${value.getName()}\``,
				});

				return message.channel.send({ embeds: [embed] });
			}
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message:
					'This command is already disabled or is not able to be disabled',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		} finally {
			con.release();
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
