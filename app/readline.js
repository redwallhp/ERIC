var readline = require('readline'),
util = require('util'),
color = require("ansi-color").set;



// Create readline
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console_out("Type /help for console commands");



// Minecraft server IDs
var selected = null;
var server_ids = [];
config.minecraft.servers.forEach(function(server) {
	server_ids.push(server.id);
});
if (server_ids.length == 1) {
	selected = server_ids[0];
}



// Handle readline input
rl.on('line', function(line) {

	if (line[0] == "/" && line.length > 1) {

		var cmd = line.match(/[a-z]+\b/)[0];
		var arg = line.substr(cmd.length+2, line.length);

		switch (cmd) {

			case 'q':
			case 'quit':
				console_out(color('Quitting...', 'red'));
				rl.close();
				process.exit(0);
				break;

			case 'servers':
				console_out(color('Servers available: ' + server_ids.join(', '), 'green'));
				break;

			case 'attach':
				if (server_ids.indexOf(arg) != -1) {
					selected = arg;
					console_out(color("Selected server is now '"+arg+"'", "green"));
				} else {
					console_out(color("Unknown server '"+arg+"'", "red"));
				}
				break;

			case 'help':
				console_out("/quit\t\t\tEnd the process");
				console_out("/servers\t\tDisplay IDs of servers registered in config.js");
				console_out("/attach [id]\t\tSelect a server for chat messages to go to");
				console_out("Any text not prefixed with a '/' will be sent as chat. Minecraft commands pass through.");
				break;

			default:
				send_chat_message(line);

		}

	} else {
		send_chat_message(line);
	}

});



// Send chat messages to Minecraft
function send_chat_message(msg) {
	if (selected !== null) {
		minecraft.servers[selected].send_chat(msg);
	} else {
		console_out(color("You are not currently attached to a server. Use /attach [id] first.", "red"));
	}
}



function console_out(msg) {
	rl.pause();
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	console.log(msg);
	rl.prompt(true);
}

exports.out = console_out;