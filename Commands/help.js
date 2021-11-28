const { MessageEmbed } = require('discord.js');

const Command = require('../Structures/Command.js');

module.exports = new Command({
	name: "help",
	description: "shows list of all available commands",
	aliases: ["h"],

	async run(msg, args, client) {
		let helpEmbed = new MessageEmbed()
		.setColor("RANDOM")
		.setTitle("CAN I GET YOU A DRINK?")
		.setThumbnail("https://i.pinimg.com/originals/a4/f3/b6/a4f3b6a295cf67363868e498714578cb.png");

		client.commands.forEach(cmd => {
			helpEmbed.addField(
				`\`-${cmd.name} [${cmd.aliases.toString()}]\``, 
				`${cmd.description}`, 
				true
			);
		});

		msg.channel.send({ embeds: [helpEmbed] });
	}
});