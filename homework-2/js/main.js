var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    //game.load.image('disk', 'assets/sprites/ra_dont_crack_under_pressure.png');

    //  Firefox doesn't support mp3 files, so use ogg
    this.load.audio('music', 'assets/sonic.mp3');

}

var s;
var music;

function create() {

    game.stage.backgroundColor = '#182d3b';
    game.input.touch.preventDefault = false;

    music = game.add.audio('music');

    music.play();

    s = game.add.sprite(game.world.centerX, game.world.centerY, 'disk');
    s.anchor.setTo(0.5, 0.5);

    game.input.onDown.add(changeVolume, this);

}

function changeVolume(pointer) {

    if (pointer.y < 100)
    {
        music.mute = false;
    }
    else if (pointer.y < 300)
    {
        music.volume += 0.1;
    }
    else
    {
        music.volume -= 0.1;
    }

}

function update() {
    s.rotation += 0.01;
}

function render() {
    game.debug.soundInfo(music, 20, 32);
}