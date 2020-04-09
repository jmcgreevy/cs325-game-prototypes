export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // Images
        this.load.image('titleBackground', 'assets/images/background.png');

        // Bitmap font
        this.load.bitmapFont('myFont', 'assets/font/font.png', 'assets/font/font.fnt');

        // Sprites
        this.load.spritesheet('player', 'assets/sprites/dev_player.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('crosshair', 'assets/sprites/crosshair.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('bullet_small', 'assets/sprites/bullet_small.png', {
            frameWidth: 8,
            frameHeight: 8
        });

        // Audio
        this.load.audio('button', 'assets/audio/button_click01.ogg');
        this.load.audio('menuSong', 'assets/audio/menu_song.ogg');
        this.load.audio('bullet_small_audio', 'assets/audio/bullet_small.ogg');

        // Tilemap loading
        this.load.image('terrain', 'assets/tiles/textures.png');
        this.load.tilemapTiledJSON('map', 'assets/maps/dev_map.json');
    }

    create() {
        // Starting Menu scene
        this.scene.start('Menu', { firstInstance: true });
    }
}