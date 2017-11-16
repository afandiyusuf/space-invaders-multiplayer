var _;
var Socket = function(game){
	this.socket = io();
	this.game = game;

	_ = this;
	this.id = 0;
	this.cursors = [];
	this.cursor = {};
    this.cursor.left = {};
    this.cursor.right = {};
    this.cursor.left.isDown = false;
    this.cursor.right.isDown = false;
    this.jumpButtons  = [];


    this.socket.on("player_request_join",function(data){
    	_.cursors[""+data] = {};
    	_.cursors[""+data].left = {};
    	_.cursors[""+data].right = {};
    	_.jumpButtons[""+data] = {};
    	_.jumpButtons[""+data].isDown = false;
    	_.game.createNewPlayer(data);
    });

    this.socket.on("player_disconnect",function(data){
    	console.log(data);
    	if(data != null){
    		console.log("removeing player "+data);
    		_.game.removePlayer(data);
    	}
    	
    });
};

Socket.prototype.getId = function(){
	 _.id = Math.random()*1000;
	 return _.id;
}

Socket.prototype.listenButton = function(){
        this.socket.on('action',function(data){

            if(data.act_name == "left")
            {
                if(data.act_behaviour == "down")
                {
                    _.cursors[""+data.session].left.isDown = true;
                }
                else if(data.act_behaviour == "up")
                {
                    console.log("left up");
                    _.cursors[""+data.session].left.isDown = false;
                }
            }
            else if(data.act_name == "right")
            {
                if(data.act_behaviour == "down")
                {
                    console.log("go to right");
                    _.cursors[""+data.session].right.isDown = true;
                }
                else if(data.act_behaviour == "up")
                {
                    _.cursors[""+data.session].right.isDown = false;
                }
            }else if(data.act_name == "fire")
            {
                if(data.act_behaviour == "down")
                {
                    _.jumpButtons[""+data.session].isDown = true;
                }else if(data.act_behaviour == "up")
                {
                    _.jumpButtons[""+data.session].isDown = false;
                }
            } 
        });     
}

Socket.prototype.getCursors = function(id)
{
	return _.cursors[""+id];
}

Socket.prototype.getJumpButton = function(id)
{
	return _.jumpButtons[""+id];
}
