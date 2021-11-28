const { MessageEmbed } = require('discord.js');

const Command = require('../Structures/Command.js');

module.exports = new Command({
	name: "queue",
	description: "view current queue",
	aliases: ["q"],

	async run(msg, args, client) {
		
		const currentServerID = msg.guild.id;
		const subscription = client.globalSubscriptions.get(currentServerID);
		if (subscription) {
			if (subscription.queue.length === 0)
				return msg.channel.send("queue is empty uwuwuuwuwu");
			// discord only supports upto 25 fields max inside one embed (if not inline) 
			const groupsOfTheseManySongs = 20; // for each embed (could be any number)
		
			const numOfSongsToDisplay = +args[1]; // may or may not be passed as an arg so it would be null
			// NOTE: (null/undefined > some_number) gives false
			if (numOfSongsToDisplay > subscription.queue.length)
				return msg.channel.send({ embeds: [embedReply(1)] });
			if (numOfSongsToDisplay > 10) // 10 for no reason, could change it to any
				return msg.channel.send({ embeds: [embedReply(0, numOfSongsToDisplay)] });

			// if the argument was passed 
			if (numOfSongsToDisplay) {
				return msg.channel.send({ 
					embeds: [
						createSongQueueEmbed(
							numOfSongsToDisplay, 
							subscription.queueIndex, 
							subscription.queueIndex, 
							subscription.queue)
						] 
				});
			} else { // now we know that the argument was not passed
				// so we need to calculate if all the songs in the queue would fit in a single embed or not
				const numberOfEmbeds = 
				Math.ceil(subscription.queue.length / groupsOfTheseManySongs);

				// if songs are less, then only one embed is sufficient, so print all the songs in that one embed
				if (numberOfEmbeds === 1) {
					return msg.channel.send({ 
						embeds: [
							createSongQueueEmbed(
								subscription.queue.length, 
								1, 
								subscription.queueIndex, 
								subscription.queue)
							] 
					});
				}
				else { // too many songs, so we need to make an array of embeds
					let queueEmbeds = [];
					for (let i = 0; i < numberOfEmbeds; i++) {
						queueEmbeds.push(new MessageEmbed().setColor("RANDOM")); 
						// add "groupsOfTheseManySongs" fields (with song name and title) to this embed
						for (let j = i*groupsOfTheseManySongs; j < (i+1)*groupsOfTheseManySongs; j++) { // some maths to create embeds
							const song = subscription.queue[j];
							if (!song) break;
							if (j === subscription.queueIndex)
								queueEmbeds[i] = queueEmbeds[i].addField(`[${i}] ——— CURRENTLY PLAYING ↴`, `${song.title}`, false);
							else 
								queueEmbeds[i] = queueEmbeds[i].addField(`[${j}]`, `${song.title}`, false);
						} // move on to next embed with next set of songs
					}
					queueEmbeds[0] = queueEmbeds[0].setTitle("🎵  CURRENT QUEUE  🎵"); // set title on the first one
					msg.channel.send({ embeds: queueEmbeds });
				}
			}
		} 
		else 
			msg.channel.send("for the love of God, i'm not playing in the voice channel, i can't show no queue");
	}
});

const createSongQueueEmbed = (numOfSongsToDisplay, fromQueueIndex, nowPlayingSongIndex, songQueue) => {
	let queueEmbed = new MessageEmbed()
	.setColor("RANDOM")
	.setTitle("🎵  CURRENT QUEUE  🎵");
	
	let count = 0;
	let i = fromQueueIndex - 1;
	let lastSongIndex = fromQueueIndex + numOfSongsToDisplay - 2; // (- 2) because we show one previous song and one current song
	
	// if we are at the start of the queue, 'i' would be -1, so change it to 0 and display an extra element at the end instead
	if (fromQueueIndex === 0) { i = 0; lastSongIndex++; }

	while ((i <= lastSongIndex && count < numOfSongsToDisplay)) {
		const song = songQueue[i];
		if (i === nowPlayingSongIndex)
			queueEmbed.addField(`[${i}] ——— CURRENTLY PLAYING ↴`, `${song.title}`, false);
		else
			queueEmbed.addField(`[${i}]`, `${song.title}`, false);

		i = (i+1) % songQueue.length; // loop back to first song if end reached
		count++; // to prevent infinte loop
	}
	
	return queueEmbed;
}

const embedReply = (index, n) => { 
	if (index) { // reply (1)
		return new MessageEmbed()
		.setColor("RANDOM")
		.setDescription("number of songs to display cannot be greater than how many songs you have in the queue\n\ni guess..\ni guess...\ni guess you 👀\n")
		.setImage("https://y.yarn.co/fb32705d-7476-4c99-97b8-fea2c925428b_screenshot.jpg")
		.setFooter("miscalculated 😂😂😂🔥");
	}
	else { // reply (0)
		return new MessageEmbed()
		.setColor("RANDOM")
		.setDescription(`you want to print ${n} songs? won't do it`)
		.setImage("https://media1.tenor.com/images/8577e8dfb18ff371a4e9c9661ba4bbdc/tenor.gif?itemid=17698704")
		.setFooter("print fewer songs or print the entire queue instead");
	}
}