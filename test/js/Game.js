"use strict";

BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    /*
    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)
    
    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    */
    
    this.pirate = null;
    this.plate = null;
    
    this.runLength = 300;
    this.runDirection = 1;
    
    this.cannon = null;
    this.itemShot = null;
    
    this.itemOrder = [
        'bread', 'mayo', 'tomato', 'lettuce', 'meat', 'mayo', 'bread', 'teapot', 'straw'
    ];
    
    //vary between 570-640
    this.itemSpeeds = [
        640, 640, 600, 600, 570, 640, 640, 570, 640
    ];
    
    this.tips = [
        "Bread\nLight", "Mayo\nLight", "Tomato\nMedium", "Lettuce\nMedium", "Meat\nHeavy",
        "Mayo\nLight", "Bread\nLight", "Teapot\nHeavy", "Bendy Straw\nLight"
    ];
        
    this.itemIndex = 0;
    this.text = null;
    this.scoreText = null;
    this.score = 0;
	
	this.over = false;
};

BasicGame.Game.prototype = {

    create: function () {
        
        this.game.add.sprite(0, 0, 'shipf');
        
        this.pirate = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'pirate');
        this.pirate.anchor.setTo( 0.5, 0.5 );
        this.pirate.animations.add('right', [0, 1, 2], 5, true);
        this.pirate.animations.add('left', [0, 3, 2], 5, true);
        this.pirate.animations.play(this.runDirection > 0 ? 'right' : 'left');

        this.plate = this.game.add.sprite(0, -75, 'plate');
        this.plate.anchor.setTo(.5, .5);
        this.game.physics.enable(this.plate, Phaser.Physics.ARCADE);
        this.plate.body.allowGravity = false;

        this.pirate.addChild(this.plate);
        
        this.cannon = this.game.add.sprite(this.game.world.centerX, 600, 'cannon');
        this.cannon.anchor.setTo(0.5, 0.5);
        
        this.game.physics.arcade.gravity.y = 500;
        
        var style = { font: "24px Times New Roman", fill: "#0000ff", align: "right" };
        this.text = this.game.add.text(750, 50, "", style);
        this.text.anchor.setTo(1, 0.5);

        style = { font: "24px Times New Roman", fill: "#0000ff", align: "left" };
        this.scoreText = this.game.add.text(50, 50, "", style);
        this.scoreText.anchor.setTo(0, 0.5);
        
        this.nextTip();
        this.updateScore();
    },

    update: function () {

        if(this.itemShot != null){

            if(this.itemShot.rotation > Phaser.Math.degToRad(10) ||
               this.itemShot.rotation < 0){
                            
                this.itemShot.scale.x -= .05;
                this.itemShot.scale.y -= .05;
                this.itemShot.rotation += Phaser.Math.degToRad(3);
                
            }else if (this.itemShot.body){
                this.game.physics.arcade.overlap(this.itemShot, this.plate, 
                    function() { this.itemOverlap(); }, null, this);
                this.itemShot.body.destroy();
                
                if(this.itemShot.parent == this.game.world){
                    this.itemShot.destroy();
                }

                this.nextTip();
                this.itemShot = null;
				
				if(this.itemIndex >= this.itemOrder.length){
					this.over = true;
				}
            }
        }

		if(this.over == true){
			this.pirate.animations.stop();
			this.text.setText("");
			this.scoreText.setText("Score: " + this.score);  
	//		this.scoreText.style = { font: "24px Times New Roman", fill: "#0000ff", align: "center" };
			this.scoreText.style.align = "center";
			this.scoreText.x = this.game.world.centerX;
			this.scoreText.y = 50;
			return;
		}
	
        this.pirate.x += this.runDirection * 3;
        
        if(this.pirate.x > this.runLength + this.game.world.centerX ||
           this.pirate.x < this.game.world.centerX - this.runLength){
            this.runDirection *= -1;
            
            this.pirate.animations.play(this.runDirection > 0 ? 'right' : 'left');
        }
        
        if(this.game.input.keyboard.isDown(Phaser.KeyCode.D) &&
           this.cannon.x < 800){
            this.cannon.x += 6;
        }
        
        if(this.game.input.keyboard.isDown(Phaser.KeyCode.A) &&
           this.cannon.x > 0){ 
            this.cannon.x -= 6;
        }
        
        if(this.game.input.keyboard.isDown(Phaser.KeyCode.W) &&
           this.cannon.y > 500){
            this.cannon.y -= 6;
        }
        
        if(this.game.input.keyboard.isDown(Phaser.KeyCode.S) &&
           this.cannon.y < 600){ 
            this.cannon.y += 6;
        }

        if(this.game.input.keyboard.justPressed(Phaser.KeyCode.F) &&
           this.itemIndex < this.itemOrder.length && this.itemShot == null){
            
            this.itemShot = this.game.add.sprite(this.cannon.x, this.cannon.y - 100, 
                this.itemOrder[this.itemIndex]);
                        
            this.itemShot.anchor.setTo(.5, .5);
            this.itemShot.scale.setTo(7, 7);
            this.itemShot.rotation = Phaser.Math.degToRad(12);
            
            this.game.physics.enable(this.itemShot, Phaser.Physics.ARCADE);
            this.itemShot.body.velocity.y = -this.itemSpeeds[this.itemIndex];
            this.itemIndex++;
            
            this.game.world.bringToTop(this.cannon);
			this.game.add.audio('cannonboom').play();
        }
    },

    nextTip: function () {
         if(this.itemIndex < this.tips.length){
            this.text.setText(this.tips[this.itemIndex]);
         }
    },
    
    updateScore: function () {
        this.scoreText.setText("Current Score: " + this.score);  
    },
    
    itemOverlap: function () {
        this.itemShot.x = this.itemShot.x - this.plate.world.x;
        this.itemShot.y = this.itemShot.y - this.plate.world.y;
        this.plate.addChild(this.itemShot);
        this.game.world.bringToTop(this.itemShot);
        
        if(this.itemIndex == this.itemOrder.length - 1){
            this.score += 2;
        }else if(this.itemIndex == this.itemOrder.length){
            this.score *= 2;
        }else{
            this.score++;
        }
        
		this.game.add.audio('ding').play();
        this.updateScore();
    },
    
    quitGame: function () {
        this.state.start('Intro');
    }
};
