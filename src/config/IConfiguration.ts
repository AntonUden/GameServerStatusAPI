import IServerConfiguration from "./IServerConfiguration";

export default interface IConfiguration {
	port: number,
	scan_interval: number,
	servers: IServerConfiguration[]
}