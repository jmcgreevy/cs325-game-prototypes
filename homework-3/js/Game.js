"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    
    
	var music;
    var lives = 1;
    var canAmmo;
    var player;
	
    var lettersGroup;
    var letterArray =[];
    var lettersBullets;
    var LBspeed = 300;
    var letterShotDelay = 100;
    var lastLetterShotAt;

    var maxLetters = 150;    

    var vacuumRadius;
    var vacuum = true;

    var Speed = 200;

	// Player Control variables
    var left;
    var right;
    var up;
    var down;
    var space;
	
    var maxEnemies = 10;
    var enemies;
	
    var style;
    var bulletText;
    //var timer;
   

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

    function shootLetter()
    {
        if(lastLetterShotAt === undefined) lastLetterShotAt = 0;
        if(game.time.now - lastLetterShotAt < letterShotDelay) return;

        lastLetterShotAt = game.time.now;

        var letter = lettersBullets.getFirstDead();

        if(letter === null || letter === undefined) return;

        if(letterArray.length <= 0) return;

        letter.revive();

        letter.frame = letterArray.pop();
        //letter.frame = game.rnd.integerInRange(0,25);
        letter.checkWorldBounds = true;
        letter.outOfBoundsKill = true;
        letter.reset((Math.cos((player.rotation) % (2 *Math.PI)) * 15) + player.x, (Math.sin((player.rotation) % (2 *Math.PI)) * 15) + player.y);
        
         
        letter.rotation = player.rotation;

        letter.body.velocity.x = Math.cos(letter.rotation) * LBspeed;
        letter.body.velocity.y = Math.sin(letter.rotation) * LBspeed;   
        //knockback();
    }

    function spawnLetter(x,y, rotation, speed)
    {
        var letter = lettersGroup.getFirstDead();
        if(letter=== null)
        {
            letter = game.add.sprite(0,0, 'letters');
                lettersGroup.add(letter);
                letter.anchor.setTo(0.5,0.5);
                game.physics.arcade.enable(letter);
                letter.kill();
        }
        letter.revive();
        letter.frame = game.rnd.integerInRange(0,25);
        letter.vacuum = false;
        letter.body.velocity.x =Math.cos(rotation) * speed;
        letter.body.velocity.y = (Math.sin(rotation) * speed);
        //letter.body.drag.setTo(vomitDrag,vomitDrag);
        letter.checkWorldBounds = true;
        letter.outOfBoundsKill = true;
        letter.x = x;
        letter.y = y;

    }

    var Enemy = function(game, x,y)
    {
        Phaser.Sprite.call(this, game, x,y, 'enemy');
        this.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this);
        
        this.body.setCircle(16);

        this.health = 1; // was 5
        this.turnDirection = 1;
        this.SPEED = 75;
        this.LETTERDELAY = 5000;
        this.LASTLETTERFIRED;
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

        if(this.LASTLETTERFIRED ===undefined)
        {
            this.LASTLETTERFIRED = 0;
        }
        if(game.time.now - this.LASTLETTERFIRED > this.LETTERDELAY)
        {
            this.LASTLETTERFIRED = game.time.now;
            //vomitLetters(this.x, this.y, this.direction);
            
        }

            if(this.health <= 0)
            {
                game.camera.shake(0.01, 200);
                this.kill();
            }
        
    }

    function updateCounter()
    {
        maxEnemies += 2;
       
    }

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        music.stop();
        lives = 1;
        canAmmo = 0;

        maxEnemies = 10;
        maxLetters = 150;
        enemies.killAll();
        lettersGroup.killAll();
        game.state.start('GameOver', true);

    }
    
    return {
    
        create: function () {
           
            music = game.add.audio('catMusic');
            music.play();
            
            //style = {font: "14px Arial", fill: "#ffffff"};
			style = {font: "25px Comic Sans", fill: "#ffffff"};

            //healthText = game.add.text(0,0, "Health: 3");
            bulletText = game.add.text(0, 0, "Cans of food: 0");
            //SpecialText = game.add.text(0,48 , "BOMB"); 
            //SpecialText.addColor('#5f574f',0);
            game.stage.backgroundColor = 0x5f574f;
            player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
            
            player.anchor.setTo(0.5, 0.5);
            
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            game.physics.startSystem(Phaser.Physics.Arcade); 
            game.physics.arcade.enable(player, true);

            player.body.setCircle(16);
            player.body.collideWorldBounds= true;



            left = game.input.keyboard.addKey(Phaser.Keyboard.A);
            right = game.input.keyboard.addKey(Phaser.Keyboard.D);
            up = game.input.keyboard.addKey(Phaser.Keyboard.W);
            down = game.input.keyboard.addKey(Phaser.Keyboard.S);
            space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            //shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

            lettersGroup = game.add.group();
            for(var i = 0; i < 200; i++)
            {
                var letterS = game.add.sprite(0,0, 'letters');
                lettersGroup.add(letterS);
                letterS.anchor.setTo(0.5,0.5);
                game.physics.arcade.enable(letterS);
                letterS.kill();

            }


            lettersBullets = game.add.group();
            for(var i = 0; i < 200; i++)
            {
                var letterBullet = game.add.sprite(0,0, 'letters');
                lettersBullets.add(letterBullet);

                letterBullet.anchor.setTo(0.5,0.5);
                game.physics.arcade.enable(letterBullet);
                letterBullet.kill();
            }

            enemies = game.add.group();
            
           //timer = game.time.create(false);
           //timer.loop(5000, updateCounter, this);
           //timer.start();
        },
    
        update: function () {
            
            bulletText.setText("Cans of food: " + letterArray.length);
            //healthText.setText("Health: " + lives);

            if(lives <= 0)
            {
                quitGame();
            }

            
            if(lettersGroup.countLiving() < maxLetters)
            {
                spawnLetter(game.rnd.integerInRange(0, game.world.width), game.rnd.integerInRange(0, game.world.width), 0, 0);
            }
            
            var playerhit= game.physics.arcade.collide(player,enemies);
            
            if(playerhit)
            {
                lives--;
            }

            player.rotation = game.physics.arcade.angleToPointer(player);
            
            player.frame = 0;
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
			if(space.isDown){
				Speed = 300;
				Enemy.SPEED = 30
			} else
			{
				Speed = 200;
				Enemy.SPEED = 75;
			}
            
            if(game.input.activePointer.isDown)
            {
                shootLetter();
                //spawnPhrase(game.input.x, game.input.y,3);
            } else
            {
                player.frame = 7;
                lettersGroup.forEachAlive(function(m)
                {
                    var distance = this.game.math.distance(m.x,m.y, player.x, player.y)

                    if(distance< 100)
                    {
                         m.vacuum = true;
                    }

                    
                }, this);
            } 
	
            
            lettersGroup.forEachAlive(function(m)
            {
                var distance = this.game.math.distance(m.x,m.y, player.x, player.y)
                //game.physics.arcade.collide(m,lettersGroup);
                
                if(m.vacuum === true)
                {
                    game.physics.arcade.moveToObject(m, player, 600);

                    if(distance < 5)
                    {
                        letterArray.unshift(m.frame);
                        m.kill();
                    }
                }

            }, this);
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
            
            lettersBullets.forEachAlive(function(m)
            {
                
                if(m.body.velocity.x === 0 && m.body.velocity.y === 0)
                {
                    m.kill();
                }
            },this);
            
            enemies.forEachAlive(function(m)
            {
                game.physics.arcade.collide(m,enemies);
                var hit = game.physics.arcade.collide(m, lettersBullets);
                if(hit)
                {
                    m.x +=  (Math.cos((m.rotation + Math.PI) % (2 *Math.PI)) * 20);
                    m.y +=  (Math.sin((m.rotation + Math.PI) % (2 *Math.PI)) * 20);
                    //m.damage();
                    game.camera.shake(0.01, 200);
                    m.kill();

                }
            },this);
            
        }
    };
};