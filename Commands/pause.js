const { AudioPlayerStatus } = require("@discordjs/voice");

const Command = require('../Structures/Command.js');

module.exports = new Command({
	name: "pause",
	description: "pause current playing song",
	aliases: ["stop"],

	async run(msg, args, client) {
		const currentServerID = msg.guild.id;
		const subscription = client.globalSubscriptions.get(currentServerID);
		if (subscription) {
			if (subscription.player.state.status !== AudioPlayerStatus.Paused)
				subscription.player.pause();
			
			msg.channel.send("player paused");
		} 
		else msg.channel.send("join a voice channel, play a song, then you can pause...stupid beach");
	}
});