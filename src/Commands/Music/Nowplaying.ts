import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, User } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';

export default class NowPlayingCommand extends BaseCommand {
	constructor() {
		super(
			'nowplaying',
			'',
			['np'],
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
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'You are not in a voice channel',
			});
			const msg = await message.channel.send({ embed: errorEmbed });
			return msg.delete({ timeout: 10000 });
		}

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		/**
		 * @type {Player}
		 */
		const player = client.manager.players.get(message.guild.id);

		if (!player || !player.queue.current) {
			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'There is no music playing',
			});
			const msg = await message.channel.send({ embed: errEmbed });
			return msg.delete({ timeout: 10000 });
		}

		if (voiceChannel.id !== player.options.voiceChannel) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'You are not in the same voice channel as the player',
			});
			const msg = await message.channel.send({ embed: errorEmbed });
			return msg.delete({ timeout: 10000 });
		}
		try {
			const title = player.queue.current.title;
			const uri = player.queue.current.uri;
			const author = player.queue.current.author;
			const duration = player.queue.current.duration;

			/**
			 * This is not mine
			 * @author HOUND#0078 (430236084744749058) <https://canary.discord.com/channels/416512197590777857/479201157047123969/755313521356439614>
			 * Can be found by joining menudocs guild (https://discord.gg/menudocs)
			 */
			function nowplaying(duration, position) {
				let dashes = '----------------------------------------';
				let time = duration / 40;

				let pointer = Math.floor(position / time);

				let replacement = dashes.split('');
				replacement[pointer] = '+';

				let final = replacement.join('');

				return final;
			}

			const embed = await this.Embed.Base({
				iconURL: player.queue.current.thumbnail,
				text: this,
				title: title,
				description: `\`${prettyMilliseconds(player.position, {
					colonNotation: true,
				})}\` / \`${prettyMilliseconds(player.queue.current.duration, {
					colonNotation: true,
				})}\`**${nowplaying(duration, player.position)}**`,
				fields: [
					{ name: 'Duration', value: `\`${prettyMilliseconds(duration)}\`` },
					{ name: 'By', value: `\`${author}\`` },
					{
						name: 'Time left',
						value: `\`${prettyMilliseconds(duration - player.position)}\``,
					},
					{
						name: 'Requested by',
						value: `\`${(player.queue.current.requester as User).tag}\``,
					},
				],
				link: uri,
				image: player.queue.current.thumbnail,
			});

			return message.channel.send({ embed: embed });
		} catch (e) {
			console.log(e);

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});
			return message.channel.send({ embed: errEmbed });
		}
	}
}
