import { Entity, Vector2 } from "../game-engine/game-engine.js";
import { winHeight, winWidth } from "../game-engine/config.js";

export class Enemy extends Entity
{
    playerRef;
    moveObject = false;

    constructor(speed, player)
    {
        super();
        this.speed = speed;
        this.playerRef = player;
        this.position = new Vector2(Math.random() * winWidth, Math.random() * winHeight);
    }

    awake()
    {
        this.moveObject = true;
    }

    update()
    {
        if (!this.moveObject) return;

        const player = this.playerRef;
        const hasCollisionWithPlayer = Vector2.distance(player.position, this.position) < this.speed * .5 + player.radius + this.radius;

        if (!hasCollisionWithPlayer) this.moveToPosition(player.position);
    }
}