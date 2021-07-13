import { Entity, Vector2 } from "../game-engine/game-engine.js";
import { mouseInput } from "../game-engine/input.js";

export class Player extends Entity
{
    isPointerDown = false;
    targetPos = new Vector2();

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

        if (Vector2.distance(this.targetPos, this.position) > this.speed * .5) this.moveToPosition(this.targetPos);
        else this.isMoving = false;
    }
}