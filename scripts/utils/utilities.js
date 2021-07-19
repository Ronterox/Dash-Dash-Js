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

class ClassEvent
{
    _sender;
    _listeners = [];

    constructor(sender)
    {
        this._sender = sender;
    }

    addListener(listener)
    {
        this._listeners.push(listener);
    }

    removeListener(listener)
    {
        const index = this._listeners.indexOf(listener);
        if (index !== -1) this._listeners.swapDelete(index);
        else console.log(`Couldn't find listener reference of method ${listener} so it couldn't be removed!`)
    }

    notify(args)
    {
        for (let i = 0; i < this._listeners.length; i++) this._listeners[i](this._sender, args);
    }
}

export
{
    getRandomColor,
    getRandomFloat,
    getRandomInteger,

    ClassEvent
}