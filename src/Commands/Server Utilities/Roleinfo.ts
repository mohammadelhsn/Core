import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, UserFlags } from 'discord.js';

export default class RoleinfoCommand extends BaseCommand {
	constructor() {
		super(
			'roleinfo',
			'server utilities',
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
		const role =
			message.guild.roles.cache.find((r) => r.name === args[0]) ||
			message.guild.roles.cache.find((r) => r.id === args[0]) ||
			message.mentions.roles.first();

		const roleinfo = {
			name: `\`${role.name}\``,
			colour: `${role.hexColor}`,
			id: `\`${role.id}\``,
			guild: `${role.guild.name}`,
			managed: `\`${role.managed ? 'Yes' : 'No'}\``,
			deleted: `\`${role.deleted ? 'Yes' : 'No'}\``,
			createdAt: `\`${role.createdAt}\``,
			mention: this.Utils.Mentionrole(role.id),
		};

		if (role) {
			const embed = this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				title: `${roleinfo.guild} role information`,
				description: `${roleinfo.mention} role information`,
				text: this,
				fields: [
					{ name: 'ID', value: roleinfo.id },
					{ name: 'Managed?', value: roleinfo.managed },
					{ name: 'Deleted', value: roleinfo.deleted },
					{ name: 'Created at', value: roleinfo.createdAt },
				],
			});

			embed.setColor(roleinfo.colour);
			return message.channel.send({ embed: embed });
		}

		return await this.HelpEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			command: this,
			message: message,
		});
	}
}
