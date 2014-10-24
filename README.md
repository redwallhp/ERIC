ERIC: The Minecraft Idle Client and Chat Relay
====

Want to idle at your iron grinder without leaving Minecraft open? Or maybe you want to relay in-game chat to a convenient web interface or IRC channel? ERIC can do both for you.


Features
----

* Chat is output to the terminal, and a readline interface allows you to join the conversation.

* Configurable chat relays can output chat to an IRC channel of your choice, and/or a web interface powered by Socket.io.

* Multi-server support. Your Minecraft character can idle on multiple servers simultaneously, and chat will be relayed appropriately.

* Compatible with Minecraft 1.7.x


Installation
----

First, ensure that you have [Node.js](http://nodejs.org/) installed. Then grab the source and install the dependencies with NPM.

	git clone https://github.com/redwallhp/eric.git
	cd eric
	npm install
	cd node-minecraft-protocol
	npm install

Now change back to the main `eric` directory and set up your configuration. You need to copy and rename `config.exmaple.js` to `config.js` before opening it in your preferred editor. The basic Minecraft configuration looks something like this:


	exports.minecraft = {

		username: "you@example.org",
		password: "yourminecraftpassword",

		servers: [
			{
				id: "myserver",
				host: "localhost",
				port: null,
				irc_channel: "#myserver"
			}
		]

	};

The username and password options refer to your Minecraft credentials, while the `servers` array has an entry for each game server ERIC should connect to. `host` should be either a domain or IP address and `port` should be null if default, or an integer if the server is running on a nonstandard port. You only need to worry about `irc_channel` if you intend to enable the IRC relay. (More on this later.)

When everything is configured adequately, launch ERIC by loading the index.js file with node.

	node index.js

If all goes well, you should be greeted by an intereactive console and the client will connect to the game server. Chat lines should start appearing momentarily, and you will be able to chat and issue commands using the prompt at the bottom. `/q` exits ERIC.


Configuring Relays
----

ERIC can relay chat to two places: a web interface powered by Express.js and Socket.io, and IRC channels on the server you specify. To enable or disable the relays (both are disabled by default), change the boolean values in the `enabled` set. Each has its own settings that follow.

For the web interface, you can set the port and domain it listens on, the default being http://localhost:3333. This should be good for most cases, unless you intend on using it as a public-facing service. In that case, you should set the `read_only` flag to `true` so the chat input will be disabled. (Otherwise anyone could chat as the idling account.)

For IRC, you set the IRC server and the nickname that ERIC will use. If you look back at the part of the configuration where you set the game servers up, that is where you specify the channel the chat will be output to. (This is so you can map multiple servers to their own channels.) The `command_nicks` array contains a list of IRC users who are allowed to use the !say command to send chat back to the game. (`!say Hello') Setting this to an empty `[]` array will disable this feature for everyone.

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
			nick: "mrtestbot",
			command_nicks: ['your_irc_nick']
		}

	};