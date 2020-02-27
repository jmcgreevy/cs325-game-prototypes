"use strict";

var GameOver = function( game) {

	var music = null;
    //var titleText;
    
    //var styleTitle;
    
    //var noteText;
    //var noteStyle;

    function startGame() {
		
		// Stop the music (even though I didn't get it to work)
        music.stop();

        //	This goes back to the title screen
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
    
			
            game.add.sprite(0, 0, 'gameOver');
			/*
            noteStyle = {font: " 14px Arial", fill: "#ff004d", align: "center"};
            styleTitle = {font: "98px Arial", fill: "#ff004d", align: "center"};

            titleText = game.add.text(game.world.centerX, game.world.centerY - 100, "Game Over", styleTitle);
            titleText.anchor.set(0.5);

            noteText = game.add.text(game.world.centerX, game.world.height -50, "Click to go to main menu", noteStyle);
            noteText.anchor.set(0.5);
			*/

            music = game.add.audio('catMusic');
            music.play();

        },
    
		// If the player clicks the left mouse button, the game will restart
        update: function () {
            if(game.input.activePointer.isDown)
            {
                startGame();
            }
        }
    };
};