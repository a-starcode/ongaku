const { VoiceConnectionStatus } = require('@discordjs/voice');
const Command = require('../Structures/Command.js');

module.exports = new Command({
	name: "resume",
	description: "resume paused song, could also use -p without any arguments",
	aliases: ["unpause", "res"],

	async run(msg, args, client) {
		const currentServerID = msg.guild.id;
		const subscription = client.globalSubscriptions.get(currentServerID);
		
		if (subscription) {
			if (subscription.connection.state.status === VoiceConnectionStatus.Destroyed) {
				subscription.connection.rejoinAttempts--;
				subscription.connection.rejoin();
			}
			subscription.player.unpause();
			console.log(subscription.connection.state.status);
		}
		else msg.channel.send("join a voice channel, play a song, pause the song, then you can resume...stupid beach");
	}
});