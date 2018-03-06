var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

//static asset
app.use('/assets',express.static(__dirname+'/assets'));
app.use('/js',express.static(__dirname+'/js'));
app.use('/css',express.static(__dirname+'/css'));
app.use('/src',express.static(__dirname+'/src'));
app.use('/src_joystick',express.static(__dirname+'/src_joystick'));
app.use('/src_game',express.static(__dirname+'/src_game'));
app.use('/images',express.static(__dirname+'/images'));

//game url
app.get('/', function(req,res){
	res.sendFile(__dirname+'/index.html');
});

//registerurl, user must input their name at this page
app.get('/register',function(req,res){
	res.sendFile(__dirname+'/register.html');
});

//joystick, joystick url
app.get('/joystick',function(req,res){
	//console.log(req.body.id);
	res.sendFile(__dirname+'/joystick.html');
});

server.allClients = []; //array for storing all socket
server.session = 0; //save session game
server.totalPlayer = 0;//track total player

io.sockets.on('connection',function(socket){
	
	//save socket to array
	server.allClients.push(socket);

	//when game is created
	socket.on('createGame',function(session_game){
		socket.session_game = session_game;
	});

	//received when player click join button on joystick
	socket.on('request_playing',function(msg){
			socket.session_game = msg;
			socket.is_playing = true;
			server.totalPlayer++;
			server.session = msg;

			//emit message joystick
			socket.emit("connect_success",server.session);

			//emit message to game
			socket.broadcast.emit("player_request_join",server.session);
	});
	//call and received when user release their button on joystick
	socket.on('req_up_action',function(msg){
		socket.broadcast.emit("action",msg);
	});
	//call and received when user press their button on joystick
	socket.on('req_down_action',function(msg){
		socket.broadcast.emit("action",msg);
	});
	
	//received whed joystick disconnected
	socket.on('disconnect',function(){
		var i = server.allClients.indexOf(socket);
		console.log();
		//emit to game. and destroy the player sprite
      	socket.broadcast.emit("player_disconnect",server.allClients[i].session_game);
      	delete server.allClients[i];
	});
});

//server listening
server.listen(3000,function(){ // Listens to port 8081
    console.log('Listening on '+server.address().port);
});