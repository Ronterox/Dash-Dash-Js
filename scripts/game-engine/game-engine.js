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

class GameObject
{
    _name;
    sceneIndex;

    constructor()
    {
        this._name = this.constructor['name'];
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
    position;
    _rotation;

    velocity = new Vector2();
    _friction = 1;
    _acceleration;

    _color;

    constructor(startPosition = new Vector2(), rotation = 0, color = DEFAULT_COLOR, acceleration = 1)
    {
        this.position = startPosition;
        this._rotation = rotation;
        this._color = color;
        this._acceleration = acceleration;
    }

    moveToPosition(position, acceleration = this._acceleration)
    {
        const myPosition = this.position;

        this._rotation = Math.atan2(position.y - myPosition.y, position.x - myPosition.x);

        const { x, y } = this.velocity;

        this.velocity.setValues((x + Math.cos(this._rotation) * acceleration) * this._friction, (y + Math.sin(this._rotation) * acceleration) * this._friction);
        this._friction = this._friction < 0 ? 0 : this._friction - 0.01;

        myPosition.add(this.velocity);
    }

    moveToPositionConstantSpeed(position, speed = this._acceleration)
    {
        const myPosition = this.position;

        this._rotation = Math.atan2(position.y - myPosition.y, position.x - myPosition.x);

        this.velocity.setValues(Math.cos(this._rotation) * speed, Math.sin(this._rotation) * speed);

        myPosition.add(this.velocity);
    }

    resetVelocity()
    {
        this._friction = 1;
        this.velocity.setValues(1, 1);
    }

    /**
     * Obtains the knockback target position to get away from other position
     * @param x target position x
     * @param y target position y
     * @param speed
     * @returns {Vector2} the knockback position
     */
    getKnockbackPositionFrom({ x, y }, speed = 1)
    {
        const [myX, myY] = this.position.asArray;
        const differenceX = myX - x, differenceY = myY - y;

        return new Vector2(myX + differenceX * speed, myY + differenceY * speed);
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

    rotateTowards({ x, y })
    {
        const myPosition = this.position;

        this._rotation = Math.atan2(y - myPosition.y, x - myPosition.x);
    }
}

class Hitbox
{
    static #_allHitBoxes = [];
    static #_idEr = 0;

    collisionId;
    tag;

    size;
    position;

    lastCollisions = [];
    collisions = [];
    isColliding = false;

    onCollisionEnter = new ClassEvent(this);
    onCollisionStay = new ClassEvent(this);

    constructor(size = { width: 50, height: 50 }, position = new Vector2(), tag = 'No tag')
    {
        this.tag = tag;

        this.collisionId = ++Hitbox.#_idEr;
        Hitbox.#_allHitBoxes.push(this);

        this.position = position;
        this.size = size;
    }

    static cleanAndUpdateHitboxes()
    {
        Hitbox.#_allHitBoxes.fastLoop(hitbox =>
        {
            hitbox.lastCollisions = hitbox.collisions;
            hitbox.collisions = [];
            hitbox.isColliding = false;
        });

        Hitbox.#_allHitBoxes.fastLoop(hitbox => hitbox.update());
    }

    addCollision(hitbox)
    {
        this.collisions.push(hitbox);
        if (this.lastCollisions.indexOf(hitbox) !== -1) this.onCollisionStay.notify(hitbox);
        else this.onCollisionEnter.notify(hitbox);
    }

    update()
    {
        const { x, y } = this.position;
        const { width, height } = this.size;

        Hitbox.#_allHitBoxes.fastLoop(hitbox =>
        {
            if (hitbox.collisionId !== this.collisionId)
            {
                const hitSize = hitbox.size;
                const hitPosition = hitbox.position;

                const hitX = hitPosition.x, hitY = hitPosition.y;

                if (hitbox.isColliding && hitbox.collisions.indexOf(this))
                {
                    this.addCollision(hitbox);
                }
                else if (x > hitSize.width + hitX || hitX > x + width
                    || y + height < hitY || hitY + height < y)
                {
                    //No collision
                }
                else this.addCollision(hitbox);
            }
        });

        this.isColliding = this.collisions.length > 0;
    }

    draw(ctx)
    {
        const { x, y } = this.position;
        const { width, height } = this.size;

        ctx.strokeStyle = this.isColliding ? "green" : "red";
        ctx.strokeRect(x - width * .5, y - height * .5, width, height);
    }

    destroy()
    {
        Hitbox.#_allHitBoxes.deleteIndexOf(this);
    }
}

class Size
{
    width;
    height

    constructor(width = 40, height = 40)
    {
        this.width = width;
        this.height = height;
    }
}

