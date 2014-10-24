config = require('./config');


// Disable all relays if run with the "--norelay" flag
var argv = require('minimist')(process.argv.slice(2));
if (argv.norelay === true) {
	for (var relay in config.relays.enabled) {
		config.relays.enabled[relay] = false;
	}
}


// Start the readline interface
rl = require('./app/readline');


// Run the Minecraft client
minecraft = require('./app/minecraft');


// Start the chat relays if enabled
if (config.relays.enabled.web === true)
	web = require('./app/web');

if (config.relays.enabled.irc === true)
	irc = require('./app/irc');