const Discord = require('discord.js');
const Command = require('./Command.js');
const FS = require('fs');
const MusicSubscription = require('./MusicSubscription.js');

const intents = new Discord.Intents(641);

class Client extends Discord.Client {
	constructor() {
		super({ 
			intents, 
			shards: "auto", 
			// partials: ["CHANNEL", "MESSAGE", "REACTION", "USER"] 
		});
		/**
		 * @typedef {Discord.Collection<string, Command>} 
		 */
		this.commands = new Discord.Collection();
			/**
		 * @typedef {Discord.Collection<string, MusicSubscription>} 
		 */
		this.globalSubscriptions = new Discord.Collection();
	}

	init(token) {
		// for every file that ends with .js, set the command name to the name of that file
		console.log("#========= Commands =========");
		FS.readdirSync('./Commands')
			.filter(file => file.endsWith(".js"))
			.forEach(file => {
			/**
			 * @type {Command}
			 */
			const command = require(`../Commands/${file}`); // our command file, ex: ping.js

			this.commands.set(command.name, command);
			console.log(`=> '${command.name}' command loaded`);
		});
		console.log("");
		this.login(token);
	}
}

module.exports = Client;