import { Vector2 } from "./game-engine.js";

export const mouseInput =
    {
        mousePosition: new Vector2()
    }

document.addEventListener("mousemove", moveEvent => mouseInput.mousePosition.setValues(moveEvent.clientX, moveEvent.clientY));