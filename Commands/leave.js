const { VoiceConnectionStatus } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const Command = require('../Structures/Command.js');

module.exports = new Command({
	name: "leave",
	description: "leave voice channel",
	aliases: ["dc"],

	async run(msg, args, client) {
		const currentServerID = msg.guild.id;

		const subscription = client.globalSubscriptions.get(currentServerID);
		if (subscription) {
			if (subscription.connection.state.status !== VoiceConnectionStatus.Destroyed) subscription.connection.destroy();
			client.globalSubscriptions.delete(currentServerID);
			msg.channel.send("left the voice channel");
		} 
		else 
			msg.channel.send({ 
				embeds: [
					new MessageEmbed()
					.setColor("RANDOM")
					.setDescription("**how am i supposed to leave if i'm not even playing in the channel**")
					.setImage("https://media1.tenor.com/images/063c00599ba64be7a8e7d1dffa01f80b/tenor.gif?itemid=11146618")
				] 
			});
		
	}
});