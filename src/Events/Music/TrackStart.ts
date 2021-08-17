import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Player, Track } from 'erela.js';
import prettyMilliseconds from 'pretty-ms';
import { TextChannel, User } from 'discord.js';

export default class TrackStartEvent extends BaseEvent {
	constructor() {
		super('trackStart');
	}
	async run(client: DiscordClient, player: Player, track: Track) {
		const channel = client.channels.cache.get(player.textChannel);
		const requester = track.requester as User;
		const user = await client.users.cache.get(requester.id);

		const embed = await this.ImageEmbed.Base({
			iconURL: user.displayAvatarURL({ dynamic: true }),
			text: 'Now playing',
			title: 'Now playing',
			description: `\`${track.title}\``,
			image: track.thumbnail,
			link: track.uri,
			fields: [
				{ name: 'Requested by:', value: `${requester.tag}` },
				{
					name: 'Duration',
					value: `\`${prettyMilliseconds(track.duration)}\``,
				},
			],
		});
		return (channel as TextChannel).send({ embeds: [embed] });
	}
}
