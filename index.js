var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var allClients = [];

app.use('/assets',express.static(__dirname+'/assets'));
app.use('/js',express.static(__dirname+'/js'));
app.use('/css',express.static(__dirname+'/css'));
app.use('/src',express.static(__dirname+'/src'));
app.use('/src_joystick',express.static(__dirname+'/src_joystick'));
app.use('/src_game',express.static(__dirname+'/src_game'));
app.use('/images',express.static(__dirname+'/images'));

app.get('/', function(req,res){
	res.sendFile(__dirname+'/index.html');
});

app.get('/register',function(req,res){
	res.sendFile(__dirname+'/register.html');
});


app.get('/joystick',function(req,res){
	console.log(req.param('id'));
	res.sendFile(__dirname+'/joystick.html');
});

server.allClients = [];
server.session = 0;
server.lastPlayderID = 0;
server.session_game = "";
server.game_played = "";
server.host_id = "";
server.ready = false;
server.totalPlayer = 0;

io.sockets.on('connection',function(socket){
	console.log(server.totalPlayer);

	server.allClients.push(socket);

	socket.on('createGame',function(session_game){

		socket.session_game = session_game;

		if(!server.ready){
			socket.is_server = true;
			socket.is_server = true;
			server.ready = true;
		}else{
			socket.emit("create_game_fail");
			console.log("game already hosted");
		}
	});

	//from joystick
	socket.on('request_playing',function(msg){
			console.log(msg)
			socket.session_game = msg;
			socket.is_playing = true;
			server.totalPlayer++;
			server.session = msg;
			socket.emit("connect_success",server.session);
			socket.broadcast.emit("player_request_join",server.session);
		
		
	});

	socket.on('req_up_action',function(msg){
		socket.broadcast.emit("action",msg);
	});

	socket.on('req_down_action',function(msg){
		socket.broadcast.emit("action",msg);
	});
	
	//from game
	socket.on('disconnect',function(){
		
		var i = server.allClients.indexOf(socket);
		console.log();
      	socket.broadcast.emit("player_disconnect",server.allClients[i].session_game);
      	delete allClients[i];


	});
});


function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
};

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
};

server.listen(3000,function(){ // Listens to port 8081
    console.log('Listening on '+server.address().port);
});