"use strict";

GameStates.makeMainMenuTwo = function( game, shared ) {

	var music = null;
	var playButton1 = null;
	var playButton2 = null;
	var playButton3 = null;
	var playButton4 = null;
    
    function startGame(pointer) {

        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        //music.stop();

        //	And start the actual game
        game.state.start('Game');

    }
	
	function optionOne(pointer) {
		
		game.state.start('OptionOne');
	}
	
	function optionTwo(pointer) {
		
		game.state.start('OptionTwo');
	}
	
	function optionThree(pointer) {
		
		game.state.start('OptionThree');
	}
	
	function optionFour(pointer) {
		
		game.state.start('OptionFour');
	}
    
    return {
    
        create: function () {
    
            //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
            //	Here all we're doing is playing some music and adding a picture and button
            //	Naturally I expect you to do something significantly better :)
    
            //music = game.add.audio('titleMusic');
            //music.play();
    
            game.add.sprite(0, 0, 'titlePage2');
    
            playButton1 = game.add.button( 10, 200, 'selectButton', optionOne, null, 'over', 'out', 'down');
			playButton1.scale.setTo(1.2, 5);
			
			playButton2 = game.add.button( 240, 200, 'selectButton', optionTwo, null, 'over', 'out', 'down');
			playButton2.scale.setTo(1.2, 5);
			
			playButton3 = game.add.button( 480, 200, 'selectButton', optionThree, null, 'over', 'out', 'down');
			playButton3.scale.setTo(1, 5);
		
			playButton4 = game.add.button( 670, 360, 'selectButton', optionFour, null, 'over', 'out', 'down');
			playButton4.scale.setTo(0.6, 2.5);
    
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }
        
    };
};
