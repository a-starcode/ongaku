const Command = require('../Structures/Command.js');

module.exports = new Command({
	name: "clear",
	description: "clear current song queue",
	aliases: ["clr"],

	async run(msg, args, client) {
		const currentServerID = msg.guild.id;
		const subscription = client.globalSubscriptions.get(currentServerID);
		if (subscription) {
			if (subscription.queue.length) {
				subscription.queue = [];
				subscription.player.stop();
			}
			msg.channel.send("queue cleared");
		} 
		else msg.channel.send("join a voice channel, then you can clear queue");
	}
});