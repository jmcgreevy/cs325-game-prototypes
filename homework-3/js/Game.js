"use strict";

GameStates.makeGame = function( game, shared ) { 
    
	var music;
    var lives = 1;
    var canAmmo;
    var player;
	
    var cansGroup;
    var canArray =[];
    var canBullets;
    var canSpeed = 300;
    var canFireDelay = 100;
    var lastCanShotAt;

    var maxCans = 50;    

	// Variables to allow grandma to pick up nearby cans of cat food
    var vacuumRadius;
    var vacuum = true;

    var Speed = 200;

	// Player Control variables
    var left;
    var right;
    var up;
    var down;
    var space;
	
	// Enemy variables
    var maxEnemies = 10;
    var enemies;
	
    var style;
    var bulletText;

	// This spawns cats outside of the screen
    function spawnEnemy(x, y)
    {
        var enemy = enemies.getFirstDead();

        if(enemy === null)
        {
            enemy = new Enemy(game);
            enemies.add(enemy);
        }

        enemy.revive();

        enemy.x = x;
        enemy.y = y;
    }

	// This allows the grandma to shoot cans of catfood at the horde of kitties
    function shootCan()
    {
        if(lastCanShotAt === undefined) lastCanShotAt = 0;
        if(game.time.now - lastCanShotAt < canFireDelay) return;

        lastCanShotAt = game.time.now;

        var can = canBullets.getFirstDead();

        if(can === null || can === undefined) return;

        if(canArray.length <= 0) return;

        can.revive();

        can.frame = canArray.pop();
        can.checkWorldBounds = true;
        can.outOfBoundsKill = true;
        can.reset((Math.cos((player.rotation) % (2 *Math.PI)) * 15) + player.x, (Math.sin((player.rotation) % (2 *Math.PI)) * 15) + player.y);
        
        can.rotation = player.rotation;

        can.body.velocity.x = Math.cos(can.rotation) * canSpeed;
        can.body.velocity.y = Math.sin(can.rotation) * canSpeed;   
    }

    function spawnCan(x,y, rotation, speed)
    {
        var can = cansGroup.getFirstDead();
        if(can === null)
        {
            can = game.add.sprite(0,0, 'cans');
                cansGroup.add(can);
                can.anchor.setTo(0.5,0.5);
                game.physics.arcade.enable(can);
                can.kill();
        }
        can.revive();
        can.frame = game.rnd.integerInRange(0,25);
        can.vacuum = false;
        can.body.velocity.x = Math.cos(rotation) * speed;
        can.body.velocity.y = (Math.sin(rotation) * speed);
        can.checkWorldBounds = true;
        can.outOfBoundsKill = true;
        can.x = x;
        can.y = y;

    }

    var Enemy = function(game, x,y)
    {
        Phaser.Sprite.call(this, game, x,y, 'enemy');
        this.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this);
        
        this.body.setCircle(16);

        this.health = 1;
        this.turnDirection = 1;
        this.SPEED = 150;
        this.CANDELAY = 5000;
        this.LASTCANFIRED;
        this.distanceToPlayer = 0;
    }

    Enemy.prototype = Object.create(Phaser.Sprite.prototype);
    Enemy.prototype.constructor = Enemy;

    Enemy.prototype.damage = function()
    {
        this.health -= 1;
        if(this.health <= 0)
        {
            this.alive = false;
            this.kill();
        }
    }
    Enemy.prototype.update = function()
    {
      
        this.rotation = game.physics.arcade.angleToXY(this, player.x, player.y);


        this.distanceToPlayer = game.math.distance(this.x,this.y, player.x, player.y);
        
        
        this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
        this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;

        if(this.LASTCANFIRED ===undefined)
        {
            this.LASTCANFIRED = 0;
        }
        if(game.time.now - this.LASTCANFIRED > this.CANDELAY)
        {
            this.LASTCANFIRED = game.time.now;
            
        }

            if(this.health <= 0)
            {
                game.camera.shake(0.01, 200);
                this.kill();
            }
        
    }

	// Increases the number of cats as the game goes on
    function updateCounter()
    {
        maxEnemies += 2;
       
    }

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        // Then finally the game over screen
        music.stop();
        lives = 1;
        canAmmo = 0;

        maxEnemies = 10;
        maxCans = 150;
        enemies.killAll();
        cansGroup.killAll();
        game.state.start('GameOver', true);

    }
    
    return {
    
        create: function () {
           
			// Load in the music (I couldn't get this to work)
            music = game.add.audio('catMusic');
            music.play();
            
			// Load font for UI
			style = {font: "25px Comic Sans", fill: "#ffffff"};
			
			// Track grandma's ammo on screen
            bulletText = game.add.text(0, 0, "Cans of food: 0");

			// Game Background
            game.stage.backgroundColor = 0x5f574f;
			
			// Spawn grandma in the center of the game
            player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
            player.anchor.setTo(0.5, 0.5);
            
            // Using Phaser arcade physics
            game.physics.startSystem(Phaser.Physics.Arcade); 
            game.physics.arcade.enable(player, true);

            player.body.setCircle(16);
            player.body.collideWorldBounds= true;

			// Setting up controls (general movement + bullet time)
            left = game.input.keyboard.addKey(Phaser.Keyboard.A);
            right = game.input.keyboard.addKey(Phaser.Keyboard.D);
            up = game.input.keyboard.addKey(Phaser.Keyboard.W);
            down = game.input.keyboard.addKey(Phaser.Keyboard.S);
            space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


            cansGroup = game.add.group();
            for(var i = 0; i < 200; i++)
            {
                var canS = game.add.sprite(0,0, 'cans');
                cansGroup.add(canS);
                canS.anchor.setTo(0.5,0.5);
                game.physics.arcade.enable(canS);
                canS.kill();

            }


            canBullets = game.add.group();
            for(var i = 0; i < 200; i++)
            {
                var canBullet = game.add.sprite(0,0, 'cans');
                canBullets.add(canBullet);

                canBullet.anchor.setTo(0.5,0.5);
                game.physics.arcade.enable(canBullet);
                canBullet.kill();
            }

            enemies = game.add.group();

        },
    
        update: function () {
            
			// UI of grandma's "ammo" cans of catfood
            bulletText.setText("Cans of food: " + canArray.length);

			// Quit game on player death
            if(lives <= 0)
            {
                quitGame();
            }

            // If there's less cans of catfood then there should be, spawn more
            if(cansGroup.countLiving() < maxCans)
            {
                spawnCan(game.rnd.integerInRange(0, game.world.width), game.rnd.integerInRange(0, game.world.width), 0, 0);
            }
            
			// Use phaser arcade physics for collision
            var playerhit= game.physics.arcade.collide(player,enemies);
            
			// Reduce player lives if hit
            if(playerhit)
            {
                lives--;
            }

			// Use phaser arcade physics for aiming
            player.rotation = game.physics.arcade.angleToPointer(player);
      
            //player.frame = 0;
			
			// Player movement controls
            if(up.isDown)
            {
                player.body.velocity.y = -Speed;
            } else if( down.isDown)
            {
                player.body.velocity.y = Speed;
            } else
            {
                player.body.velocity.y = 0;
            }

            if(left.isDown)
            {
                player.body.velocity.x = -Speed;
            } else if(right.isDown)
            {
                player.body.velocity.x = Speed;
            } else
            {
                player.body.velocity.x = 0;
            }
			
			// Grandma's Bullet-time
			if(space.isDown)
			{
				game.camera.shake(0.01, 50);
				Speed = 400;
				Enemy.SPEED = 75;
			} else
			{
				Speed = 200;
				Enemy.SPEED = 150;
			}
            
			// Mouse 1 fires cans at the cats and you can't pick up cans while you're firing
            if(game.input.activePointer.isDown)
            {
                shootCan();
            } else
            {
                cansGroup.forEachAlive(function(m)
                {
                    var distance = this.game.math.distance(m.x,m.y, player.x, player.y)

                    if(distance< 100)
                    {
                         m.vacuum = true;
                    }
					
                }, this);
            } 
	
            // Vacuum up cans of catfood that are within range
            cansGroup.forEachAlive(function(m)
            {
                var distance = this.game.math.distance(m.x,m.y, player.x, player.y)
                
                if(m.vacuum === true)
                {
                    game.physics.arcade.moveToObject(m, player, 600);

                    if(distance < 5)
                    {
                        canArray.unshift(m.frame);
                        m.kill();
                    }
                }

            }, this);
			
			// Spawn more enemies in
            if(enemies.countLiving() < maxEnemies)
            {
                
                var randomNum = game.rnd.integerInRange(0,3);

                if(randomNum === 0)
                {
                    spawnEnemy(game.rnd.integerInRange(0,game.world.width), -50);
                } else if (randomNum === 1)
                {
                    spawnEnemy(-50, game.rnd.integerInRange(0, game.world.height));
                } else if( randomNum === 2)
                {
                    spawnEnemy(game.world.width + 50, game.rnd.integerInRange(0, game.world.height));
                }else
                {
                    spawnEnemy(game.rnd.integerInRange(0,game.world.width), game.world.height + 50);
                }
            }
            
            canBullets.forEachAlive(function(m)
            {
                
                if(m.body.velocity.x === 0 && m.body.velocity.y === 0)
                {
                    m.kill();
                }
            },this);
            
            enemies.forEachAlive(function(m)
            {
                game.physics.arcade.collide(m,enemies);
                var hit = game.physics.arcade.collide(m, canBullets);
                if(hit)
                {
                    m.x +=  (Math.cos((m.rotation + Math.PI) % (2 *Math.PI)) * 20);
                    m.y +=  (Math.sin((m.rotation + Math.PI) % (2 *Math.PI)) * 20);
                    m.kill();
                }
            },this);
            
        }
    };
};