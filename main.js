//var DEBUG = true;
var DEBUG = false;

var http = require('http');
var io = require('socket.io');
var util = require('util');
var exec = require('child_process').exec;
var fs = require('fs');
var thoth = require('thoth');

var socketIOClients = new Array();
var messageQueue = new Array();

server = http.createServer(ServerMain);
server.listen('8083');

var socket = io.listen(server);

//var buffer = new Buffer(5242880);
var buffer = new Buffer(66000);
buffer.fill("A");
buffer = buffer.toString();

console.log(buffer);

thoth.create('2c5fd86f2f75c2b5', buffer, function(error, parent)
{
	console.log(util.inspect(error));
});

thoth.read('2c5fd86f2f75c2b5/-1.data', function (error, data)
{
console.log("afff");
	console.log(data);
});
console.log("asdfasdf");
setupSocketIOOptions();
setupSocketIOEventHandlers();

setInterval(broadcastMessages, 1000);

function ServerMain(req, res)
{
	//res.writeHead(200, {'Content-Type': 'text/html'});
	//res.end(clientPageData);
}

function setupSocketIOEventHandlers()
{
	socket.on('connection', NewClient);
}

function setupSocketIOOptions()
{
	socket.enable('browser client minification');
	socket.enable('browser client etag');
	socket.enable('browser client gzip');
	socket.set('log level', 0);
	if(DEBUG) socket.set('log level', 3);
	socket.set('transports',
		[
			'websocket',
			//'flashsocket',
			'htmlfile',
			'xhr-polling',
			'jsonp-polling'
		]
	);
}

function NewClient(client)
{
	client.on('disconnect', function()
	{
		if(DEBUG) console.log('Client '+this.id+' Disconnected');
		socketIOClients = socketIOClients.splice(this);
	});

	client.id = socketIOClients.length+1;

	if(DEBUG) console.log('Client '+client.id+' Connected');

	socketIOClients.push(client);

	setTimeout(parseServerList, 1000);
}

function queueMessage(data)
{
//	if(DEBUG) console.log(util.inspect(data));
	messageQueue.push(data);
}

function broadcastMessages()
{
	if(messageQueue.length > 0)
	{
		for(message in messageQueue)
		{
			socketIOClients.every(
				function(entry)
				{
					entry.volatile.emit('message', messageQueue[message] );
					entry.broadcast.volatile.emit('message', messageQueue[message] );

					return false;
				}
			);
		}

		messageQueue = [];
	}
}
