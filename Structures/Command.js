const Discord = require('discord.js');
const Client = require('./Client.js');

/** 
 * @param {Discord.Message | Discord.Interaction} msg 
 * @param {string[]} args 
 * @param {Client} client 
 */
function RunFunction(msg, args, client) {}

class Command {
	constructor(options) {
		/**
		 * @typedef { {name: string, description: string, aliases: string[], permissions: Discord.PermissionString[], run: RunFunction} } CommandOptions
		 * @param {CommandOptions} options
		 */
		this.name = options.name;
		this.description = options.description;
		this.aliases = options.aliases;
		this.permissions = options.permissions;

		this.run = options.run;
	}	
}

module.exports = Command;