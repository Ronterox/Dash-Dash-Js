import { GameObject, Hitbox, Vector2 } from "../game-engine/game-engine.js";
import { getRandomInteger } from "../utils/utilities.js";
import { TriangleParticle } from "../game-engine/particle-system.js";

export class Block extends GameObject
{
    _hitbox;
    _color;

    constructor(size = { width: 50, height: 50 }, position = new Vector2(), color = 0)
    {
        super();
        this._hitbox = new Hitbox(size, position);
        this._color = color;
    }

    awake()
    {
        this._hitbox.onCollisionEnter.addListener((myHitbox, collision) =>
        {
            const tag = collision.tag;
            if (tag === 'Player') this.break();
        });
    }

    generateParticles()
    {
        const hitbox = this._hitbox;
        const numberOfParticlesPerSize = Math.floor(hitbox.size.width * 0.1);
        let numberOfParticles = numberOfParticlesPerSize < 3 ? 3 : numberOfParticlesPerSize;

        const myColors = [`hsl(${this._color},30%,45%)`, `hsl(${this._color},20%,50%)`]

        const position = hitbox.position;
        while (numberOfParticles--) new TriangleParticle(position.asValue, {
            top: getRandomInteger(20, 60),
            right: getRandomInteger(20, 60),
            left: getRandomInteger(20, 60)
        }, getRandomInteger(3, 8), myColors.getRandomValue());
    }

    break()
    {
        this.generateParticles()
        this._hitbox.destroy();
        this.destroy();
    }

    draw(ctx)
    {
        const hitbox = this._hitbox;

        const { x, y } = hitbox.position;
        const { width, height } = hitbox.size;

        const oldFillStyle = ctx.fillStyle;

        ctx.fillStyle = `hsl(${this._color},30%,45%)`;

        ctx.fillRect(x - width * .5, y - height * .5, width, height);

        ctx.fillStyle = `hsl(${this._color},20%,50%)`;

        const insideWidth = width * .7;
        const insideHeight = height * .7;

        ctx.fillRect(x - insideWidth * .5, y - insideHeight * .5, insideWidth, insideHeight);

        ctx.fillStyle = oldFillStyle;

        // this._hitbox.draw(ctx);
    }
}