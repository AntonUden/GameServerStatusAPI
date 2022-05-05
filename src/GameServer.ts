import { QueryOptions, QueryResult, query } from "gamedig";

export default class GameServer {
	public name: string;
	public ignoreEmptyPlayers: boolean;
	public queryOptions: QueryOptions;
	public result: QueryResult | null;
	public online: boolean;

	constructor(name: string, queryOptions: QueryOptions, ignoreEmptyPlayers: boolean) {
		this.name = name;
		this.queryOptions = queryOptions;
		this.ignoreEmptyPlayers = ignoreEmptyPlayers;
		this.result = null;
		this.online = false;
	}

	public async scan(): Promise<void> {
		try {
			this.result = await query(this.queryOptions);
			this.online = true;
		} catch (err) {
			this.result = null;
			this.online = false;
		}
	}
}