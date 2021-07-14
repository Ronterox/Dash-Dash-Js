import { Entity, Vector2 } from "../game-engine/game-engine.js";
import { mouseInput } from "../game-engine/input.js";

export class Player extends Entity
{
    isPointerDown = false;
    targetPos = new Vector2();
    angle = 0;

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

        //TODO: fix this angle

        if (Vector2.distance(this.targetPos, this.position) > this.speed * .5) this.moveToPosition(this.targetPos);
        else this.isMoving = false;
    }

    draw(ctx)
    {
        ctx.save();

        const x = this.position.x;
        const y = this.position.y;
        const r = this.radius;

        //Rotate character to angle
        ctx.translate(x, y);
        ctx.rotate(this.angle);
        ctx.translate(-x, -y);

        // Draw a circle as the body
        ctx.beginPath()
        ctx.fillStyle = this.color;
        ctx.arc(x, y, r, 0, 6.28)
        ctx.fill()

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
        const ARMS_LENGTH = 20;
        const ARMS_WIDTH = 4;

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