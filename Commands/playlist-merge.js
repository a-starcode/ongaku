const Command = require('../Structures/Command.js');
const FS = require('fs');
const { createSongsFromPlaylist, displaySongAsEmbed } = require('../Structures/Song.js');

const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

module.exports = new Command({
	name: "playlist-merge",
	description: "merge saved playlists, use -r or -random after all playlist names to randomize final song queue",
	aliases: ["pl-merge", "plm"],

	async run(msg, args, client) {
		const currentServerID = msg.guild.id;
		let subscription = client.globalSubscriptions.get(currentServerID);
		let random = false;
		let lastPlaylistNameIndex = args.length - 1;
	
		if (!args[1]) 
			return msg.channel.send("enter at least one playlist name, fudgetard");
		if (args[args.length - 1] === "-r" || args[args.length - 1] === "-random") {
			random = true;
			lastPlaylistNameIndex--;
		}

		if (!subscription) {
			client.commands.find(cmd => cmd.name === "join")
				.run(msg, args, client);
			subscription = client.globalSubscriptions.get(currentServerID);
		}

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

		let finalSongQueue = [];
		const playlistFiles = 
		FS.readdirSync('./Playlists').filter(file => file.endsWith(".json"));

		for (let i = 1; i <= lastPlaylistNameIndex; i++) {
			let playlistName = args[i];
			let isPlaylistAvailable = 
			playlistFiles.find(file => file === `${playlistName}.json`);
			
			if (isPlaylistAvailable) {
				let playlistFileContent = FS.readFileSync(`./Playlists/${playlistName}.json`);
				let playlistObject = JSON.parse(playlistFileContent);
				let tempSongQueue = createSongsFromPlaylist(playlistObject, methods);
				
				finalSongQueue = [...finalSongQueue, ...tempSongQueue];
			} 
			else return msg.channel.send(`could not find ${playlistName} playlist, use -plv to see available playlists and check your speiling`);
		}

		if (random) shuffleArray(finalSongQueue);
		subscription.queue = finalSongQueue;
		subscription.queueIndex = -1;
		subscription.processQueue();
		subscription.player.stop();
	}
});