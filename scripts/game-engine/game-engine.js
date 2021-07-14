import { ctx, winHeight, winWidth } from "./config.js";

export const sceneObjects = [];
//TODO: instead of being update by class GameObject, watch for changes on array is cooler
const renderCounter = document.getElementById("render-counter");

const updateRenderCounter = length => renderCounter.innerText = `Rendered Objects: ${length}`

let gameStarted = false;

export class GameObject
{
    constructor()
    {
        updateRenderCounter(sceneObjects.push(this));
        //TODO: instead of unreliable milliseconds create sceneObjects manager, whenever you push check for awake
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
        const gameObjectIndex = sceneObjects.indexOf(this);

        if (gameObjectIndex === -1) return;

        sceneObjects.splice(gameObjectIndex, 1);
        updateRenderCounter(sceneObjects.length);
    }
}

export class Entity extends GameObject
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

export class Vector2
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

let animationFrame;
//TODO: unnecessary variable
let backgroundStyle = "rgba(255,255,255, 1)";

function animate()
{
    //TODO: understand why the fillstyle leaves marks on the screen
    ctx.fillStyle = backgroundStyle;
    ctx.fillRect(0, 0, winWidth, winHeight);

    //TODO: if necessary is faster to update and draw on same loop
    updateGameObjects();
    drawGameObjects();

    updateFps();

    animationFrame = requestAnimationFrame(animate);
}

export function startGame(style = "rgba(255,255,255, 1)")
{
    initializeAllObjects();
    startFpsCounting();

    backgroundStyle = style;
    gameStarted = true;

    animate();
}

export const pauseGame = () => cancelAnimationFrame(animationFrame);

export const resumeGame = () => animate();