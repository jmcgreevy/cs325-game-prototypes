"use strict";

window.onload = function() {

	//	Create your Phaser game and inject it into the 'game' div.
	//	We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
	var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game' );

	//	Add the States your game has.
	//	You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
	
	// An object for shared variables, so that them main menu can show
	// the high score if you want.
	var shared = {};
	
	// Boot loads in the loading bar and background in preloader
	game.state.add( 'Boot', GameStates.makeBoot( game ) );
	// Preloader loads all the stuff from boot
	game.state.add( 'Preloader', GameStates.makePreloader( game ) );
	// MainMenu loads in the background music and the playbutton before letting you play the game
	game.state.add( 'MainMenu', GameStates.makeMainMenu( game, shared ) );
	
	// Second menu for testing
	game.state.add( 'MainMenuTwo', GameStates.makeMainMenuTwo( game, shared ) );
	
	// Option 1 Screen
	game.state.add( 'OptionOne', GameStates.makeOptionOne( game, shared ) );
	// Option 2 Screen
	game.state.add( 'OptionTwo', GameStates.makeOptionTwo( game, shared ) );
	// Option 3 Screen
	game.state.add( 'OptionThree', GameStates.makeOptionThree( game, shared ) );
	// Option 4 Screen
	game.state.add( 'OptionFour', GameStates.makeOptionFour( game, shared ) );
	
	// Game is the file that actually has the entire game in it
	game.state.add( 'Game', GameStates.makeGame( game, shared ) );
	// GameOver is the state of the game over screen
	game.state.add( 'GameOver', GameOver);

	//	Now start the Boot state.
	game.state.start('Boot');

};