class Entity extends GameObject
{
    transform;
    _size;

    hitbox;
    isMoving = false;

    constructor(transform = new Transform(), size = new Size(), hitbox = new Hitbox(size, transform.position))
    {
        super();
        this.transform = transform;
        this._size = size;
        this.hitbox = hitbox;
    }

    draw(ctx)
    {
        const transform = this.transform;
        const { x, y } = transform.position;
        const { width, height } = this._size;

        ctx.fillStyle = transform._color;
        ctx.fillRect(x - width * .5, y - height * .5, width, height);

        // this.hitbox.draw(ctx);
    }

    destroy()
    {
        super.destroy();
        this.hitbox.destroy();
    }
}

class Vector2
{
    x;
    y;

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

    add({ x, y })
    {
        this.x += x;
        this.y += y;
        return this;
    }

    substract({ x, y })
    {
        this.x -= x;
        this.y -= y;
        return this;
    }

    setVector({ x, y })
    {
        this.x = x;
        this.y = y;
    }

    setValues(x, y)
    {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }

    static sqrMagnitude = (vector) => vector.x * vector.x + vector.y * vector.y;

    static distance = (leftVector, rightVector) => Math.hypot(leftVector.x - rightVector.x, leftVector.y - rightVector.y);
}

class SpriteSheet
{
    sprite;
    spriteSize;

    numberOfFrames;
    currentFrame = 0;

    _offset;

    constructor(name = "bagel.jpg", numberOfFrames = 1, offset = { offX: 0, offY: 0 })
    {
        this.sprite = new Image();
        this.sprite.src = SPRITES_PATH + name;

        this.spriteSize = { spriteWidth: this.sprite.naturalWidth / numberOfFrames, spriteHeight: this.sprite.naturalHeight }

        this.numberOfFrames = numberOfFrames;
        this._offset = offset;
    }

    draw(ctx, { x, y }, frame = 0, sizeMultiplier = 1)
    {
        const { spriteWidth, spriteHeight } = this.spriteSize;
        const size = { width: spriteWidth * sizeMultiplier, height: spriteHeight * sizeMultiplier }

        const frameOffset = frame * spriteWidth;
        const { offX, offY } = this._offset;

        ctx.drawImage(
            //Setting Frame
            this.sprite,
            frameOffset, 0,
            spriteWidth, spriteHeight,
            //Drawing on Canvas
            x - Math.floor(size.width * .5) + offX, y - Math.floor(size.height * .5) + offY,
            size.width, size.height);
    }

    //TODO: cooler state like sprite sheet
    //Change the current animation state of the sprite sheet
    //Save each frame position automatically for each state
    //Load normal and flipped sprite sheet version
    animate(ctx, { x, y }, sizeMultiplier = 1)
    {
        const { spriteWidth, spriteHeight } = this.spriteSize;
        const size = { width: spriteWidth * sizeMultiplier, height: spriteHeight * sizeMultiplier }

        const frameOffset = this.currentFrame * spriteWidth;
        const { offX, offY } = this._offset;

        ctx.drawImage(
            //Setting Frame
            this.sprite,
            frameOffset, 0,
            spriteWidth, spriteHeight,
            //Drawing on Canvas
            x - Math.floor(size.width * .5) + offX, y - Math.floor(size.height * .5) + offY,
            size.width, size.height);

        setFrameInterval(() => this.currentFrame = (this.currentFrame + 1) % this.numberOfFrames, 5);
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
let gameFrame = 0;

function cleanScreen(style)
{
    ctx.fillStyle = style;
    ctx.fillRect(0, 0, winWidth, winHeight);
}

function setFrameInterval(action, frame)
{
    if (gameFrame % frame === 0) action();
}

function animateFpsCount(backgroundStyle)
{
    cleanScreen(backgroundStyle);

    setFrameInterval(() => Hitbox.cleanAndUpdateHitboxes(), 2);
    SceneManager.updateGameObjectsWithRenderedCount();
    SceneManager.drawGameObjects();

    updateFps();

    animationFrame = requestAnimationFrame(animateFpsCount);
    gameFrame++;
}

function justAnimate(backgroundStyle)
{
    cleanScreen(backgroundStyle);

    setFrameInterval(() => Hitbox.cleanAndUpdateHitboxes(), 2);
    SceneManager.updateGameObjects();
    SceneManager.drawGameObjects();

    animationFrame = requestAnimationFrame(justAnimate);
    gameFrame++;
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
    ClassEvent,
    Hitbox,
    Size,

    startGame,
    pauseGame,
    resumeGame,
    setFrameInterval
}