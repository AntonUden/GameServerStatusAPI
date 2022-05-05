import { QueryResult } from "gamedig";

export default interface IServerResult {
	name: string,
	online: boolean,
	online_players: string[],
	online_players_count: number,
	result: QueryResult
}