import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Message, TextChannel } from 'discord.js';

export default class MessageDeleteEvent extends BaseEvent {
	constructor() {
		super('messageDelete');
	}
	async run(client: DiscordClient, message: Message) {
		if (message.author.bot && message.author.id != client.user.id) return;

		const guild = message.guild;

		const cache = client.database.get(guild.id);

		if (cache.Events.messageDelete.isEnabled() == false) return;

		const channel = (await cache.Events.messageDelete.Get()).channel;

		if (!channel) return;

		const embed = await this.Embed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: `Message ID: ${message.id}`,
			title: `New action!`,
			description: `Event: \`Message deleted\``,
			fields: [
				{ name: 'Message author', value: `<@${message.author.id}>` },
				{ name: 'Deleted message', value: `"${message.content}"` },
				{
					name: 'Date',
					value: `${message.createdAt.toLocaleString('en-CA', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}`,
				},
				{ name: 'Message channel', value: `<#${message.channel.id}>` },
			],
		});

		if (
			message.author.id == client.user.id &&
			message.channel.id == channel.id
		) {
			const embed = message.embeds[0];

			return await (channel as TextChannel).send({ embeds: [embed] });
		}

		return await (channel as TextChannel).send({ embeds: [embed] });
	}
}
