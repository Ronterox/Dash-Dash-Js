import { Entity, Vector2 } from "../game-engine/game-engine.js";
import { winHeight, winWidth } from "../game-engine/config.js";
import { Particle } from "../game-engine/particle-system.js";
import { getRandomColor, getRandomRange } from "../utils/utilities.js";

//TODO: this is not wrong, but we need to improve it
const enemySizes = [10, 20, 30, 40];

//TODO: Make audio manager
const audio = new Audio("./media/audio/slash.wav");

//TODO: change this as fast as you can
let firstKill = false;
const playBackgroundMusicOnFirstKill = () =>
{
    if (!firstKill)
    {
        const backgroundMusic = new Audio("./media/audio/zenitsu-theme.mp3");
        backgroundMusic.currentTime = 0;
        backgroundMusic.volume = 0;
        backgroundMusic.play().then(() => backgroundMusic.volume = 1);
        firstKill = true;
    }
}

export class Enemy extends Entity
{
    playerRef;
    isMoving = false;
    //Turn this into a global event caller with manager
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
        else if (player.isMoving && !player.isPointerDown) this.takeDamage(10);
    }

    takeDamage(damage)
    {
        this.reduceSize(damage);
        if (this.radius < 1) this.kill();
        else this.generateParticles();

        audio.currentTime = 0;
        audio.play().then();
    }

    reduceSize(sizeReduce)
    {
        this.radius -= sizeReduce;
    }

    generateParticles(areTemporal = true)
    {
        for (let i = 0; i < Math.floor(this.radius * 0.33); i++)
        {
            new Particle(this.position.asValue, Math.random() * 3 + 1, getRandomRange(3, 8), getRandomColor(), areTemporal);
        }
    }

    kill()
    {
        playBackgroundMusicOnFirstKill();
        this.generateParticles(false);
        this.updateKill();
        this.destroy();
    }
}