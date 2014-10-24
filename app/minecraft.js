var mc = require('../node-minecraft-protocol'),
states = mc.protocol.states,
color = require("ansi-color").set;



function MinecraftClient(details) {


	var chat_message_queue = [];
	var server_id = details.id;
	var server_details = {
		username: config.minecraft.username,
		password: config.minecraft.password,
		host: details.host,
		port: details.port
	};


	// Initialize Minecraft client
	var minecraft = mc.createClient(server_details);


	// On chat message recieved
	minecraft.on([states.PLAY, 0x02], function(packet) {
		var jsonMsg = JSON.parse(packet.message);
		var message = parse_chat(jsonMsg, {});
		output_chat_message(message, server_id);
	});


	// On keepalive packet
	minecraft.on([states.PLAY, 0x00], function(packet) {
		// If there are chat messages queued, send one
		if (chat_message_queue.length > 0) {
			var msg = chat_message_queue.shift();
			minecraft.write(0x01, {message: msg});
		}
	});


	// On connected
	minecraft.on('connect', function() {
		rl.out('Connected to Minecraft server ' + server_details.host + ':' + server_details.port);
	});


	// On disconnected
	minecraft.on('end', function(reason) {
		setTimeout(function() {
			//minecraft = mc.createClient(server_details);
			var client = new MinecraftClient(details);
			servers[details.id] = client;
		}, 5000);
	});


	// On error
	minecraft.on('error', function(err) {
		rl.out(err);
	});


	// Parse incoming chat
	parse_chat = function(chat_obj, parent_state) {
		var chatmap = {
			"chat.stream.emote": "(%s) * %s %s",
			"chat.stream.text": "(%s) <%s> %s",
			"chat.type.admin": "[%s: %s]",
			"chat.type.announcement": "[%s] %s",
			"chat.type.emote": "* %s %s",
			"chat.type.text": "<%s> %s"
		};
		if (typeof chat_obj === "string") {
			return chat_obj;
		} else {
			var chat = "";
			if ('text' in chat_obj) {
				chat += chat_obj.text;
			} else if ('translate' in chat_obj && chatmap.hasOwnProperty(chat_obj.translate)) {
				var args = [chatmap[chat_obj.translate]];
				chat_obj['with'].forEach(function(s) {
					args.push(parse_chat(s, parent_state));
				});
				chat += util.format.apply(this, args);
			}
			for (var i in chat_obj.extra) {
				chat += parse_chat(chat_obj.extra[i], parent_state);
			}
			return chat;
		}
	};


	// Handle incoming chat messages
	output_chat_message = function(msg, server) {
		var banner = color("["+server+"] ", "cyan");
		rl.out(banner + msg);
		if (config.relays.enabled.web === true)
			web.web_send(msg, server);
		if (config.relays.enabled.irc === true)
			irc.irc_send(msg, server);
	};


	// Push a message to the chat queue, to be sent to Minecraft
	this.send_chat = function(msg) {
		chat_message_queue.push(msg);
	};


}



// Bootstrap Minecraft connections
var servers = [];

config.minecraft.servers.forEach(function(options) {
	var client = new MinecraftClient(options);
	servers[options.id] = client;
});

exports.servers = servers;