import { Entity, Vector2 } from "./game-engine.js";
import { ctx, winHeight, winWidth } from "./config.js";

export class Particle extends Entity
{
    alpha = .5;

    //TODO: Again. don't reinitialize values
    constructor(spawnPosition = new Vector2(0, 0), speed = 1, radius = 5, color = 'red')
    {
        super();
        this.position = spawnPosition;
        this.speed = speed;
        this.radius = radius;
        this.color = color;

        this.velocity = new Vector2((Math.random() - 0.5) * speed, (Math.random() - 0.5) * speed);
    }

    update()
    {
        this.position.add(this.velocity);
        //TODO: if we check for object inside of screen again, make method
        if (this.position.x < 0 || this.position.x > winWidth || this.position.y < 0 || this.position.y > winHeight) this.destroy();
    }

    draw()
    {
        ctx.save();

        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 7);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();
    }
}