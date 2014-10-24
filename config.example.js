exports.minecraft = {

	username: "you@example.org",
	password: "yourpassword",

	servers: [
		{
			id: "exampleserver",
			host: "localhost",
			port: 25565,
			irc_channel: "#exampleserver"
		}
	]

};



exports.relays = {

	enabled: {
		web: false,
		irc: false
	},

	web: {
		domain: 'localhost',
		port: 3333,
		read_only: false
	},

	irc: {
		server: "localhost",
		nick: "relaybot",
		command_nicks: []
	}

};