"use strict";

GameStates.makeIntro = function (game, shared) {

    this.lines = [
        "ARRRRRGGGGHHH lassie, it be me lunch time.\n(ENTER to continue)",
        "Go make me a wich of the sand the way a rrrrreal pirate does.\n(ENTER to continue)",
        "What's that? YE DON'T KNOW HOW TO?!?!?!!\n(ENTER to continue)",
        "Well let me teach ye young swachbuckler.\n(ENTER to continue)",
        "We load up that there cannon with our ingredients\nAND SHOOT EM AT THE CREWWWWW!\n(ENTER to continue)",
        "They'll be at the other end of the ship holding plates and\nrunning around like a bunch of headless chickens. \n(ENTER to continue)",
        "Yer goal is get as many ingredients on the plate as possible.\n(ENTER to continue)",
        "You can do this by moving and aiming the cannon with W,A,S,D\nand fire the cannon with F!!\n(ENTER to continue)",
        "Also... one more thing, different ingredients weigh\ndifferent amounts which you'll need to account for in aiming.\n(ENTER to continue)",
        "Don't worry, I'll tell ye the weights before ye begin firing.\n(ENTER to continue)",
        "One last thing, as with any pirate, I'll need my tea.\nSo landing that will get ye twice the normal points!!!!\n(ENTER to continue)",
        "And like any pirate, I'll need to drink it through my bendy straw.\nSo landing that will DOUBLE YE SCORE!!!!!!\n(ENTER to continue)",
        "NOW GET OUT THERE AND EARN YER PAY LASSIE!\n(ENTER to continue)",
    ];
    
    this.text = null;
    
    this.sentenceIndex = 0;
    this.lineIndex = -1;
    // this.enterKey = null;
    this.clickForward = null;
    
    this.captain = null;
	
	function create() {

        this.game.add.sprite(0, 0, 'shipb');
        
        var style = { font: "25px Times New Roman", fill: "#ffffff", align: "center" };
        this.text = this.add.text( this.world.centerX, 15, "test", style );
        this.text.anchor.setTo( 0.5, 0.0 );

        //this.enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		this.clickForward = this.input(game.input.activePointer.isDown);
        //this.enterKey.onDown.add(function() { this.nextLine(); }, this);
		this.clickForward.add(function() { this.nextLine(); }, this);
        
		// Puts the sprite in the middle of the scren
        this.captain = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY,
            'captain');
        this.captain.anchor.setTo(.5, .5);
        
		//this.game.add.audio('fx').play();
		//this.game.add.audio('music').play();
		
        this.nextLine();
	}

    function addLetter() {
        
        if(this.lineIndex >= this.lines.length){
            this.text.setText("");
            return;
        }
        
        this.text.setText(this.lines[this.lineIndex].substring(0, this.sentenceIndex));
        this.sentenceIndex++;
        
        if(this.sentenceIndex % 5 == 0){
            this.captain.frame = (this.captain.frame == 0 ? 1 : 0);
        }
    }
    
    function nextLine() {

        this.time.events.removeAll();
        this.lineIndex++;
        
        this.text.setText("");
        
        if(this.lineIndex >= this.lines.length){
            this.enterKey.reset(true);
            this.startGame();
            return;
        }
        
        this.sentenceIndex = 0;
        this.captain.frame = 0;
        
        this.time.events.repeat(.05, this.lines[this.lineIndex].length + 1, this.addLetter, this);
    }

    function startGame() {
		this.state.start('Game');
	}
};

/*
GameStates.Intro.prototype = {
    
	create: function () {

        this.game.add.sprite(0, 0, 'shipb');
        
        var style = { font: "25px Times New Roman", fill: "#ffffff", align: "center" };
        this.text = this.add.text( this.world.centerX, 15, "test", style );
        this.text.anchor.setTo( 0.5, 0.0 );

        //this.enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		this.clickForward = this.input(game.input.activePointer.isDown);
        //this.enterKey.onDown.add(function() { this.nextLine(); }, this);
		this.clickForward.add(function() { this.nextLine(); }, this);
        
		// Puts the sprite in the middle of the scren
        this.captain = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY,
            'captain');
        this.captain.anchor.setTo(.5, .5);
        
		//this.game.add.audio('fx').play();
		//this.game.add.audio('music').play();
		
        this.nextLine();
	},

    addLetter: function () {
        
        if(this.lineIndex >= this.lines.length){
            this.text.setText("");
            return;
        }
        
        this.text.setText(this.lines[this.lineIndex].substring(0, this.sentenceIndex));
        this.sentenceIndex++;
        
        if(this.sentenceIndex % 5 == 0){
            this.captain.frame = (this.captain.frame == 0 ? 1 : 0);
        }
    },
    
    nextLine: function () {

        this.time.events.removeAll();
        this.lineIndex++;
        
        this.text.setText("");
        
        if(this.lineIndex >= this.lines.length){
            this.enterKey.reset(true);
            this.startGame();
            return;
        }
        
        this.sentenceIndex = 0;
        this.captain.frame = 0;
        
        this.time.events.repeat(.05, this.lines[this.lineIndex].length + 1, this.addLetter, this);
    },

    startGame: function () {
		this.state.start('Game');
	}
};
*/