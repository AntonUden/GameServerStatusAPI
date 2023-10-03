import IConfiguration from "./config/IConfiguration";
import HTTP from "http";
import Express from "express";
import GameServer from "./GameServer";
import IServerResult from "./IServerResult";
import * as Cors from "cors";

export default class Server {
	private _express: Express.Express;
	private _http: HTTP.Server;
	private _config: IConfiguration;

	private _gameServers: GameServer[];

	constructor(config: IConfiguration) {
		this._gameServers = [];

		this._config = config;

		this._config.servers.forEach(srv => {
			console.log("Adding server " + srv.name + " with type " + srv.query_options.type);
			this._gameServers.push(new GameServer(srv.name, srv.query_options, srv.ignore_empty_player_objects === true));
		});

		this._express = Express();
		this._express.set("port", config.port);

		this._express.use(Cors.default());

		this._http = new HTTP.Server(this._express);

		this._http.listen(config.port, function () {
			console.log("Listening on port: " + config.port);
		});

		this._express.get("/servers", async (req: any, res: any) => {
			let result: string[] = [];

			this._gameServers.forEach(server => result.push(server.name));

			res.header("Content-Type", 'application/json');
			res.send(JSON.stringify(result, null, 4));
		});

		this._express.get("/status/:name", async (req: any, res: any) => {
			let name: string = req.params.name;

			let server: GameServer | null = this._gameServers.find(s => s.name == name);

			if (server == null) {
				res.status(404).send("404: Server not found");
				return;
			}

			let onlineNames: string[] = [];
			let onlineCount: number = 0;

			if (server.result != null) {
				server.result.players.forEach(player => {
					if (server.ignoreEmptyPlayers) {
						if (player.raw != null) {
							if (Object.keys(player.raw).length == 0) {
								return;
							}
						}
					}

					if (player.name != null) {
						onlineNames.push(player.name);
					}
					onlineCount++;
				});
			}

			res.header("Content-Type", 'application/json');
			res.send(JSON.stringify({
				name: server.name,
				online: server.online,
				online_players: onlineNames,
				online_players_count: onlineCount,
				result: server.result
			}, null, 4));
		});

		this._express.get("/all", async (req: any, res: any) => {
			let result: IServerResult[] = [];

			this._gameServers.forEach(server => {
				let onlineNames: string[] = [];
				let onlineCount: number = 0;

				if (server.result != null) {
					server.result.players.forEach(player => {
						if (server.ignoreEmptyPlayers) {
							if (player.raw != null) {
								if (Object.keys(player.raw).length == 0) {
									return;
								}
							}
						}

						if (player.name != null) {
							onlineNames.push(player.name);
						}
						onlineCount++;
					});
				}

				result.push({
					name: server.name,
					online: server.online,
					online_players: onlineNames,
					online_players_count: onlineCount,
					result: server.result
				});
			})


			res.header("Content-Type", 'application/json');
			res.send(JSON.stringify(result, null, 4));
		});

		console.log("Starting initial scan");
		this.scanAll();

		setInterval(() => {
			this.scanAll();
		}, this._config.scan_interval * 1000);
	}

	public async scanAll(): Promise<void> {
		this._gameServers.forEach(async (server) => await server.scan());
	}
}