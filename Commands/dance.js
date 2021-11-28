const { MessageEmbed } = require('discord.js');

const Command = require('../Structures/Command.js');

const dances = [
	"https://thumbs.gfycat.com/IdealisticOilyFlicker-size_restricted.gif", //doge
	"https://media1.tenor.com/images/128bfcb474780fd6c72ffaac9a5ba8a3/tenor.gif?itemid=13317650", //thanos
	// "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthumbs.gfycat.com%2FMinorMixedIncatern-size_restricted.gif&f=1&nofb=1", // black guy dance meme
	"https://media.tenor.com/images/b9103e36b8e870eaac3a93e4bdce43ee/tenor.gif", // tobey
	"https://media1.tenor.com/images/2c26ae387e30540a18fa678ef2c7ca91/tenor.gif?itemid=14278192" // cj
]

module.exports = new Command({
	name: "dance",
	description: "to vibe along with musik",
	aliases: [],

	async run(msg, args, client) {
		const danceEmbed = 
		new MessageEmbed()
		.setImage(dances[Math.floor(Math.random() * dances.length)]);

		msg.channel.send({ embeds: [danceEmbed] });
	}
});