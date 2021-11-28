const Command = require('../Structures/Command.js');
const FS = require('fs');
const { createSongsFromPlaylist, displaySongAsEmbed } = require('../Structures/Song.js');

const config = require('../config.json');
const { MessageEmbed } = require('discord.js');

const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

module.exports = new Command({
	name: "playlist-play",
	description: "play a saved playlist, use -r or -random after playlist name to randomize song queue",
	aliases: ["pl-play", "plp"],

	async run(msg, args, client) {
		const currentServerID = msg.guild.id;
		let subscription = client.globalSubscriptions.get(currentServerID);
		let random = false;
		
		if (args.length > 3) return msg.channel.send("invalid number of entries :/ you need to get -help");
	
		if (!args[1]) return msg.channel.send({ embeds: [embedReply()] });
		if (args[1].startsWith(`${config.prefix}`)) 
			return msg.channel.send("enter playlist name before the random option...go get -help");
		if (args[2]) {
			if (args[2] === "-random" || args[2] === "-r") random = true;
			else return msg.channel.send("invalid option :/ man literally can't even spell random or type -r, holy ship, get -help");
			
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

		const playlistName = args[1];
		const isPlaylistAvailable = FS.readdirSync('./Playlists')
		.filter(file => file.endsWith(".json"))
		.find(file => file === `${playlistName}.json`);

		if (isPlaylistAvailable) {
			const playlistFileContent = FS.readFileSync(`./Playlists/${playlistName}.json`);
			const playlist = JSON.parse(playlistFileContent);
			const songQueue = createSongsFromPlaylist(playlist, methods);

			if (random) shuffleArray(songQueue);

			subscription.queue = songQueue;
			subscription.queueIndex = -1;
			subscription.processQueue();
			subscription.player.stop();
		} 
		else return msg.channel.send("could not find playlist, use -plv to see available playlists and check your speiling");
	}
});

const embedReply = () => 
	new MessageEmbed()
	.setImage("https://thecinemaholic.com/wp-content/uploads/2021/09/Squid-Game-ngy.jpg?resize=200")
	.setFooter("playlist ka naam daal b*dk")
