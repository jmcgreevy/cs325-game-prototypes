'use strict';

import { gameSettings } from '../index.js';
import { lineLength } from '../index.js';
import { Bullet } from '../objects/Bullet.js';
import { Player } from '../objects/Player.js';
import { pickSpawn } from '../index.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        // Tilemap
        this.map = this.add.tilemap('map');
        let terrain = this.map.addTilesetImage('textures', 'terrain');

        // Tilemap layers
        this.map.createStaticLayer('ground', [terrain], 0, 0);
        let wallsLayer = this.map.createStaticLayer('walls', [terrain], 0, 0);

        // Physics groups
        this.players = this.physics.add.group({
            classType: Player,
            maxSize: 8,
            runChildUpdate: true
        });
        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 100,
            runChildUpdate: true
        });
        this.testAIbullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 100,
            runChildUpdate: true
        });

        // Player and crosshair
        this.player = new Player(this, 0, pickSpawn(true));
        this.player.setCollideWorldBounds(true);
        this.crosshair = this.add.sprite(0, 0, 'crosshair').setOrigin(0.5);

        // Test AI
        this.testAI = new Player(this, 1, pickSpawn(true));
        this.testAI.setCollideWorldBounds(true);

        // Physics
        wallsLayer.setCollisionByProperty({collide: true});
        this.physics.add.collider(this.players, wallsLayer);
        this.physics.add.collider(this.bullets, wallsLayer, (bullet) => { bullet.onHitHandler() });
        this.physics.add.collider(this.testAIbullets, wallsLayer, (bullet) => { bullet.onHitHandler() });
        this.physics.add.overlap(this.bullets, this.players, this.bulletPlayerCollider.bind(this));
        this.physics.add.overlap(this.testAIbullets, this.players, this.bulletTestAICollider.bind(this));

        // Audio
        this.bulletSmallAudio = this.sound.add('bullet_small_audio');

        // Input listeners
        this.input.mouse.capture = true;
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.sprintKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Camera / Mouse Initialization
        this.camera = this.cameras.main;
        this.camera.startFollow(this.player, true, 1.00, 1.00);
        this.mousePos = this.camera.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y);

        // World Bounds
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        
        // On-click event handler
        this.input.on('pointerdown', (function (pointer) {
            this.fireWeapon();
        }).bind(this));

        // Aiming debugging tools
        this.debug_aimLine = this.add.line(this.player.x, this.player.y, 0, 0, 0, 0, 0x00FF00).setOrigin(0);
        this.debug_xAimLine = this.add.line(this.player.x, this.player.y, 0, 0, 0, 0, 0x0000FF).setOrigin(0);
        this.debug_yAimLine = this.add.line(this.player.x, this.player.y, 0, 0, 0, 0, 0x0000FF).setOrigin(0);
        this.debug_opAimLine = this.add.line(this.player.x, this.player.y, 0, 0, 0, 0, 0xFF0000).setOrigin(0);

        // Debug test AI shooting
        this.time.addEvent({
            delay: 100,
            callback: () => {
                //this.bulletSmallAudio.play();
                let bullet = this.testAIbullets.get();
                if (bullet) {
                    bullet.setDepth(3);
                    bullet.fire(this.testAI);
                }
            },
            callbackScope: this,
            loop: true,
            paused: false
        });
    }

    update() {
        this.playerMovementManager();
        this.ccManager();

        // Debug test AI movement
        this.testAI.rotation += 0.1;
    }

    // Player movement manager
    playerMovementManager() {
        // W Key
        if (this.upKey.isDown) {
            this.player.setVelocityY(-gameSettings.playerSpeed);
            this.player.setVelocityX(0);
        }
        // S Key
        else if (this.downKey.isDown) {
            this.player.setVelocityY(gameSettings.playerSpeed);
            this.player.setVelocityX(0);
        }
        // A Key
        else if (this.leftKey.isDown) {
            this.player.setVelocityX(-gameSettings.playerSpeed);
            this.player.setVelocityY(0);
        }
        // D Key
        else if (this.rightKey.isDown) {
            this.player.setVelocityX(gameSettings.playerSpeed);
            this.player.setVelocityY(0);
        }
        // Not moving
        else {
            this.player.setVelocity(0);
        }
    }

    // Camera and Crosshair Manager
    ccManager() {
        this.mousePos = this.camera.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y);
        // This is for rotational debugging
        this.debugAimLineUpdate();

        // Calculating the angle and checking which quadrant the mouse is relative to player
        let cameraAngle = Math.asin(lineLength(this.mousePos.x-this.player.x, 0, this.mousePos.x-this.player.x, this.mousePos.y-this.player.y)/(lineLength(0, 0, this.mousePos.x-this.player.x, this.mousePos.y-this.player.y)));
        if (this.mousePos.x >= this.player.x && this.mousePos.y <= this.player.y) {
            this.player.setRotation(-(cameraAngle - (Math.PI/2)));
        }
        else if (this.mousePos.x <= this.player.x && this.mousePos.y <= this.player.y) {
            this.player.setRotation(-(Math.PI - cameraAngle - (Math.PI/2)));
        }
        else if (this.mousePos.x <= this.player.x && this.mousePos.y >= this.player.y) {
            this.player.setRotation(-(Math.PI + cameraAngle - (Math.PI/2)));
        }
        else {
            this.player.setRotation(-((2 * Math.PI) - cameraAngle - (Math.PI/2)));
        }

        // Tracking the crosshair with the mouse
        this.crosshair.x = this.mousePos.x;
        this.crosshair.y = this.mousePos.y;

    }

    // Debug aim lines
    debugAimLineUpdate() {
        this.debug_aimLine.x = this.player.x;
        this.debug_aimLine.y = this.player.y;
        this.debug_xAimLine.x = this.player.x;
        this.debug_xAimLine.y = this.player.y;
        this.debug_yAimLine.x = this.player.x;
        this.debug_yAimLine.y = this.player.y;
        this.debug_opAimLine.x = this.player.x;
        this.debug_opAimLine.y = this.player.y;
        this.debug_aimLine.setTo(0, 0, this.mousePos.x-this.player.x, this.mousePos.y-this.player.y);
        this.debug_xAimLine.setTo(-64, 0, 64, 0);
        this.debug_yAimLine.setTo(0, -64, 0, 64);
        this.debug_opAimLine.setTo(this.mousePos.x-this.player.x, 0, this.mousePos.x-this.player.x, this.mousePos.y-this.player.y);
    }

    // Player firing a weapon
    fireWeapon() {
        this.bulletSmallAudio.play();
        let bullet = this.bullets.get();
        if (bullet) {
            bullet.setDepth(3);
            bullet.fire(this.player);
        }
    }

    // Bullet collider
    bulletPlayerCollider(bullet, target) {
        if (target.id != this.player.id) {
            target.onHitHandler(bullet.type);
            bullet.onHitHandler();
        }
    }

    // Bullet Player collider
    bulletTestAICollider(bullet, target) {
        if (target.id != this.testAI.id) {
            target.onHitHandler(bullet.type);
            bullet.onHitHandler();
        }
    }
}