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


app.get('/joystick',function(req,res){
	res.sendFile(__dirname+'/joystick.html');
});


server.session = 0;
server.lastPlayderID = 0;
server.session_game = "";
server.game_played = "";
server.host_id = "";
server.ready = false;
server.totalPlayer = 0;

io.sockets.on('connection',function(socket){
	console.log(server.totalPlayer);
	allClients.push(socket);

	socket.on('createGame',function(session_game){

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
		console.log(server.totalPlayer);
		if(server.totalPlayer != 2)
		{	
			socket.is_playing = true;
			server.totalPlayer++;
			server.session = msg;
			socket.emit("connect_success",server.session);
			socket.broadcast.emit("player_request_join",server.session);
		}else{
			socket.emit("server_full",server.session);
		}
		
	});

	socket.on('req_up_action',function(msg){
		socket.broadcast.emit("action",msg);
	});

	socket.on('req_down_action',function(msg){
		socket.broadcast.emit("action",msg);
	});
	
	//from game
	socket.on('disconnect',function(){
		if(socket.is_server){
			socket.is_server = true;
			server.ready = false;
		}else{
			if(socket.is_playing)
				server.totalPlayer--;
		}
		console.log("disconnect is server? "+socket.is_server);
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