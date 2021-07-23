import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { GuildMember, MessageAttachment, TextChannel } from 'discord.js';
import canvas from 'discord-canvas';

export default class GuildMemberAddEvent extends BaseEvent {
	constructor() {
		super('guildMemberAdd');
	}
	async run(client: DiscordClient, member: GuildMember) {
		const welcomes = await this.Settings.WelcomeSystem(member.guild.id);
		const { guildMemberAdd } = await this.Settings.Events(member.guild.id);

		if (welcomes.isenabled == false && guildMemberAdd.enabled == false) return;

		if (welcomes.isenabled == true) {
			if (welcomes.media == 'image') {
				const channel = client.channels.cache.get(
					welcomes.channel
				) as TextChannel;

				if (channel.guild.id != member.guild.id) return;

				if (!channel) return;

				const welcomeCanvas = new canvas.Welcome();

				let image = await welcomeCanvas
					.setUsername(member.user.username)
					.setDiscriminator(member.user.discriminator)
					.setText(
						'message',
						welcomes.message
							.replace(/{user}/g, member.user.username)
							.replace(/{server}/g, member.guild.name)
							.replace(/{single}/, "'")
					)
					.setText('member-count', '- {count} member(s)!')
					.setMemberCount(member.guild.memberCount)
					.setGuildName(member.guild.name)
					.setAvatar(member.user.displayAvatarURL({ format: 'jpg' }))
					.setBackground('https://i.imgur.com/PKIbMhC.jpg')
					.setColor('title', this.Colours.cyan)
					.setColor('username', this.Colours.cyan)
					.setColor('hashtag', this.Colours.orange)
					.setColor('discriminator', this.Colours.cyan)
					.setColor('message', this.Colours.cyan)
					.setColor('member-count', this.Colours.orange)
					.toAttachment();

				const file = new MessageAttachment(image.toBuffer(), 'welcome.png');

				channel.send({ files: [file] });
			}

			if (welcomes.media == 'text') {
				const channel = client.channels.cache.get(
					welcomes.channel
				) as TextChannel;

				if (channel.guild.id != member.guild.id) return;

				if (!channel) return;

				const message = welcomes.message
					.replace(/{user}/g, this.Utils.Mentionuser(member.user.id))
					.replace(/{server}/g, member.guild.name)
					.replace(/{single}/g, "'");

				channel.send(message);
			}
		}
		if (guildMemberAdd.enabled == true) {
			const log = client.channels.cache.get(
				guildMemberAdd.channel
			) as TextChannel;

			if (log == null) return;

			const { user, guild } = member;

			const lang = await this.Translator.Getlang(guild.id);

			const embed = this.Embed.Base({
				iconURL: user.displayAvatarURL({ dynamic: true }),
				title: this.Translator.Getstring(lang, 'new_action'),
				text: 'Member join',
				description: 'Event: `New member`',
				fields: [
					{
						name: 'User',
						value: this.Utils.Mentionuser(user.id),
						inline: true,
					},
					{ name: 'User ID', value: `\`${user.id}\``, inline: true },
					{
						name: 'Created at',
						value: `\`${user.createdAt.toLocaleString(lang, {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}\``,
					},
				],
			});

			log.send({ embed: embed });
		}
		return;
	}
}
