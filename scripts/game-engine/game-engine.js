import { ctx, winHeight, winWidth } from "./config.js";

const sceneObjects = [];

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

Array.prototype.createGameObject = function (obj) { obj.sceneIndex = this.push(obj) - 1;}

Array.prototype.removeGameObject = function (index) { this.swagOrderDelete(index); }

let gameStarted = false;

class GameObject
{
    name;
    sceneIndex;

    constructor()
    {
        this.name = this.constructor.name;
        sceneObjects.createGameObject(this);

        if (gameStarted) setTimeout(() => this.awake(), 100);
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
        sceneObjects.removeGameObject(this.sceneIndex);
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
    position = new Vector2();
    radius = 30;
    color = 'red';

    velocity = new Vector2();
    speed = 1
    isMoving = false;
    angle = 0;

    //TODO: don't double initialize parameters, with entity parent
    constructor(startPosition = new Vector2(), radius = 30, color = 'red', velocity = new Vector2(1, 1), speed = 1)
    {
        super();
        this.position = startPosition;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.speed = speed;
    }

    draw(ctx)
    {
        ctx.beginPath();

        ctx.arc(this.position.x, this.position.y, this.radius, 0, 7);
        ctx.fillStyle = this.color;

        ctx.fill();
    }

    moveToPosition(position, speed = this.speed)
    {
        const entityPosition = this.position;

        this.angle = Math.atan2(position.y - entityPosition.y, position.x - entityPosition.x);

        this.velocity.setValues(Math.cos(this.angle) * speed, Math.sin(this.angle) * speed);
        entityPosition.add(this.velocity);
    }
}

class Vector2
{
    x = winWidth * .5;
    y = winHeight * .5;

    constructor(x = winWidth * .5, y = winHeight * .5)
    {
        this.x = x;
        this.y = y;
    }

    get asValue()
    {
        return new Vector2(this.x, this.y);
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
        this.x = x;
        this.y = y;
    }

    static sqrMagnitude = (vector) => vector.x * vector.x + vector.y * vector.y;

    //TODO: Obtain distance without using sqr root
    static distance = (leftVector, rightVector) => Math.hypot(leftVector.x - rightVector.x, leftVector.y - rightVector.y);
}

const filterStrength = 20;
let frameTime = 0, lastLoop = new Date, thisLoop;

function updateFps()
{
    const thisFrameTime = (thisLoop = new Date) - lastLoop;
    frameTime += (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
}

const updateGameObjects = () => sceneObjects.forEach(gameObject => gameObject.update());
const drawGameObjects = () => sceneObjects.forEach(gameObject => gameObject.draw(ctx));

const initializeAllObjects = () => sceneObjects.forEach(gameObject => gameObject.awake());

const startFpsCounting = () =>
{
    const fpsOut = document.getElementById("fps-counter");
    setInterval(() => fpsOut.innerHTML = (1000 / frameTime).toFixed(2) + " fps", 500);
};

let animationFrame, animationLoop;

function animateFpsCount(backgroundStyle)
{
    ctx.fillStyle = backgroundStyle;
    ctx.fillRect(0, 0, winWidth, winHeight);

    updateGameObjects();
    drawGameObjects();

    updateFps();

    animationFrame = requestAnimationFrame(animateFpsCount);
}

function justAnimate(backgroundStyle)
{
    ctx.fillStyle = backgroundStyle;
    ctx.fillRect(0, 0, winWidth, winHeight);

    updateGameObjects();
    drawGameObjects();

    animationFrame = requestAnimationFrame(justAnimate);
}

function startGame(style = "rgba(255,255,255, 1)", countFps = false)
{
    initializeAllObjects();
    startFpsCounting();

    gameStarted = true;

    animationLoop = countFps ? () => animateFpsCount(style) : () => justAnimate(style);

    animationLoop();
}

const pauseGame = () => cancelAnimationFrame(animationFrame);

const resumeGame = () => animationLoop();

export
{
    sceneObjects,
    GameObject,
    Entity,
    Vector2,

    startGame,
    pauseGame,
    resumeGame
}