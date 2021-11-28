const Command = require('../Structures/Command.js');

module.exports = new Command({
	name: "ping",
	description: "check latency",
	aliases: [], 
	permissions: ["SEND_MESSAGES"],

	async run(msg, args, client) {
		msg.channel.send(`ping: ${client.ws.ping} ms`);
	}
});