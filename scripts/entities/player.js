import { Entity, Transform, Vector2 } from "../game-engine/game-engine.js";
import { LightningTrail } from "../game-engine/particle-system.js";
import { DEFAULT_COLOR, DEFAULT_RGB } from "../game-engine/config.js";
import { AudioManager, PLAYER_IDLE_SFX, PLAYER_MOVE_SFX } from "../utils/audio-manager.js";
import { Bounds, doOutOfBounds, getRandomInteger } from "../utils/utilities.js";

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
    targetPos;

    lightningTrailTop = new LightningTrail(trailSettings);
    lightningTrailMiddle = new LightningTrail(trailSettings);
    lightningTrailBottom = new LightningTrail(trailSettings);

    constructor(acceleration = 50, color = DEFAULT_COLOR)
    {
        super(new Transform(new Vector2(), 0, color, acceleration));

        const orangeRgb = { r: 255, g: 180, b: 0 };
        this.lightningTrailTop._rgb = orangeRgb;
        this.lightningTrailBottom._rgb = orangeRgb;

        const { width, height } = this._size;
        this.hitbox.size = { width: width * 2, height: height * 2 };
    }

    awake()
    {
        AudioManager.playNewAudio(PLAYER_IDLE_SFX);
    }

    update()
    {
        if (!this.isMoving) return;

        const transform = this.transform;
        const width = this._size.width;

        if (Vector2.sqrMagnitude(this.targetPos.asValue.substract(transform.position)) > width * width) this.moveWithTrail();
        else this.isMoving = false;
    }

    moveWithTrail()
    {
        const transform = this.transform;

        const oldPos = transform.position.asValue;

        transform.moveToPosition(this.targetPos);

        const newPos = transform.position.asValue;

        const trailsOffset = 20;

        const [oldX, oldY] = oldPos.asArray;
        const [newX, newY] = newPos.asArray;

        doOutOfBounds(newPos, boundary =>
        {
            const { x, y } = transform.velocity;
            const speed = Math.abs(x - y);

            transform.position.setVector(oldPos);

            this.targetPos = transform.getKnockbackPositionFrom(newPos, speed);

            const multiplier = 50;
            if (boundary === Bounds.TOP || boundary === Bounds.BOTTOM) this.targetPos.x += getRandomInteger(speed * -multiplier, speed * multiplier);
            else this.targetPos.y += getRandomInteger(speed * -multiplier, speed * multiplier);

            AudioManager.playNewAudio(PLAYER_MOVE_SFX);
        });

        this.lightningTrailTop.addTrail(new Vector2(oldX - trailsOffset, oldY - trailsOffset), new Vector2(newX - trailsOffset, newY - trailsOffset));
        this.lightningTrailMiddle.addTrail(oldPos, newPos);
        this.lightningTrailBottom.addTrail(new Vector2(oldX + trailsOffset, oldY + trailsOffset), new Vector2(newX + trailsOffset, newY + trailsOffset));
    }

    draw(ctx)
    {
        ctx.save();

        ctx.shadowBlur = 15;
        ctx.shadowColor = "white";

        const transform = this.transform;
        const { x, y } = transform.position;
        const { width, height } = this._size;

        // Draw a body
        super.draw(ctx);

        //Rotate character to movement direction
        transform.rotate(ctx, transform._rotation, { x, y });

        const drawSword = (edgeColor = DEFAULT_COLOR, handleColor = DEFAULT_COLOR) =>
        {
            const handlePosition = x + width + 15;
            const handleWidth = 25;

            // Draw a rectangle as the "handle"
            ctx.fillStyle = handleColor;
            ctx.fillRect(handlePosition, y - 5, handleWidth, 10);

            // Draw other rectangle as the "edge"
            ctx.fillStyle = edgeColor;
            ctx.fillRect(handlePosition + handleWidth, y - 5, 70, 10);
        }

        drawSword('gray', 'black');

        // Specify how the hands should look
        const ARMS_LENGTH = 20, ARMS_WIDTH = 8;

        ctx.beginPath()
        ctx.strokeStyle = transform._color;
        ctx.lineCap = "round";
        ctx.lineWidth = ARMS_WIDTH;

        //Hands constants
        const elbowConnection = x + 30;
        const armsLength = x + width + ARMS_LENGTH;
        const shoulderYOffset = 20;
        const handsYOffset = 5;

        // Right Hand
        ctx.moveTo(elbowConnection, y + height - shoulderYOffset)
        ctx.lineTo(armsLength, y + handsYOffset)
        ctx.stroke()

        // Left Hand
        ctx.moveTo(elbowConnection, y - height + shoulderYOffset)
        ctx.lineTo(armsLength, y - handsYOffset)
        ctx.stroke()

        ctx.restore();
    }
}