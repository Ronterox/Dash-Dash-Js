import { Entity, Vector2 } from "../game-engine/game-engine.js";
import { winHeight, winWidth } from "../game-engine/config.js";
import { Particle } from "../game-engine/particle-system.js";
import { getRandomColor, getRandomRange } from "../utils/utilities.js";
import { AudioManager, BACKGROUND_MUSIC, SLASH_SFX } from "../utils/audio-manager.js";

//TODO: this is not wrong, but we need to improve it
const enemySizes = [10, 20, 30, 40];

//TODO: change this as fast as you can
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
    updateKill;

    constructor(speed, player)
    {
        super();
        this.speed = speed;
        this.playerRef = player;
        this.position = new Vector2(Math.random() * winWidth, Math.random() * winHeight);

        this.updateKill = () => console.error("Enemy update kill method undefined");
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
        const hasCollisionWithPlayer = Vector2.distance(player.position, this.position) < this.speed * .5 + player.radius + this.radius;

        if (!hasCollisionWithPlayer) this.moveToPosition(player.position);
        //TODO: better detection of pointer down for damage
        else if (player.isMoving && !player.isPointerDown) this.shrinkEnemy(10);
    }

    shrinkEnemy(size)
    {
        const newSize = this.reduceSize(size);

        if (newSize < 1) this.kill();
        else this.generateParticles();

        AudioManager.playAudio(SLASH_SFX);

        playBackgroundMusicOnFirstAttack();
    }

    reduceSize(sizeReduce)
    {
        let newSize = this.radius - sizeReduce;
        gsap.to(this, { radius: newSize });
        return newSize;
    }

    generateParticles(areTemporal = true)
    {
        const numberOfParticlesPerSize = Math.floor(this.radius * 0.33);
        const numberOfParticles = numberOfParticlesPerSize < 3 ? 3 : numberOfParticlesPerSize;

        for (let i = 0; i < numberOfParticles; i++) new Particle(this.position.asValue, Math.random() * 3 + 1, getRandomRange(3, 8), getRandomColor(), areTemporal);
    }

    kill()
    {
        this.generateParticles(false);
        this.updateKill();
        this.destroy();
    }
}