'use strict';

import { config } from '../index.js';
import { TextButton } from '../objects/TextButton.js';

export class Controls extends Phaser.Scene {
    constructor() {
        super('Controls');
    }

    create() {
        this.add.image(0, 0, 'titleBackground').setOrigin(0, 0);

        // Bitmap texts
        this.add.bitmapText(6, config.height-24, 'myFont', 'Made by David Mark McMasters', 16);
        this.add.bitmapText((config.width/2), (config.height/2)-160, 'myFont', 'Move: W A S D', 48).setOrigin(0.5);
        this.add.bitmapText((config.width/2), (config.height/2)-96, 'myFont', 'Look/Aim: Mouse', 48).setOrigin(0.5);
        this.add.bitmapText((config.width/2), (config.height/2)-32, 'myFont', 'Shoot: Left Click', 48).setOrigin(0.5);
        this.add.bitmapText((config.width/2), (config.height/2)+32, 'myFont', 'Roll: Spacebar', 48).setOrigin(0.5);

        // Sound
        let buttonSound = this.sound.add('button');

        // Back button
        let backButton = new TextButton(
            this, config.width/2, (config.height/2)+208,
            'myFont',
            'Back',
            48,
            () => {
                buttonSound.play();
                this.scene.start('Menu', { firstInstance: false });
            }
        ).setOrigin(0.5);
        this.add.existing(backButton);
    }
}