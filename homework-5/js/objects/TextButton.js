'use strict';

export class TextButton extends Phaser.GameObjects.BitmapText {
    constructor(scene, x, y, font, text, size, callback) {
        super(scene, x, y, font, text, size);

        this.setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.enterButtonHoverState() )
        .on('pointerout', () => this.enterButtonRestState() )
        .on('pointerdown', () => this.enterButtonActiveState() )
        .on('pointerup', () => {
            this.enterButtonHoverState();
            callback();
        });
    }

    enterButtonActiveState() {
        this.setTint(0x00FF00);
    }

    enterButtonRestState() {
        this.clearTint();
    }

    enterButtonHoverState() {
        this.setTint(0x00FF00);
    }
}