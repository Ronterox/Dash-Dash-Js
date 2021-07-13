import { Entity, Vector2 } from "../game-engine/game-engine.js";
import { mouseInput } from "../game-engine/input.js";

export class Player extends Entity
{
    isPointerDown = false;
    targetPos = new Vector2();
    moveObject = false;
    speed = 1;

    constructor(speed)
    {
        super();
        this.speed = speed;
    }

    awake()
    {
        document.addEventListener("click", clickEvent =>
        {
            this.targetPos = new Vector2(clickEvent.clientX, clickEvent.clientY)
            this.moveObject = true;
        });
        document.addEventListener("pointerdown", () => this.isPointerDown = true);
        document.addEventListener("pointerup", () => this.isPointerDown = false);

        document.addEventListener("mousemove", () =>
        {
            if (this.isPointerDown) this.moveObject = true;
        })
    }

    update()
    {
        if (!this.moveObject) return;

        if (this.isPointerDown) this.targetPos = mouseInput.mousePosition;

        if (Vector2.distance(this.targetPos, this.position) > this.speed * .5) this.moveToPosition(this.targetPos);
        else this.moveObject = false;
    }
}