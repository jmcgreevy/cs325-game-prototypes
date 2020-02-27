"use strict";

var GameOver = function( game) {

	var music = null;

    function startGame() {
		
		// Stop the music (even though I didn't get it to work)
        music.stop();

        //	This goes back to the title screen
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
    
			
            game.add.sprite(0, 0, 'gameOver');
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