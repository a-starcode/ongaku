const { MessageEmbed } = require('discord.js');
const FS = require('fs');

const Command = require('../Structures/Command.js');

module.exports = new Command({
	name: "playlist-view",
	description: "view all saved playlists",
	aliases: ["pl-view", "plv"],

	async run(msg, args, client) {
		let playlistEmbed = new MessageEmbed()
		.setColor("RANDOM")
		.setTitle("🎶  AVAILABLE PLAYLISTS  🎶");

		let index = 0;
		FS.readdirSync('./Playlists')
		.filter(file => file.endsWith(".json"))
		.forEach(file => {
			playlistEmbed.addField(`[${index++}].`, `${file.substr(0, file.length - 5)}`, false);
		});

		msg.channel.send({ embeds: [playlistEmbed] });
	}
});