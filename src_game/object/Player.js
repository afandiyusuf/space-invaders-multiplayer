Player = function(game,id){
	this.game = game;
	this.jumpTimer = 0;
    this.cursors;
    this.jumpButton;
    this.facing = 'left';
    this.id = id;
};
Player.prototype = {
	create:function(){
		this.instance = this.game.add.sprite(32, 320, 'dude');
	},
	initPhysic:function(){
		this.instance.body.collideWorldBounds = true;
        this.instance.body.gravity.y = 1000;
        this.instance.body.maxVelocity.y = 500;
        this.instance.body.setSize(20, 32, 5, 16);

        this.instance.animations.add('left', [0, 1, 2, 3], 10, true);
        this.instance.animations.add('turn', [4], 20, true);
        this.instance.animations.add('right', [5, 6, 7, 8], 10, true);
	},
    /*
        register controller, corsurs dan jumbutton diambil dari Socket.js, yang diregister di game.js
     */
	registerControl:function(cursors)
	{
		this.cursors = cursors;
		//this.jumpButton = jumpButton;
	},
    jumpTrigger:function(instance)
    {
        instance.body.velocity.y = -500;
        //this.jumpTimer = this.game.time.now + 750;
    },
    /*
        Logic game berdasarkan state cursors, dan jumpButton yang didapat dari socket.js
     */
	update:function(){

        this.instance.body.velocity.x = 0;

        if (this.cursors.left.isDown)
        {
            this.instance.body.velocity.x = -150;

            if (this.facing != 'left')
            {
                this.instance.animations.play('left');
                this.facing = 'left';
            }
        }
        else if (this.cursors.right.isDown)
        {
            this.instance.body.velocity.x = 150;

            if (this.facing != 'right')
            {
                this.instance.animations.play('right');
                this.facing = 'right';
            }
        }
        else
        {
            if (this.facing != 'idle')
            {
                this.instance.animations.stop();

                if (this.facing == 'left')
                {
                    this.instance.frame = 0;
                }
                else
                {
                    this.instance.frame = 5;
                }

                this.facing = 'idle';
            }
        }
        
        // if (this.jumpButton.isDown && this.instance.body.onFloor() && this.game.time.now > this.jumpTimer)
        // {
            
        // }
	},
    /*
        get instance player, digunakan untuk keperluar registrasi button
     */
	getPlayer:function(){
		return this.instance;
	},
    /*
        Get id dari player == id socket
     */
    getId : function(){
        return this.id;
    }
}