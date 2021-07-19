import { Entity, GameObject, Transform, Vector2 } from "./game-engine.js";
import { DEFAULT_COLOR, DEFAULT_RGB, winHeight, winWidth } from "./config.js";
import { getRandomFloat } from "../utils/utilities.js";

class Particle extends GameObject
{
    alpha = .2;
    _radius
    transform;

    checkTemporalCondition;

    constructor(spawnPosition = new Vector2(0, 0), speed = 1, radius = 5, color = DEFAULT_COLOR, isTemporal = false)
    {
        super();
        this.transform = new Transform(spawnPosition, 0, color, speed);
        this.transform.velocity = new Vector2(getRandomFloat(-speed, speed), getRandomFloat(-speed, speed));
        this._radius = radius;

        this.checkTemporalCondition = isTemporal ? () =>
        {
            this.alpha -= 0.001;
            if (this.alpha <= 0) this.destroy();
        } : () =>
        {
            //TODO: if we check for object inside of screen again, make method (utility)
            const { x, y } = this.transform.position;
            if (x < 0 || x > winWidth || y < 0 || y > winHeight) this.destroy();
        }
    }

    update()
    {
        this.transform.updateMovement();
        this.checkTemporalCondition();
    }

    draw(ctx)
    {
        ctx.save();

        const transform = this.transform;
        const { x, y } = transform.position;

        ctx.beginPath();

        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = transform.color;

        ctx.arc(x, y, this._radius, 0, 6.28);

        ctx.fill();

        ctx.restore();
    }
}

class LightningLine
{
    start = new Vector2();
    end = new Vector2();

    thickness = 5;
    opacity = 1;
    shadow = 0;
    fadeSpeed = 1;

    rgb = DEFAULT_RGB;

    constructor(startPos = new Vector2(), endPos = new Vector2(), rgb = DEFAULT_RGB, shadow = 0, thickness = 5, opacity = 1, fadeSpeed = 1)
    {
        this.start = startPos;
        this.end = endPos;
        this.thickness = thickness;
        this.opacity = opacity;
        this.shadow = shadow;
        this.fadeSpeed = fadeSpeed;
        this.rgb = rgb;
    }

    fadeALittle()
    {
        this.opacity -= 0.01 * this.fadeSpeed;

        const sizeReduction = 0.05 * this.fadeSpeed;
        this.thickness -= sizeReduction;

        if (this.thickness <= 2) this.end.y -= sizeReduction;
    }

    draw(ctx)
    {
        const { r, g, b } = this.rgb;
        ctx.beginPath();

        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.lineWidth = this.thickness;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
        ctx.shadowBlur = this.shadow;
        ctx.shadowColor = "#BD9DF2";
        ctx.stroke();

        ctx.closePath();
    }
}

class LightningTrail extends GameObject
{
    _rgb = DEFAULT_RGB;
    _size = 5;

    _thickness = 5;
    _opacity = 1;
    _shadow = 0;
    _fadeSpeed = 1;

    _trail = [];

    constructor({ rgb = DEFAULT_RGB, poolSize = 5, shadow = 0, thickness = 5, opacity = 1, fadeSpeed = 1 })
    {
        super();

        this._rgb = rgb;
        this._size = poolSize;
        this._shadow = shadow;
        this._thickness = thickness;
        this._opacity = opacity;
        this._fadeSpeed = fadeSpeed;
    }

    addTrail(start, end)
    {
        this._trail.push(new LightningLine(start, end, this._rgb, this._shadow, this._thickness, this._opacity, this._fadeSpeed));
    }

    update()
    {
        const length = this._trail.length;

        if (length > this._size) this._trail.splice(0, length - this._size);

        this._trail.fastLoop((piece, index) =>
        {
            piece.fadeALittle()
            if (piece.opacity <= 0) this._trail[index] = null;
        });

        if (this._trail.length) this._trail.clean();
    }

    draw(ctx)
    {
        ctx.save();

        this._trail.fastLoop(piece => piece.draw(ctx));

        ctx.restore();
    }
}

export
{
    LightningLine,
    LightningTrail,
    Particle
}