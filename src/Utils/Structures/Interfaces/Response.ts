namespace Responses {
	export interface opts {
		error: boolean;
		error_type?: string;
		error_message?: string;
		file?: string;
		text?: string;
		id?: string | number;
		author?: string;
		title?: string;
		link?: string;
		misc?: object;
	}
	export type Duncte123Response = {
		success: boolean;
		data: {
			id: string | number;
			file: string;
		};
	};

	export type RandomCat = {
		file: string;
	};

	export type RandomDog = {
		message: string;
		status: string;
	};

	export type NekosLifeAnimal = {
		url: string;
	};

	export type SomeRandomApi = {
		image: string;
		fact: string;
	};

	export type ShibeOnline = [string];

	export type NekoBotCanvas = {
		message: string;
		status: number;
		success: boolean;
		version: string;
	};

	export type FactsResponse = {
		fact: string;
	};

	export type AdviceResponse = {
		slip: {
			id: number;
			advice: string;
		};
	};

	export type NekosLifeCat = {
		cat: string;
	};

	export type NekosLifeName = {
		name: string;
	};

	export type OwO_Response = {
		owo: string;
	};

	export type NekosLifeSpoiler = {
		text: string;
	};

	export type NekosLifeWhy = {
		why: string;
	};

	export type NekosFun = {
		image: string;
	};

	export type JokeResponse = {
		joke: string;
	};

	export type Post = {
		kind: string;
		data: {
			approved_at_utc: any;
			subreddit: string;
			selftext: string;
			author_fullname: string;
			saved: boolean;
			mod_reason_title: any;
			gilded: number;
			clicked: boolean;
			title: string;
			link_flair_richtext: [];
			subreddit_name_prefixed: string;
			hidden: boolean;
			pwls: number;
			link_flair_css_class: any;
			downs: number;
			thumbnail_height: number;
			top_awarded_type: any;
			hide_score: boolean;
			name: string;
			quarantine: boolean;
			link_flair_text_color: string;
			upvote_ratio: number;
			author_flair_background_color: any;
			subreddit_type: string;
			ups: number;
			total_awards_recieved: number;
			media_embed: {};
			thumbnail_width: number;
			author_flair_template_id: any;
			is_original_content: boolean;
			user_reports: [];
			secure_media: any;
			is_reddit_media_domain: boolean;
			is_meta: false;
			category: any;
			secure_media_embed: {};
			link_flair_text: any;
			can_mod_post: boolean;
			score: number;
			approved_by: any;
			author_premium: boolean;
			thumbnail: string;
			edited: boolean;
			author_flair_css_class: any;
			author_flair_richtext: [];
			gildings: {};
			post_hint: string;
			content_categories: any;
			is_self: boolean;
			mod_note: any;
			created: number;
			link_flair_type: string;
			wls: number;
			removed_by_category: any;
			banned_by: any;
			author_flair_type: string;
			domain: string;
			allow_live_comments: boolean;
			selftext_html: any;
			likes: any;
			suggested_sort: string;
			banned_at_utc: any;
			url_overridden_by_dest: string;
			view_count: any;
			archived: boolean;
			no_follow: boolean;
			is_crosspostable: boolean;
			pinned: boolean;
			over_18: boolean;
			preview: object;
			all_awardings: [];
			awarders: [];
			media_only: boolean;
			can_gild: boolean;
			spoiler: boolean;
			locked: boolean;
			author_flair_text: any;
			treatment_tags: [];
			visited: boolean;
			removed_by: any;
			num_reports: any;
			distinguished: any;
			subreddit_id: string;
			mod_reason_by: any;
			removal_reason: any;
			link_flair_background_color: string;
			id: string;
			is_robot_indexable: boolean;
			report_reasons: any;
			author: string;
			discussion_type: any;
			num_comments: number;
			send_replies: boolean;
			whitelist_status: string;
			contest_mode: boolean;
			mod_reports: [];
			author_patreon_flair: boolean;
			author_flair_text_color: any;
			permalink: string;
			parent_whitelist_status: string;
			stickied: boolean;
			url: string;
			subreddit_subscribers: number;
			created_utc: number;
			num_crossposts: number;
			media: any;
			is_video: boolean;
		};
	};

	export type Post_Data = {
		title: string;
		description: string;
		image: string;
		upvotes: number;
		downvotes: number;
		permalink: string;
		subreddit: string;
	};

	export type PostResponse = Post_Data[];

	export type Duncte123Meme = {
		success: boolean;
		data: {
			title: string;
			body: '';
			url: string;
			image: string;
		};
	};

	export type Anime = {
		id: string;
		type: string;
		links: {
			self: string;
		};
		attributes: {
			createdAt: string;
			updatedAt: string;
			slug: string;
			synopsis: string;
			description: string;
			coverImageTopOffset: number;
			titles: {
				en?: string;
				en_jp?: string;
				ja_jp?: string;
			};
			canonicalTitle: string;
			abbreviatedTitles: string[];
			averageRating: string;
			userCount: number;
			favoritesCount: number;
			startDate: string;
			endDate: string;
			nextRelease: string | null;
			popularityRank: number;
			ratingRank: number;
			ageRating: string;
			ageRatingGuide: string;
			subtype: string;
			status: string;
			tba: string;
			posterImage: {
				tiny: string;
				small: string;
				medium: string;
				large: string;
				original: string;
			};
			coverImage: {
				tiny: string;
				small: string;
				large: string;
				original: string;
			};
			episodeCount: number;
			episodeLength: number;
			totalLength: number;
			youtubeVideoId: string;
			nsfw: boolean;
		};
	};

	export type Emoji = {
		id: number;
		title: string;
		slug: string;
		image: string;
		description: string;
		category: number;
		license: string;
		source: string;
		faves: number;
		submitted_by: string;
		width: number;
		height: number;
		filesize: number;
	};

	export type Lyrics = {
		title: string;
		author: string;
		lyrics: string;
		thumbnail: {
			genius: string;
		};
		links: {
			genius: string;
		};
	};

	export type RedditUser = {
		kind: string;
		data: {
			is_employee: boolean;
			is_friend: boolean;
			subreddit: {
				default_set: boolean;
				user_is_contributor: any;
				banner_img: string;
				restrict_posting: true;
				user_is_banned: any;
				free_form_reports: boolean;
				community_icon: any;
				show_media: boolean;
				icon_color: string;
				display_name: string;
				header_img: any;
				title: string;
				priveous_names: string[];
				over_18: boolean;
				icon_size: number[];
				primary_color: string;
				icon_img: string;
				description: string;
				submit_link_label: string;
				header_size: any;
				is_default_icon: boolean;
				link_flair_position: string;
				display_name_prefixed: string;
				key_color: string;
				name: string;
				is_default_banner: boolean;
				url: string;
				quarantine: boolean;
				banner_size: any;
				user_is_moderator: any;
				public_description: string;
				link_flair_enabled: boolean;
				disable_contributor_requests: boolean;
				subreddit_type: string;
				user_is_subscriber: any;
			};
			snoovatar_size: any;
			awardee_karma: number;
			id: string;
			verified: boolean;
			is_gold: boolean;
			is_mod: boolean;
			awarder_karma: number;
			has_verified_email: boolean;
			icon_img: string;
			hide_from_robots: boolean;
			link_karma: number;
			total_karma: number;
			pref_show_snoovatar: boolean;
			name: string;
			created: number;
			created_utc: number;
			snoovatar_img: string;
			comment_karma: number;
			has_subscribed: boolean;
		};
	};

	export type Subreddit = {
		kind: string;
		data: {
			user_flair_background_color: any;
			submit_text_html: string;
			restrict_posting: boolean;
			user_is_banned: any;
			free_form_reports: boolean;
			wiki_enabled: boolean;
			user_is_muted: any;
			user_can_flair_in_sr: any;
			display_name: string;
			header_img: string;
			title: string;
			allow_galleries: boolean;
			icon_size: number[];
			primary_color: string;
			active_user_count: number;
			icon_img: string;
			display_name_prefixed: string;
			accounts_active: number;
			public_traffic: boolean;
			subscribers: number;
			user_flair_richtext: any[];
			videostream_links_count: number;
			name: string;
			quarantine: boolean;
			hide_ads: boolean;
			prediction_leaderboard_entry_type: string;
			emojis_enabled: boolean;
			advertiser_category: string;
			public_description: string;
			comment_score_hide_mins: number;
			allow_predictions: boolean;
			user_has_favorited: any;
			user_flair_template_id: any;
			community_icon: string;
			banner_background_image: string;
			original_content_tag_enabled: boolean;
			community_reviewd: boolean;
			submit_text: string;
			description_html: string;
			spoilers_enabled: boolean;
			header_title: string;
			header_size: number[];
			user_flair_position: string;
			all_original_content: boolean;
			has_menu_widget: boolean;
			is_enrolled_in_new_modmail: any;
			key_color: string;
			can_assign_user_flair: boolean;
			created: number;
			wls: number;
			show_media_preview: boolean;
			submission_type: string;
			user_is_subscribed: any;
			disable_contributor_requests: boolean;
			allow_videogifs: boolean;
			user_flair_type: string;
			allow_polls: boolean;
			collapse_deleted_comments: boolean;
			public_description_html: string;
			allow_videos: boolean;
			is_crosspostable_subreddit: boolean;
			notification_level: any;
			can_assign_link_flair: boolean;
			accounts_active_is_fuzzed: boolean;
			submit_text_label: string;
			link_flair_position: string;
			user_sr_flair_enabled: any;
			user_flair_enabled_in_sr: boolean;
			allow_discovery: boolean;
			user_sr_theme_enabled: boolean;
			link_flair_enabled: boolean;
			subreddit_type: string;
			suggested_comment_sort: any;
			banner_img: string;
			user_flair_text: any;
			banner_background_color: string;
			show_media: boolean;
			id: string;
			user_is_moderator: boolean;
			over18: boolean;
			description: string;
			submit_link_label: string;
			user_flair_text_color: any;
			restrict_commenting: boolean;
			allow_images: boolean;
			lang: string;
			whitelist_status: string;
			url: string;
			created_utc: number;
			banner_size: any;
			mobile_banner_img: string;
			user_is_contributor: any;
			allow_predictions_tournament: boolean;
		};
	};

	export type VanityURL = {
		response: {
			steamid: string;
			success: number;
		};
	};

	export type PlayerSummary = {
		steamid: string;
		personaname: string;
		profileurl: string;
		avatar: string;
		avatarmedium: string;
		avatarfull: string;
		personastate: number;
		communityvisibilitystate: number;
		profilestate: number;
		lastlogoff: number;
		commentpermission: number;
		realname?: string;
		primaryclanid?: string;
		timecreated?: number;
		personastateflags?: number;
		loccountrycode: string;
		locstatecode: string;
		loccityid: number;
	};

	export type PlayerSummaries = {
		response: {
			players: PlayerSummary[];
		};
	};

	export type PlayerBans = {
		SteamId: string;
		CommunityBanned: boolean;
		VACBanned: boolean;
		NumberOfVACBans: number;
		DaysSinceLastBan: number;
		NumberOfGameBans: number;
		EconomyBan: string;
	};

	export type PlayerBanRes = {
		players: PlayerBans[];
	};

	export type AnimuSRA = {
		link: string;
	};
}

export = Responses;
