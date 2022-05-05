import * as FS from "fs"; 
import IConfiguration from "./config/IConfiguration";
import Server from "./Server";

require('console-stamp')(console, '[yyyy-mm-dd HH:MM:ss.l]');

if (!FS.existsSync("./config")) {
	FS.mkdirSync("./config");
}

if (!FS.existsSync("./config/config.json")) {
	console.log("Creating default configuration");
	let defaultConfig: IConfiguration = {
		port: 8080,
		scan_interval: 30,
		servers: []
	}
	FS.writeFileSync("./config/config.json", JSON.stringify(defaultConfig, null, 4), 'utf8');
}

const config: IConfiguration = JSON.parse(FS.readFileSync("./config/config.json", 'utf8'));

new Server(config);