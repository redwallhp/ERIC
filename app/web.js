var express = require('express'),
hbs = require('express-hbs'),
socketio = require('socket.io');


var app = express();


// Express.js Settings
app.use(express.static('./public'));
app.engine('hbs', hbs.express3());
app.set('view engine', 'hbs');
app.set('views', './views');


// Express.js Routes
app.get('/', function(req, res){
	res.render('index', {
		servers: config.minecraft.servers,
	});
});

app.get('/server/:id', function(req, res){
	var server_details = config.minecraft.servers.filter(function(srv) { return srv.id == req.params.id; });
	if (server_details.length > 0) {
		res.render('chat', {
			server_id: req.params.id,
			domain: config.relays.web.domain,
			port: config.relays.web.port,
			read_only: config.relays.web.read_only
		});
	} else {
		res.send(404, "Minecraft server not found!");
	}
});


// Start web server and socket.io on the same port
var io = socketio.listen(app.listen(config.relays.web.port), { log: false });
rl.out("Web relay active on port " + config.relays.web.port);


// WebSockets
io.sockets.on('connection', function (socket) {

    socket.emit('message', { message: 'Connected to Minecraft idle client.', type: 'notice' });

    // Send chat back to Minecraft
    socket.on('chatback', function (data) {
		if (config.relays.web.read_only === true) {
			return;
		}
		if (data.message[0] == "!" && data.message.length > 1) {
			handleWebCommands(data.message);
			return;
		}
		if (data.server in minecraft.servers) {
			minecraft.servers[data.server].send_chat(data.message);
		}
    });

});


// Push a message to the WebSocket
var web_send = function(msg, server) {
	io.sockets.emit("message", {message: msg, server: server, type: 'chat'});
};


var handleWebCommands = function(msg) {
	io.sockets.emit("message", {message: 'That is not a valid command.', server: server, type: 'notice'});
};


exports.web_send = web_send;