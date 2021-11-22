import DiscordClient from '../Client/Client';
import Functions from './Functions';
import Types from './Structures/Interfaces/CachedGuild';

namespace Constructors {
	export class Welcome {
		public data: Types.Welcome;
		constructor(data?: Types.Welcome | string) {
			if (!data || data == undefined) {
				this.data = {
					isenabled: false,
					media: null,
					message: null,
					channel: null,
				};
			}

			if (typeof data == 'string') this.data = JSON.parse(data);
			if (typeof data == 'object') this.data = data;
		}
		toString(): string {
			return JSON.stringify(this.data);
		}
	}
	export class Leave {
		public data: Types.Leave;
		constructor(data?: Types.Leave | string) {
			if (!data || data == undefined) {
				this.data = {
					isenabled: false,
					media: null,
					message: null,
					channel: null,
				};
			}

			if (typeof data == 'string') this.data = JSON.parse(data);
			if (typeof data == 'object') this.data = data;
		}
		toString(): string {
			return JSON.stringify(this.data);
		}
	}
	export class Roles {
		public data: Types.Roles;
		constructor(data?: Types.Roles | string) {
			if (!data || data == undefined) {
				this.data = {
					modrole: null,
					warningrole: null,
					muterole: null,
					adminrole: null,
				};
			}
			if (typeof data == 'string') this.data = JSON.parse(data);
			if (typeof data == 'object') this.data = data;
		}
		toString(): string {
			return JSON.stringify(this.data);
		}
	}
	export class Logging {
		public data: Types.Channels;
		constructor(data?: Types.Channels | string) {
			if (!data || data == undefined) {
				this.data = {
					modlog: null,
					actionlog: null,
					appeals: null,
					reports: null,
					publicmodlog: null,
					suggestions: null,
				};
			}
			if (typeof data == 'string') this.data = JSON.parse(data);
			if (typeof data == 'object') this.data = data;
		}
		toString(): string {
			return JSON.stringify(this.data);
		}
	}
	export class Blacklisted {
		public data: Types.Blacklisted;
		constructor(data?: Types.Blacklisted | string) {
			if (!data || data == undefined) {
				this.data = {
					roles: [],
					users: [],
					channels: [],
				};
			}

			if (typeof data == 'string') this.data = JSON.parse(data);
			if (typeof data == 'object') this.data = data;
		}
		toString(): string {
			return JSON.stringify(this.data);
		}
	}
	export class Disabled {
		public data: Types.Disabled;
		constructor(data?: Types.Disabled | string) {
			if (!data || data == undefined) {
				this.data = {
					commands: [],
					categories: [],
				};
			}
			if (typeof data == 'string') this.data = JSON.parse(data);
			if (typeof data == 'object') this.data = data;
		}
		toString(): string {
			return JSON.stringify(this.data);
		}
	}
	export class Moderations {
		public data: Types.Moderations;
		constructor(data?: Types.Moderations | string) {
			if (!data || data == undefined) this.data = [];
			if (typeof data == 'string') this.data = JSON.parse(data);
			if (typeof data == 'object') this.data = data;
		}
		toString(): string {
			return JSON.stringify(this.data);
		}
	}
	export class Protected {
		public data: Types.Protected;
		constructor(data?: Types.Protected | string) {
			if (!data || data == undefined) {
				this.data = {
					users: [],
					roles: [],
				};
			}
			if (typeof data == 'string') this.data = JSON.parse(data);
			if (typeof data == 'object') this.data = data;
		}
		toString(): string {
			return JSON.stringify(this.data);
		}
	}
	export class Tags {
		public data: Types.Tags;
		constructor(data?: Types.Tags | string) {
			if (!data || data == undefined) this.data = [];
			if (typeof data == 'string') this.data = JSON.parse(data);
			if (typeof data == 'object') this.data = data;
		}
		toString(): string {
			return JSON.stringify(this.data);
		}
	}
	export class Ranks {
		public data: Types.Ranks;
		constructor(data?: Types.Ranks | string) {
			if (!data) this.data = [];
			if (typeof data == 'string') this.data = JSON.parse(data);
			if (typeof data == 'object') this.data = data;
		}
		toString(): string {
			return JSON.stringify(this.data);
		}
	}
	export class Notes {
		public data: Types.Notes;
		constructor(data?: Types.Notes | string) {
			if (!data) this.data = [];
			if (typeof data == 'string') this.data = JSON.parse(data);
			if (typeof data == 'object') this.data = data;
		}
		toString(): string {
			return JSON.stringify(this.data);
		}
	}
	export class Events {
		public data: Types.events;
		protected client: DiscordClient;
		constructor(data?: Types.events | string) {
			this.client = globalThis.client as DiscordClient;
			if (!data) {
				this.data = {
					channelCreate: {
						enabled: false,
						channel: null,
					},
					channelDelete: {
						enabled: false,
						channel: null,
					},
					channelUpdate: {
						enabled: false,
						channel: null,
					},
					emojiCreate: {
						enabled: false,
						channel: null,
					},
					emojiDelete: {
						enabled: false,
						channel: null,
					},
					emojiUpdate: {
						enabled: false,
						channel: null,
					},
					guildUpdate: {
						enabled: false,
						channel: null,
					},
					inviteCreate: {
						enabled: false,
						channel: null,
					},
					inviteDelete: {
						enabled: false,
						channel: null,
					},
					guildBanAdd: {
						enabled: false,
						channel: null,
					},
					guildBanRemove: {
						enabled: false,
						channel: null,
					},
					guildMemberAdd: {
						enabled: false,
						channel: null,
					},
					guildMemberRemove: {
						enabled: false,
						channel: null,
					},
					guildMemberUpdate: {
						enabled: false,
						channel: null,
					},
					messageDelete: {
						enabled: false,
						channel: null,
					},
					messageDeleteBulk: {
						enabled: false,
						channel: null,
					},
					messageUpdate: {
						enabled: false,
						channel: null,
					},
					voiceMemberJoin: {
						enabled: false,
						channel: null,
					},
					voiceMemberLeave: {
						enabled: false,
						channel: null,
					},
					voiceMemberMoved: {
						enabled: false,
						channel: null,
					},
				};
			}
			if (typeof data == 'string') this.data = JSON.parse(data);
			if (typeof data == 'object') this.data = data;
		}
		toString(): string {
			return JSON.stringify(this.data);
		}
	}
	export class Reminders {
		public data: Types.Reminders;
		constructor(data?: Types.Reminders | string) {
			if (!data) this.data = [];
			if (typeof data == 'string') this.data = JSON.parse(data);
			if (typeof data == 'object') this.data = data;
		}
		toString(): string {
			return JSON.stringify(this.data);
		}
	}
	export class Timers {
		public data: Types.Timers;
		constructor(data?: Types.Timers | string) {
			if (!data) this.data = [];
			if (typeof data == 'string') this.data = JSON.parse(data);
			if (typeof data == 'object') this.data = data;
		}
		toString(): string {
			return JSON.stringify(this.data);
		}
	}
}

export = Constructors;
