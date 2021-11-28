const Command = require('../Structures/Command.js');

module.exports = new Command({
	name: "prev",
	description: "go to previous song in queue",
	aliases: [],

	async run(msg, args, client) {
		const currentServerID = msg.guild.id;
		const subscription = client.globalSubscriptions.get(currentServerID);
		if (subscription) {
			subscription.player.stop();
			if (subscription.queueIndex === 0) 
				subscription.queueIndex = subscription.queue.length - 2;
			else subscription.queueIndex -= 2;
		} 
		else msg.channel.send("hey hey hey, join a voice channel & play some music first");
	}
});