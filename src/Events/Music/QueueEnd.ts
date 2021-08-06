import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Player } from 'erela.js';
import { TextChannel } from 'discord.js';

export default class QueueEndEvent extends BaseEvent {
	constructor() {
		super('queueEnd');
	}
	async run(client: DiscordClient, player: Player) {
		const channel = client.channels.cache.get(
			player.textChannel
		) as TextChannel;
		const lang = await this.Translator.Getlang(channel.guild.id);
		const embed = await this.Embed.Base({
			iconURL: channel.guild.iconURL({ dynamic: true }),
			text: 'Queue end',
			title: 'Queue has ended',
			description: `${this.Utils.Capitalize(
				this.Translator.Getstring(lang, 'provided_by')
			)}: \`Lavalink\``,
		});
		channel.send({ embed: embed });
		player.destroy();
	}
}
