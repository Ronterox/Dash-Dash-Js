import { Entity, Vector2 } from "../game-engine/game-engine.js";
import { winHeight, winWidth } from "../game-engine/config.js";

export class Enemy extends Entity
{
    playerRef;
    isMoving = false;
    //Turn this into a global event caller with manager
    updateKill;

    constructor(speed, player)
    {
        super();
        this.speed = speed;
        this.playerRef = player;
        this.position = new Vector2(Math.random() * winWidth, Math.random() * winHeight);
        this.updateKill = () => console.error("Enemy update kill method undefined");
    }

    awake()
    {
        this.isMoving = true;
    }

    update()
    {
        if (!this.isMoving) return;

        const player = this.playerRef;
        const hasCollisionWithPlayer = Vector2.distance(player.position, this.position) < this.speed * .5 + player.radius + this.radius;

        if (!hasCollisionWithPlayer) this.moveToPosition(player.position);
        else if (player.isMoving && !player.isPointerDown) this.kill();
    }

    kill()
    {
        this.updateKill();
        this.destroy();
    }
}