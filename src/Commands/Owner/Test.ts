import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message, MessageEmbed, ReactionCollectorOptions } from 'discord.js';

export default class TestCommand extends BaseCommand {
	constructor() {
		super(
			'test',
			'owner',
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
		const embed1 = new MessageEmbed()
			.setTitle('Test')
			.setDescription('Test')
			.setColor(this.Colour.Set());

		const embed2 = new MessageEmbed()
			.setTitle('Test')
			.setDescription('Hello there')
			.setColor(this.Colour.Set());

		const paginationEmbed = async (
			msg: Message,
			pages: MessageEmbed[],
			emojiList: string[] = ['⏪', '⏩'],
			timeout: number = 120000
		) => {
			if (!msg && !msg.channel) throw new Error('Channel is inaccessible.');
			if (!pages) throw new Error('Pages are not given.');
			if (emojiList.length !== 2) throw new Error('Need two emojis.');
			let page = 0;
			const curPage = await msg.channel.send({
				embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
			});
			for (const emoji of emojiList) await curPage.react(emoji);

			const options: ReactionCollectorOptions = {
				filter: (reaction, user) =>
					emojiList.includes(reaction.emoji.name) && !user.bot,

				time: timeout,
			};

			const reactionCollector = curPage.createReactionCollector(options);

			reactionCollector.on('collect', (reaction, user) => {
				reaction.users.remove(msg.author.id);

				switch (reaction.emoji.name) {
					case emojiList[0]:
						page = page > 0 ? --page : pages.length - 1;
						break;
					case emojiList[1]:
						page = page + 1 < pages.length ? ++page : 0;
						break;
					default:
						break;
				}

				curPage.edit({
					embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
				});
			});

			reactionCollector.on('end', (_, reason) => {
				if (!curPage.deleted) {
					curPage.reactions.removeAll();
				}
			});
			return curPage;
		};

		return paginationEmbed(message, [embed1, embed2]);
	}
}
