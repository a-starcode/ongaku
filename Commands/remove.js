const { MessageEmbed } = require('discord.js');

const Command = require('../Structures/Command.js');

module.exports = new Command({
	name: "remove",
	description: "remove a song from the queue by passing its index",
	aliases: ["rm"],

	async run(msg, args, client) {
		const currentServerID = msg.guild.id;
		const subscription = client.globalSubscriptions.get(currentServerID);
		if (subscription) {
			if (!args[1]) 
				return msg.channel.send("enter index of song to remove dumdash"); 
			if (args.length > 2) 
				return msg.channel.send("only two arguments allowed, smh"); 
			if (isNaN(args[1])) 
				return msg.channel.send("need a gosh darn index, a **number**"); 
			const removeIndex = +args[1];
			if (removeIndex >= subscription.queue.length)
				return msg.channel.send("index should be less than the number of songs in the queue smartdash"); 
			if (removeIndex < 0)
				return msg.channel.send("you're such a pain in the dash, index cannot be negative"); 
			
			const songToRemove = subscription.queue[removeIndex];
			subscription.queue = 
			subscription.queue
			.filter((element) => element !== songToRemove);

			// if deleting the current playing song
			if (subscription.queueIndex === removeIndex) {
				subscription.queueIndex--;
				subscription.player.stop();
			} else msg.channel.send(`removed \`${songToRemove.title}\``);
			
		} 
		else
			msg.channel.send({ 
				embeds: [
					new MessageEmbed()
					.setColor("RANDOM")
					.setDescription("**you love excersing power don't you? wish you'd excersie your brain sometime too...join voice channel to remove a song genius**")
					.setImage("https://media1.tenor.com/images/063c00599ba64be7a8e7d1dffa01f80b/tenor.gif?itemid=11146618")
				] 
			});
	}
});