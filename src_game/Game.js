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
    this.player;
    
    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference
};

BasicGame.Game.prototype = {
    preload: function(){
        this.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);
        this.game.load.image('background', 'assets/games/starstruck/background2.png');
       
    },
	create: function () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.bg = this.add.tileSprite(0, 0, 800, 600, 'background');
        this.physics.arcade.gravity.y = 300;
        this.player = new Player(this.game);
        this.player.create();
        this.physics.enable(this.player.instance, Phaser.Physics.ARCADE);
        this.player.initPhysic();
        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        registerSocket()
        
	},

    registerSocket:function(){
        Socket.on('')
        this.player.registerControl(this.cursors,this.jumpButton);
    },
	update: function () {
        this.player.update();

	},
    render: function(){
        this.game.debug.bodyInfo(this.player.instance, 16, 24);
    },
	quitGame: function (pointer) {
		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};