// imports
const { AudioPlayerStatus } = require('@discordjs/voice');

const Command = require('../Structures/Command.js');
const { getSong, displaySongAsEmbed } = require('../Structures/Song.js');
const config = require('../config.json');

module.exports = new Command({
	name: "play",
	description: "pblay musik",
	aliases: ["p"],
	permissions: ["CONNECT", "SPEAK"],

	async run(msg, args, client) {
		const currentServerID = msg.guild.id;
		const currentVoiceChannel = msg.member.voice.channel;
		// check if user is connected to a voice channel
		if (!currentVoiceChannel) return msg.channel.send("join a voice channel first you dipship\ndumbfudge");

		let subscription = client.globalSubscriptions.get(currentServerID);

		if (!subscription) {
			client.commands.find(cmd => cmd.name === "join")
				.run(msg, args, client);
			subscription = client.globalSubscriptions.get(currentServerID);
		} 

		if (subscription.player.state.status === AudioPlayerStatus.Paused || (subscription.player.state.status === AudioPlayerStatus.AutoPaused && subcription.queue.length !== 0) ) {
			subscription.player.unpause();
		}
		else {
			// check if song name/link was passed in the message or not
			if (args.length === 1) return msg.channel.send("enter the song you want to play, idiot");

			const { options, query } = seperateOptionsAndQuery(args);
			const methods = {
				onStart() {
					const songData = subscription.player.state.resource.metadata;
					msg.channel.send({ 
						embeds: [displaySongAsEmbed(songData, msg)] 
					});			
				},
				onFinish() {},
				onError(error) { console.warn(error); },
			};
	
			const song = await getSong(query.join(" "), methods, 0);
	
			// Enqueue the track and reply a success message to the user
			subscription.enqueue(song);
			msg.channel.send(`Enqueued \`${song.title}\``);
		}
	

	}
})

// functions
const seperateOptionsAndQuery = (args) => {
	let options = [];
	let query = [];
	// *starting from 1* it won't take the command into consideration
	for (let i = 1; i < args.length; i++) {
		if (!args[i].startsWith(config.prefix))
			query.push(args[i]);
		else options.push(args[i]);
	}

	return { options, query };
}
