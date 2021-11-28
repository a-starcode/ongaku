const Command = require('../Structures/Command.js');
const MusicSubscription = require('../Structures/MusicSubscription.js');
const { 
	createAudioPlayer, 
	joinVoiceChannel, 
	NoSubscriberBehavior 
} = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');

module.exports = new Command({
	name: "join",
	description: "join user's voice channel",
	aliases: ["j"],

	async run(msg, args, client) {
		const currentServerID = msg.guild.id;
		const currentVoiceChannel = msg.member.voice.channel;
		let subscription = client.globalSubscriptions.get(currentServerID);

		if (!subscription) {
			const currentAdapterCreator =  msg.guild.voiceAdapterCreator;
			const player = createAudioPlayer();
			const connection = 	joinVoiceChannel({
				channelId: currentVoiceChannel.id,
				guildId: currentVoiceChannel.guild.id, // try changing to currentServerID later
				adapterCreator: currentAdapterCreator,
			});

			subscription = new MusicSubscription( { connection, player, msg } );
			client.globalSubscriptions.set(currentServerID, subscription);
		} 
		else msg.channel.send( "why are you like this?...i'm in the voice channel already");
	}
});