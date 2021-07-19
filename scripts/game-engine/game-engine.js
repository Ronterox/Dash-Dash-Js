import { ctx, DEFAULT_COLOR, SPRITES_PATH, winHeight, winWidth } from "./config.js";

//Set it to pixel art
ctx.msImageSmoothingEnabled = ctx.webkitImageSmoothingEnabled = ctx.imageSmoothingEnabled = false;

Array.prototype.swagOrderDelete = function (index)
{
    const stop = this.length - 1;
    while (index < stop)
    {
        this[index] = this[++index];
        this[index].sceneIndex = index - 1;
    }
    this.pop();
}

Array.prototype.fastLoop = function (action)
{
    let length = this.length;
    while (length--) action(this[length], length);
}

class SceneManager
{
    static _sceneObjects = [];
    static _sceneStarted = false;

    static addGameObject(obj)
    {
        obj.sceneIndex = this._sceneObjects.push(obj) - 1;
        if (this._sceneStarted) setTimeout(() => obj.awake(), 100);
    }

    static removeGameObject = (index) => this._sceneObjects.swagOrderDelete(index);

    static updateGameObjects = () => this._sceneObjects.fastLoop(gameObject => gameObject.update());

    static drawGameObjects = () => this._sceneObjects.fastLoop(gameObject => gameObject.draw(ctx));

    static updateGameObjectsWithRenderedCount()
    {
        this.updateGameObjects();

        const renderCounter = document.getElementById("render-counter");
        renderCounter.innerText = `Rendered Objects: ${this._sceneObjects.length}`;
    }

    static startScene()
    {
        this._sceneStarted = true;
        this._sceneObjects.fastLoop(gameObject => gameObject.awake())
    }
}

class GameObject
{
    _name;
    sceneIndex;

    constructor()
    {
        this._name = this.constructor['_name'];
        SceneManager.addGameObject(this);
    }

    //Called at the start of the app
    awake()
    {
    }

    update()
    {
    }

    //Empty method
    draw(ctx)
    {

    }

    destroy()
    {
        SceneManager.removeGameObject(this.sceneIndex);
    }
}

class Transform
{
    position = new Vector2();
    velocity = new Vector2();
    rotation = 0;

    color = DEFAULT_COLOR;
    speed = 1;

    constructor(startPosition = new Vector2(), rotation = 0, color = DEFAULT_COLOR, speed = 1,)
    {
        this.position = startPosition;
        this.rotation = rotation;
        this.color = color;
        this.speed = speed;
    }

    moveToPosition(position, speed = this.speed)
    {
        const myPosition = this.position;

        this.rotation = Math.atan2(position.y - myPosition.y, position.x - myPosition.x);

        this.velocity.setValues(Math.cos(this.rotation) * speed, Math.sin(this.rotation) * speed);
        myPosition.add(this.velocity);
    }

    updateMovement()
    {
        this.position.add(this.velocity);
    }

    rotate(ctx, angle, { x, y } = new Vector2())
    {
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.translate(-x, -y);
    }
}

class Entity extends GameObject
{
    transform = new Transform();

    _size = { width: 50, height: 50 };

    isMoving = false;

    constructor(transform = new Transform(), size = { width: 50, height: 50 })
    {
        super();
        this.transform = transform;
        this._size = size;
    }

    draw(ctx)
    {
        const transform = this.transform;
        const { x, y } = transform.position;
        const { width, height } = this._size;

        ctx.fillStyle = transform.color;
        ctx.fillRect(x, y, width, height);
    }
}

class Vector2
{
    x = winWidth * .5;
    y = winHeight * .5;

    constructor(x = winWidth * .5, y = winHeight * .5)
    {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }

    get asValue()
    {
        return new Vector2(this.x, this.y);
    }

    get asArray()
    {
        return [this.x, this.y];
    }

    add(otherVector)
    {
        this.x += otherVector.x;
        this.y += otherVector.y;
        return this;
    }

    substract(otherVector)
    {
        this.x -= otherVector.x;
        this.y -= otherVector.y;
        return this;
    }

    setVector(otherVector)
    {
        this.x = otherVector.x;
        this.y = otherVector.y;
    }

    setValues(x, y)
    {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }

    static sqrMagnitude = (vector) => vector.x * vector.x + vector.y * vector.y;

    //TODO: Obtain distance without using sqr root
    static distance = (leftVector, rightVector) => Math.hypot(leftVector.x - rightVector.x, leftVector.y - rightVector.y);
}

class SpriteSheet
{
    sprite = new Image();
    spriteWidth = 32;
    spriteHeight = 32;

    numberOfFrames = 1;
    currentFrame = 0;

    constructor(name = "bagel.jpg", numberOfFrames = 1)
    {
        this.sprite.src = SPRITES_PATH + name;

        this.spriteHeight = this.sprite.naturalHeight;
        this.spriteWidth = this.sprite.naturalWidth / numberOfFrames;

        this.numberOfFrames = numberOfFrames;
    }

    draw(ctx, { x, y }, frame = 0, sizeMultiplier = 1)
    {
        const size = { width: this.spriteWidth * sizeMultiplier, height: this.spriteHeight * sizeMultiplier }
        const frameOffset = frame * this.spriteWidth;

        ctx.drawImage(
            //Setting Frame
            this.sprite,
            frameOffset, 0,
            this.spriteWidth, this.spriteHeight,
            //Drawing on Canvas
            x, y,
            size.width, size.height);
    }

    animate(ctx, position = new Vector2(), sizeMultiplier = 1)
    {
        const size = { width: this.spriteWidth * sizeMultiplier, height: this.spriteHeight * sizeMultiplier }
        const frameOffset = this.currentFrame * this.spriteWidth;

        ctx.drawImage(
            //Setting Frame
            this.sprite,
            frameOffset, 0,
            this.spriteWidth, this.spriteHeight,
            //Drawing on Canvas
            position.x, position.y,
            size.width, size.height);

        this.currentFrame = (this.currentFrame + 1) % this.numberOfFrames;
    }
}

const filterStrength = 20;
let frameTime = 0, lastLoop = new Date, thisLoop;

function updateFps()
{
    const thisFrameTime = (thisLoop = new Date) - lastLoop;
    frameTime += (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
}

const startFpsCounting = () =>
{
    const fpsOut = document.getElementById("fps-counter");
    setInterval(() => fpsOut.innerHTML = (1000 / frameTime).toFixed(2) + " fps", 500);
};

let animationFrame, animationLoop;

function cleanScreen(style)
{
    ctx.fillStyle = style;
    ctx.fillRect(0, 0, winWidth, winHeight);
}

function animateFpsCount(backgroundStyle)
{
    cleanScreen(backgroundStyle);

    SceneManager.updateGameObjectsWithRenderedCount();
    SceneManager.drawGameObjects();

    updateFps();

    animationFrame = requestAnimationFrame(animateFpsCount);
}

function justAnimate(backgroundStyle)
{
    cleanScreen(backgroundStyle);

    SceneManager.updateGameObjects();
    SceneManager.drawGameObjects();

    animationFrame = requestAnimationFrame(justAnimate);
}

function startGame(style = "rgba(255,255,255, 1)", countFps = false)
{
    SceneManager.startScene();

    startFpsCounting();

    animationLoop = countFps ? () => animateFpsCount(style) : () => justAnimate(style);

    animationLoop();
}

const pauseGame = () => cancelAnimationFrame(animationFrame);

const resumeGame = () => animationLoop();

export
{
    SceneManager,
    GameObject,
    Entity,
    Vector2,
    SpriteSheet,
    Transform,

    startGame,
    pauseGame,
    resumeGame
}