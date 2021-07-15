import { Entity, GameObject, Vector2 } from "./game-engine.js";
import { winHeight, winWidth } from "./config.js";

class Particle extends Entity
{
    alpha = .2;
    checkCondition;

    //TODO: Again. don't reinitialize values
    constructor(spawnPosition = new Vector2(0, 0), speed = 1, radius = 5, color = 'red', isTemporal = false)
    {
        super();
        this.position = spawnPosition;
        this.speed = speed;
        this.radius = radius;
        this.color = color;

        this.velocity = new Vector2((Math.random() - 0.5) * speed, (Math.random() - 0.5) * speed);
        this.checkCondition = isTemporal ? () =>
        {
            this.alpha -= 0.001;
            if (this.alpha <= 0) this.destroy();
        } : () =>
        {
            //TODO: if we check for object inside of screen again, make method (utility)
            if (this.position.x < 0 || this.position.x > winWidth || this.position.y < 0 || this.position.y > winHeight) this.destroy();
        }
    }

    update()
    {
        this.position.add(this.velocity);
        this.checkCondition();
    }

    draw(ctx)
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


class LightningLine
{
    start = new Vector2();
    end = new Vector2();

    thickness = 5;
    opacity = 1;
    shadow = 0;
    fadeSpeed = 1;

    rgb = { r: 255, g: 255, b: 255 };

    constructor(startPos = new Vector2(), endPos = new Vector2(), { r = 255, g = 255, b = 255 }, shadow = 0, thickness = 5, opacity = 1, fadeSpeed = 1)
    {
        this.start = startPos;
        this.end = endPos;
        this.thickness = thickness;
        this.opacity = opacity;
        this.shadow = shadow;
        this.fadeSpeed = fadeSpeed;
        this.rgb = { r, g, b };
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
    rgb = { r: 255, g: 255, b: 255 };
    size = 5;

    thickness = 5;
    opacity = 1;
    shadow = 0;
    fadeSpeed = 1;

    trail = [];

    constructor({ rgb = { r: 255, g: 255, b: 255 }, poolSize = 5, shadow = 0, thickness = 5, opacity = 1, fadeSpeed = 1 })
    {
        super();

        this.rgb = rgb;
        this.size = poolSize;
        this.shadow = shadow;
        this.thickness = thickness;
        this.opacity = opacity;
        this.fadeSpeed = fadeSpeed;
    }

    addTrail(start, end)
    {
        this.trail.createGameObject(new LightningLine(start, end, this.rgb, this.shadow, this.thickness, this.opacity, this.fadeSpeed));
    }

    update()
    {
        const length = this.trail.length;

        if (length > this.size) this.trail.removeFrom(0, length - this.size);

        this.trail.forEach((piece, index) =>
        {
            piece.fadeALittle()
            if (piece.opacity <= 0) this.trail[index] = null;
        });

        if (this.trail.length) this.trail.clean();
    }

    draw(ctx)
    {
        ctx.save();

        this.trail.forEach(piece => piece.draw(ctx));

        ctx.restore();
    }
}

export
{
    LightningLine,
    LightningTrail,
    Particle
}