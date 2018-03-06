var data = {};
var _;
BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator
    this.state;
    this.lastAngle = 0;
    this.isPlay = false;
    this.stateText;
    _ = this;
    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {
    preload: function(){
        this.load.image('join_btn','assets/joinbutton.png');
        this.load.atlas('generic', 'images/generic-joystick.png', 'images/generic-joystick.json');
    },
    /*
        Inisiasi socket.
     */
	create: function () {
        Client = {};
        Client.socket = io();
        this.create_waitingScreen();
        Client.socket.on("connect_success",function(){
            _.create_joystick();
        });
        Client.socket.on("server_full",function(){
            _.server_full();
        });
	},
    /*
        Trigger saat server full
     */
    server_full:function(){
        
        _.stateText.text = "Server full please wait";

    },
    /*
        Waiting screen yang berisi tombol join
     */
    create_waitingScreen:function(){

        this.stateText = this.game.add.text(this.game.world.centerX,10,'Click button to join', { font: '84px Arial', fill: '#fff' });
        this.stateText.anchor.setTo(0.5, 0.5);
        this.stateText.visible = true;

        this.button = this.game.add.button(this.game.world.centerX, this.game.height*0.3,'join_btn',this.joinClick);
        this.button.anchor.setTo(0.5);
        
    },
    // request playing ke server deengan mengirimkan session game.
    joinClick:function(){

        session = Math.floor(Math.random()*1000)+"SESSIONGAME";
        Client.socket.emit('request_playing',session);
    },
    create_joystick:function(){
        
        this.stateText.visible = false;
        this.button.visible = false;

        this.pad = this.game.plugins.add(Phaser.VirtualJoystick);


        this.stick = this.pad.addStick(this.game.width*0.2, this.game.width*0.2, 200, 'generic');
        this.stick.scale = 1;
        this.stick.onUp.add(function()
        {
            _.emitAction(session,"idle","idle");
        })

        this.buttonA = this.pad.addButton(this.game.width*0.8, this.game.width*0.2, 'generic', 'button1-up', 'button1-down');
        this.buttonA.scale = 2;
        this.buttonA.onDown.add(function(){
            _.isFire = false;
            _.emitAction(session,"down","trigger");
        });
        console.log(this.buttonA);
        //
        this.isFire = false;
        this.isIdle = false;
        this.state = "";

         _.isPlay = true;
       
    },

	update: function () {
        if(!this.isPlay)
            return;

        //console.log(this.stick.angle);
        if(this.lastAngle != this.stick.angle){
            //jika user mengarahkan joystick ke kanan
            if(this.stick.angle > -90  && this.stick.angle < 90 && this.stick.angle != 0 && this.state != "right" && !this.isIdle)
            {
                    this.state = "right";
                    this.emitAction(session,"down","right");
                    this.emitAction(session,"up","left");
                    console.log("RIGHT");
                
                    //jika user mengarahkan joystick ke kiri
            }else if((this.stick.angle < -90  || this.stick.angle > 90) && this.stick.angle != 0 && this.state != "left" && !this.isIdle)
            {
                console.log("LEFT");
                this.state = "left";
                this.emitAction(session,"down","left");
                this.emitAction(session,"up","right");
            }
        }

        this.lastAngle = this.stick.angle;

        //jika user melepaskan joysticknya
        if(this.stick.force == 0){
            if(this.isIdle == false){
                this.state = "idle";
                this.emitAction(session,"up","right");
                this.emitAction(session,"up","left");
            }
            
            this.isIdle = true;
        }else{
            this.isIdle = false;
        }

        // //jika user menekan tombol A (1 tombol sebelah kanan)
        // if(this.buttonA.isDown && !this.isFire)
        // {
        //     this.isFire = true;
        //     this.emitAction(session,"down","fire");
        // }
	},
    /*
        Fungsi untuk  komunikasi dengan server, dengan tipe data yang ditentukan
     */
    emitAction: function(session,act_behaviour,act_name){
        
        data.session = session;
        data.act_behaviour=act_behaviour;
        data.act_name= act_name;
        Client.socket.emit("req_up_action",data);
    },
	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
