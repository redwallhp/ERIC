var irc = require('irc');


// Connect to IRC server
var irc_channels = [];
var channel_map = [];
config.minecraft.servers.forEach(function(server) {
	irc_channels.push(server.irc_channel);
	channel_map[server.id] = server.irc_channel;
});

var client = new irc.Client(config.relays.irc.server, config.relays.irc.nick, {
	channels: irc_channels,
});

rl.out("IRC relay active on channels: " + irc_channels.join(', '));



// Push a message to IRC
var irc_send = function(msg, server) {
	client.say(channel_map[server], msg);
};



// Handle commands
client.addListener('message', function (from, to, message) {
	if (message[0] == "!" && message.length > 1) {
		if (config.relays.irc.command_nicks[from] === undefined) {
			var cmd = message.match(/[a-z]+\b/)[0];
			switch (cmd) {
				case 'say':
					var msg = message.substr(cmd.length+2, message.length);
					var tomc = Object.keys(channel_map).filter(function(key) { return channel_map[key] == to; })[0];
					minecraft.servers[tomc].send_chat(msg);
					break;
				default:
					client.say(to, cmd + ' is not a valid command.');
			}
		}
	}
});



// Handle errors
client.addListener('error', function(e) {
    rl.out('IRC Error: ', e);
});



exports.irc_send = irc_send;