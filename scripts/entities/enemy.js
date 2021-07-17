import { Entity, Vector2 } from "../game-engine/game-engine.js";
import { winHeight, winWidth } from "../game-engine/config.js";
import { Particle } from "../game-engine/particle-system.js";
import { getRandomColor, getRandomInteger } from "../utils/utilities.js";
import { AudioManager, BACKGROUND_MUSIC, SLASH_SFX } from "../utils/audio-manager.js";

const enemySizes = [10, 20, 30, 40];

let firstAttack = false;
const playBackgroundMusicOnFirstAttack = () =>
{
    if (!firstAttack)
    {
        AudioManager.playAudio(BACKGROUND_MUSIC);
        firstAttack = true;
    }
}

export class Enemy extends Entity
{
    playerRef;
    isMoving = false;
    //TODO: Turn this into a global event caller with manager
    onKill;

    isBeingKnockBack = false;
    knockBackForce = 10;
    knockBackPosition = new Vector2();

    currentAnimation;

    constructor(speed, player)
    {
        super();
        this.speed = speed;
        this.playerRef = player;
        this.position = new Vector2(Math.random() * winWidth, Math.random() * winHeight);

        this.onKill = () => console.log("Enemy killed");
        this.color = getRandomColor(100, 50);
        //TODO: if we use again random object from array, create method (utility)
        this.radius = enemySizes[Math.floor(Math.random() * enemySizes.length)];
    }

    awake()
    {
        this.isMoving = true;
    }

    update()
    {
        if (!this.isMoving) return;

        const player = this.playerRef;
        const characterNextMovementArea = this.speed * .5 + this.radius;

        if (this.isBeingKnockBack)
        {
            this.moveToPosition(this.knockBackPosition, this.knockBackForce);
            this.isBeingKnockBack = Vector2.distance(this.knockBackPosition, this.position) > characterNextMovementArea;
        }
        else
        {
            const hasCollisionWithPlayer = Vector2.distance(player.position, this.position) < characterNextMovementArea + player.radius;

            if (!hasCollisionWithPlayer) this.moveToPosition(player.position);
            //TODO: better detection of pointer down for damage
            else if (player.isMoving && !player.isPointerDown)
            {
                this.knockBackAwayFrom(player)
                this.shrinkEnemy(10);
            }
        }
    }

    //TODO: if necessary more speed, fix this use of save for shadows
    draw(ctx)
    {
        ctx.save();

        ctx.shadowBlur = 30;
        ctx.shadowColor = this.color;

        super.draw(ctx);

        ctx.restore();
    }

    knockBackAwayFrom(character)
    {
        this.isBeingKnockBack = true;

        const charX = character.position.x, charY = character.position.y;
        const x = this.position.x, y = this.position.y;

        const differenceX = charX - x, differenceY = charY - y;

        this.knockBackPosition = new Vector2(x + differenceX * this.knockBackForce, y + differenceY * this.knockBackForce);
    }

    shrinkEnemy(size)
    {
        const newSize = this.reduceSize(size);

        if (newSize < 1) this.kill();
        else this.generateParticles();

        AudioManager.playAudio(SLASH_SFX);
        playBackgroundMusicOnFirstAttack();
    }

    resetAnimation()
    {
        if (this.currentAnimation) this.currentAnimation.kill();
    }

    reduceSize(sizeReduce)
    {
        this.resetAnimation();

        let newSize = this.radius - sizeReduce;
        this.currentAnimation = gsap.to(this, { radius: newSize });

        return newSize;
    }

    generateParticles(areTemporal = true)
    {
        const numberOfParticlesPerSize = Math.floor(this.radius * 0.33);
        const numberOfParticles = numberOfParticlesPerSize < 3 ? 3 : numberOfParticlesPerSize;

        for (let i = 0; i < numberOfParticles; i++) new Particle(this.position.asValue, Math.random() * 3 + 1, getRandomInteger(3, 8), this.color, areTemporal);
    }

    kill()
    {
        this.resetAnimation();
        this.generateParticles(false);
        this.onKill();
        this.destroy();
    }
}