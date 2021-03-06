var _;
var Socket = function(game){
	this.socket = io();
	this.game = game;

	_ = this;
	this.id = 0;
	/*
        Kumpulan kursor berdasarkan idnya. 
        Jadi jika ingin mengecek state cursor mesti mengetahui id player tersebut
        this.cursors["id player"].left.isDown
        this.cursors["id player"].right.isDown   
     */
    this.cursors = [];

	this.cursor = {};
    this.cursor.left = {};
    this.cursor.right = {};
    this.cursor.left.isDown = false;
    this.cursor.right.isDown = false;
    this.jumpButtons  = [];


    //fungsi yang terpanggil jika ada user terconnect dari server
    this.socket.on("player_request_join",function(data){
        //assign cursor berdasarkan id
    	_.cursors[""+data] = {};
    	_.cursors[""+data].left = {};
    	_.cursors[""+data].right = {};
    	_.jumpButtons[""+data] = {};
    	_.jumpButtons[""+data].isDown = false;
        //panggil fungsi create new player di Game.js dengan parameter id player = id socket
    	_.game.createNewPlayer(data);
    });

    //fungsi yang terpanggil jika ada user terdisconnect dari server
    this.socket.on("player_disconnect",function(data){
    	console.log(data);
    	if(data != null){
    		//panggil fungsi remove player di Game.js dengan parameter id player = id socket
    		_.game.removePlayer(data);
    	}
    	
    });
};

/*
    Penggantian state button left, right, jump, berdasarkan komunikasi dari webserver dan id socket
 */
Socket.prototype.listenButton = function(){
    this.socket.on('action',function(data){
        console.log(data);

        if(data.act_name == "left")
        {
            if(data.act_behaviour == "down")
            {
                _.cursors[""+data.session].left.isDown = true;
                _.cursors[""+data.session].right.isDown = false;
            }
           
        }else if(data.act_name == "trigger")
        {
            _.jumpButtons[""+data.session].onUp(_.jumpButtons[""+data.session].instance);
        }
        else if(data.act_name == "right")
        {
            if(data.act_behaviour == "down")
            {
               // console.log("go to right");
                _.cursors[""+data.session].right.isDown = true;
                _.cursors[""+data.session].left.isDown = false;
            }
        }else if(data.act_name == "idle")
            {
                _.cursors[""+data.session].right.isDown = false;
                    _.cursors[""+data.session].left.isDown = false;
            }
        }
    );     
}
Socket.prototype.triggerButton = function(id,triggerFunction)
{
    console.log(_.cursors[""+id]);
    _.cursors[""+id].triggerFunction = null;
    _.cursors[""+id].triggerFunction = triggerFunction;
}

// Mendapatkan cursors berdasarkan id
Socket.prototype.getCursors = function(id)
{
	return _.cursors[""+id];
}

// Mendapatkan jumpButton berdasarkan id
Socket.prototype.setJumpButton = function(id,onUp,instance)
{
	_.jumpButtons[""+id].onUp = onUp;
    _.jumpButtons[""+id].instance = instance;
}
