'use strict';

export class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    init() {
        this.input.maxPointers = 1;
    }

    preload() {

    }

    create() {
        this.scene.start('Preloader');
    }
}