const Command = require('../Structures/Command.js');

module.exports = new Command({
	name: "skip", // "-n 5" "5" +"5" = int(5)
	description: "skip to next song in queue, optionally enter index of song to skip to that song in the queue",
	aliases: ["next", "n"],

	async run(msg, args, client) {
		const currentServerID = msg.guild.id;
		const subscription = client.globalSubscriptions.get(currentServerID);
		
		if (subscription) {
			if (!args[1]) subscription.player.stop();
			else if (isNaN(args[1])) 
				msg.channel.send("index has to be a number motherfudger");
			else {
				const songIndex = +args[1];
				subscription.queueIndex = songIndex - 1;
				subscription.player.stop();
			}
		}
		else 
			msg.channel.send("join a voice channel, play a song, then you can skip...stupid beach");
	}
});