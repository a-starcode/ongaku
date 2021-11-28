const Client = require('./Structures/Client.js')
const config = require('./config.json');

// init custom client
const client = new Client();
client.init(config.token); // handles commands

// events
client.on( 'ready', () => console.log("Bot status: hey i'm on\n") );

client.on('messageCreate', async (msg) => {
	if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

	// 0th element is the command, rest are args
	const args = msg.content.substring(config.prefix.length).split(/ +/); 

	const command =
	client.commands.find(cmd => {
		if (cmd.name === args[0]) return cmd; // check name first
		else { // if name dont match, check the aliases one by one
			return cmd.aliases.find(alias => {
				if (alias === args[0]) return cmd;
			});
		}
	});	

	if (!command) return msg.channel.send(`invalid command, go get -help`);

	// const permission = msg.member.permissions.has(command.permissions, true); // the second parameter true means that if someone has admin perm, then it will override other perms, they can do anything they want

	// if (!permission) return msg.reply(`you don't have enough permissions to execute this command\nlet that sink in, think about your life`);

	command.run(msg, args, client);
});