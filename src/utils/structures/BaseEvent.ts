import DiscordClient from '../../client/client';
import StateManager from '../StateManager';

export default abstract class BaseEvent {
	con = StateManager.con;
	constructor(private name: string) {}

	getName(): string {
		return this.name;
	}
	abstract run(client: DiscordClient, ...args: any): void;
}
