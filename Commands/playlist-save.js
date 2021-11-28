const { MessageEmbed } = require('discord.js');

const Command = require('../Structures/Command.js');
const FS = require('fs');

module.exports = new Command({
	name: "playlist-save",
	description: "save current queue as playlist (will overwrite if same name is passed)",
	aliases: ["pl-save", "save", "s"],

	async run(msg, args, client) {
		const currentServerID = msg.guild.id;
		const subscription = client.globalSubscriptions.get(currentServerID);
		if (subscription) {
			if (!args[1]) return msg.channel.send("You forgor to enter a name for your sh*tty playlist 💀");
			if (subscription.queue.length != 0) {

				const playlistName = args.slice(1, args.length).join("");
				// const tempArr = [{a: 1, b: 5}, {a: 2, b: 6}];
				let playlistFileContent = "[\n";
				for (let i = 0; i < subscription.queue.length; i++) {
					if (i === subscription.queue.length - 1) 
						playlistFileContent += (JSON.stringify(subscription.queue[i], null, 2) + "\n");
					else	
						playlistFileContent += (JSON.stringify(subscription.queue[i], null, 2) + ",\n");
				}
				playlistFileContent += "]";
	
				FS.writeFile(
					`./Playlists/${playlistName}.json`, 
					`${playlistFileContent}`, 
					(err) => { if (err) throw err; }
				); 
	
				msg.channel.send("saved playlist");
			}
		} 
		else
			msg.channel.send({ 
				embeds: [
					new MessageEmbed()
					.setColor("RANDOM")
					.setDescription("**your intelligence gets surprisingly worse everytime...join channel, queue song, try again, ooga booga?")
					.setImage("https://media1.tenor.com/images/063c00599ba64be7a8e7d1dffa01f80b/tenor.gif?itemid=11146618")
				] 
			});
	}
});