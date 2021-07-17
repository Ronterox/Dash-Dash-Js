import { Entity, Vector2 } from "../game-engine/game-engine.js";
import { mouseInput } from "../game-engine/input.js";
import { LightningTrail } from "../game-engine/particle-system.js";
import { DEFAULT_COLOR, DEFAULT_RGB } from "../game-engine/config.js";

const trailSettings =
    {
        rgb: DEFAULT_RGB,
        poolSize: 8,
        shadow: 30,
        thickness: 10,
        opacity: 1,
        fadeSpeed: 4
    }

export class Player extends Entity
{
    isPointerDown = false;
    targetPos = new Vector2();
    angle = 0;

    lightningTrailTop = new LightningTrail(trailSettings);
    lightningTrailMiddle = new LightningTrail(trailSettings);
    lightningTrailBottom = new LightningTrail(trailSettings);

    constructor(speed = 50, color = DEFAULT_COLOR)
    {
        super();
        this.speed = speed;
        this.color = color;
    }

    awake()
    {
        this.targetPos = mouseInput.mousePosition;

        const game = document;

        game.addEventListener("click", () => this.isMoving = true);

        game.addEventListener("pointerdown", () => this.isPointerDown = true);
        game.addEventListener("pointerup", () => this.isPointerDown = false);

        game.addEventListener("mousemove", () =>
        {
            if (this.isPointerDown) this.isMoving = true;
        })
    }

    update()
    {
        if (!this.isMoving) return;

        if (Vector2.distance(this.targetPos, this.position) > this.speed * .5)
        {
            if (this.isPointerDown) this.moveToPosition(this.targetPos);
            else this.moveWithTrail();
        }
        else this.isMoving = false;
    }

    moveWithTrail()
    {
        const oldPos = this.position.asValue;

        this.moveToPosition(this.targetPos);

        const newPos = this.position.asValue;

        const offset = 20;
        this.lightningTrailMiddle.addTrail(oldPos, newPos);
        this.lightningTrailTop.addTrail(new Vector2(oldPos.x + offset, oldPos.y + offset), new Vector2(newPos.x + offset, newPos.y + offset));
        this.lightningTrailBottom.addTrail(new Vector2(oldPos.x - offset, oldPos.y - offset), new Vector2(newPos.x + offset, newPos.y + offset));
    }

    draw(ctx)
    {
        ctx.save();

        ctx.shadowBlur = 15;
        ctx.shadowColor = "white";

        const
            x = this.position.x,
            y = this.position.y,
            r = this.radius;

        //Rotate character to movement direction
        this.rotate(ctx, this.angle, { x, y });

        // Draw a circle as the body
        super.draw(ctx);

        const drawSword = (edgeColor = 'red', handleColor = 'red') =>
        {
            // Draw a rectangle as the "handle"
            ctx.beginPath();
            ctx.fillStyle = handleColor;

            const handlePosition = x + this.radius + 15;
            const handleWidth = 25;

            ctx.rect(handlePosition, y - 5, handleWidth, 10);
            ctx.fill();

            // Draw other rectangle as the "edge"
            ctx.beginPath();
            ctx.fillStyle = edgeColor;

            ctx.rect(handlePosition + handleWidth, y - 5, 70, 10);
            ctx.fill();
        }

        drawSword('gray', 'black');

        // Specify how the hands should look
        const ARMS_LENGTH = 20, ARMS_WIDTH = 4;

        ctx.beginPath()
        ctx.strokeStyle = this.color;
        ctx.lineCap = "round";
        ctx.lineWidth = ARMS_WIDTH;

        //Hands constants
        const elbowConnection = x + 5;
        const armsLength = x + r + ARMS_LENGTH;
        const shoulderYOffset = 2;
        const handsYOffset = 5;

        // Right Hand
        ctx.moveTo(elbowConnection, y + r - shoulderYOffset)
        ctx.lineTo(armsLength, y + handsYOffset)
        ctx.stroke()

        // Left Hand
        ctx.moveTo(elbowConnection, y - r + shoulderYOffset)
        ctx.lineTo(armsLength, y - handsYOffset)
        ctx.stroke()

        ctx.restore();
    }
}