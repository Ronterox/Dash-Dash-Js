import { Entity, Vector2 } from "../game-engine/game-engine.js";
import { mouseInput } from "../game-engine/input.js";
import { LightningTrail } from "../game-engine/particle-system.js";

const trailSettings =
    {
        rgb: { r: 255, g: 255, b: 255 },
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

    //TODO: create default values file like for color, number etc...
    constructor(speed, color)
    {
        super();
        this.speed = speed;
        this.color = color;
    }

    awake()
    {
        document.addEventListener("click", clickEvent =>
        {
            this.targetPos = new Vector2(clickEvent.clientX, clickEvent.clientY)
            this.isMoving = true;

            // const sfxLightning = new Audio("./media/audio/lightning-strike.mp3")
            // sfxLightning.play().then();
        });
        document.addEventListener("pointerdown", () => this.isPointerDown = true);
        document.addEventListener("pointerup", () => this.isPointerDown = false);

        document.addEventListener("mousemove", () =>
        {
            if (this.isPointerDown) this.isMoving = true;
        })
    }

    update()
    {
        if (!this.isMoving) return;

        if (this.isPointerDown) this.targetPos = mouseInput.mousePosition;

        if (Vector2.distance(this.targetPos, this.position) > this.speed * .5)
        {
            const oldPos = this.position.asValue;

            this.moveToPosition(this.targetPos);

            const newPos = this.position.asValue;

            const offset = 20;
            this.lightningTrailMiddle.addTrail(oldPos, newPos);
            this.lightningTrailTop.addTrail(new Vector2(oldPos.x + offset, oldPos.y + offset), new Vector2(newPos.x + offset, newPos.y + offset));
            this.lightningTrailBottom.addTrail(new Vector2(oldPos.x - offset, oldPos.y - offset), new Vector2(newPos.x + offset, newPos.y + offset));
        }
        else this.isMoving = false;
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