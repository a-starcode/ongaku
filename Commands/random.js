const Command = require('../Structures/Command.js');

const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);


module.exports = new Command({
	name: "random",
	description: "shuffle current song queue beacuse you forgor to put -r",
	aliases: ["r", "shuffle"],

	async run(msg, args, client) {
		const currentServerID = msg.guild.id;
		const subscription = client.globalSubscriptions.get(currentServerID);
		if (subscription) {
			if (!subscription.queue.length)
				return msg.channel.send("nothing to shuffle, queue is empty uwuwuwuwu");
			
			subscription.queue = shuffleArray(subscription.queue);
			subscription.queueIndex = -1;
			subscription.player.stop();
			msg.channel.send("queue randomized");
		} 
		else msg.channel.send("join a voice channel, play a song, then you can shuffle...stupid beach");
	}
});