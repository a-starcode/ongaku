const { MessageEmbed } = require('discord.js');
const Command = require('../Structures/Command.js');

const replies = [
	{ msg: "hu ha" },
	{ img: "https://barkpost-assets.s3.amazonaws.com/wp-content/uploads/2013/11/plainDoge.jpg" },
	{ msg: "pizza time", img: "https://i.ytimg.com/vi/9DnbgRo52DY/maxresdefault.jpg" },
	{ msg: "never go full r*tard", img: "https://i.ytimg.com/vi/1Y3FzVQi-R8/maxresdefault.jpg"},
	{ msg: "i wanna put some dirt in your eye", img: "https://i.ytimg.com/vi/LR8rbVZkqqE/maxresdefault.jpg" }
];

module.exports = new Command({
	name: "truth",
	description: "shares a deep, truthful, philosophical message ",
	aliases: ["deep"],

	async run(msg, args, client) {
		const reply = replies[Math.floor(Math.random() * replies.length)];
		if (reply.img) {
			(reply.msg) ? 
			msg.channel.send({ embeds: [embedReply(reply.msg, reply.img)] })
			: msg.channel.send({ embeds: [embedReply(null, reply.img)] })
		}
		else msg.reply(reply.msg);
	}
});

const embedReply = (message, image) => {
	if (message) 
		return new MessageEmbed().setFooter(message).setImage(image);
	else 
		return new MessageEmbed().setImage(image);
}