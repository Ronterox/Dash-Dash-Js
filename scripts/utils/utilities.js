import { winHeight, winWidth } from "../game-engine/config.js";

const getRandomColor = (saturation = 50, lightness = 50) => `hsl(${Math.random() * 360}, ${saturation}%, ${lightness}%)`;
const getRandomFloat = (min, max) => Math.random() * (max - min + 1) + min;
const getRandomInteger = (min, max) => Math.floor(getRandomFloat(min, max));

//Faster without creation of another array
Array.prototype.shiftFilter = function (predicate)
{
    let i, j;

    for (i = 0, j = 0; i < this.length; ++i)
    {
        if (predicate(this[i]))
        {
            this[j] = this[i];
            ++j;
        }
    }

    while (j < this.length) this.pop();
}

//Swap and disappear
Array.prototype.swapDelete = function (index) { this[index] = this.pop(); }

Array.prototype.swapOrderDelete = function (index)
{
    const stop = this.length - 1;
    while (index < stop)
    {
        this[index] = this[++index];
    }
    this.pop();
}

Array.prototype.clean = function () { this.shiftFilter(exist => exist); }

Array.prototype.getRandomValue = function () { return this[Math.floor(Math.random() * this.length)]; }

Array.prototype.deleteIndexOf = function (obj)
{
    const index = this.indexOf(obj);
    if (index !== -1) this.swapDelete(index);
}

const Bounds = { TOP: 'Top', BOTTOM: 'Bottom', RIGHT: 'Right', LEFT: 'Left' }

function doOutOfBounds({ x, y }, action)
{
    let exitBoundary;

    if (x < 0) exitBoundary = Bounds.LEFT;
    else if (x > winWidth) exitBoundary = Bounds.RIGHT;
    else if (y < 0) exitBoundary = Bounds.TOP;
    else if (y > winHeight) exitBoundary = Bounds.BOTTOM;

    if (exitBoundary) action(exitBoundary);
}

const lerp = (value = 0, targetValue = 1, speed = 0.1) => value + (targetValue - value) * speed;

export
{
    getRandomColor,
    getRandomFloat,
    getRandomInteger,
    doOutOfBounds,
    lerp,

    Bounds
}