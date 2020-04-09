'use strict';

import { pickSpawn } from '../index.js';

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, id, spawnPoint) {
        super(scene, spawnPoint.x, spawnPoint.y, 'player');
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        scene.players.add(this);

        // Player parameters
        this.id = id;
        this.hp = 100;

        // Rendering options
        this.setActive(true);
        this.setTint(Math.floor(Math.random()*0xFFFFFF));
    }

    update() {
        // Death Handler
        if (this.hp <= 0) {
            this.setVisible(false);
            this.setActive(false);
            this.hp = 100;
            let newSpawn = pickSpawn(false);
            this.setX(newSpawn.x);
            this.setY(newSpawn.y);
            this.setActive(true);
            this.setVisible(true);
        }
    }

    // Hit Handler
    onHitHandler(bulletType) {
        switch (bulletType) {
            case (0):
                this.hp -= 10;
                break;
            case (1):
                this.hp -= 20;
                break;
            case (2):
                this.hp -= 40;
                break;
            case (3):
                this.hp -= 65;
                break;
            default:
                this.hp -= 100;
                break;
        }
        console.log(`Player ${this.id}'s Health: ${this.hp} | Hit by bullet of type ${bulletType}`);
    }
}