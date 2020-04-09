'use strict';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, bulletType) {
        super(scene, 0, 0, 'bullet_small');

        this.type = bulletType;
        
        //this.setBlendMode(1);
        this.setDepth(1);

        this.speed = 1000;
        this.lifespan = 1000;

        this._temp = new Phaser.Math.Vector2();
    }

    update(time, delta) {
        this.lifespan -= delta;

        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
    }

    fire(player) {
        this.lifespan = 1000;
        this.setActive(true);
        this.setVisible(true);
        this.setAngle(player.body.rotation - (Math.PI / 2));
        this.setPosition(player.x, player.y);
        this.body.reset(player.x, player.y);

        let angle = Phaser.Math.DegToRad(player.body.rotation) - (Math.PI / 2);
        this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);

        this.body.velocity.x *= 1.5;
        this.body.velocity.y *= 1.5;
    }

    onHitHandler() {
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
    }
}