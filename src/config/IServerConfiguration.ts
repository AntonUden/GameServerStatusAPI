import { QueryOptions } from "gamedig";

export default interface IServerConfiguration {
	name: string,
	query_options: QueryOptions,
	ignore_empty_player_objects?: boolean | undefined
}