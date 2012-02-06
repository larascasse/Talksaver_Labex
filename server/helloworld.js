//

// A JavaScript based on Node.js and VNStat

//

// Nicolas Hennion (aka) Nicolargo

//

// GPL v3.0

//

var http = require('http');

var url = require('url');

var spawn = require('child_process').spawn;

// **********

// Variables

// **********

var listenport = 1337;

// **********

// Functions

// **********

// Chomp function (delete the \n)

String.prototype.chomp = function() {

	return this.replace(/(\n|\r)+$/, '');

};

// HTTP request

function onRequest(req, res) {

	console.log("New request: " + req.url);

	res.writeHead(200, {
		'Content-Type' : 'text/plain'
	});

	res.write('Hello World');

	res.end();

};

// *************

// Main program

// *************

// Create the HTTP server

http.createServer(onRequest).listen(listenport);

// Get the hostname (FQDN)

var listenaddress = spawn('hostname', [ '-f' ]);

listenaddress.stdout.on('data', function(data) {

	var fqdn = new String(data);

	console.log('Server running listenning http://' + fqdn.chomp() + ':'
			+ listenport + '/');

});