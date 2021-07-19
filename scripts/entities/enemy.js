import { Entity, SpriteSheet, Transform, Vector2 } from "../game-engine/game-engine.js";
import { winHeight, winWidth } from "../game-engine/config.js";
import { Particle } from "../game-engine/particle-system.js";
import { ClassEvent, getRandomColor, getRandomInteger } from "../utils/utilities.js";
import { AudioManager, ENEMY_DEATH_SFX, ENEMY_SFX, ENEMY_SPAWN_SFX, SLASH_SFX } from "../utils/audio-manager.js";
import { playBackgroundMusicOnFirstAttack } from "../game-config.js";

const enemySizes = [10, 20, 30, 40];

export class Enemy extends Entity
{
    _playerRef;
    _onKill = new ClassEvent(this);

    isBeingKnockBack = false;
    _knockBackForce = 10;
    _knockBackPosition = new Vector2();

    _spriteSheet = new SpriteSheet();
    _currentAnimation;

    constructor(speed, player)
    {
        const startPos = new Vector2(Math.random() * winWidth, Math.random() * winHeight);
        const randomColor = getRandomColor(100, 50);
        const randomRadius = enemySizes.getRandomValue();

        super(new Transform(startPos, 0, randomColor, speed), randomRadius);

        this._playerRef = player;
        this._spriteSheet = new SpriteSheet("imp-anim.png", 7);
    }

    awake()
    {
        this.isMoving = true;
        AudioManager.playNewAudio(ENEMY_SPAWN_SFX);
        const growlSfx = AudioManager.playNewAudio(ENEMY_SFX, true);
        this._onKill.addListener(() => AudioManager.endAudio(growlSfx));
    }

    update()
    {
        if (!this.isMoving) return;

        const player = this._playerRef;
        const playerPosition = player.transform.position;

        const transform = this.transform;
        const characterNextMovementArea = transform.speed * .5 + this.radius;

        if (this.isBeingKnockBack)
        {
            transform.moveToPosition(this._knockBackPosition, this._knockBackForce);
            this.isBeingKnockBack = Vector2.distance(this._knockBackPosition, transform.position) > characterNextMovementArea;
        }
        else
        {
            const hasCollisionWithPlayer = Vector2.distance(playerPosition, transform.position) < characterNextMovementArea + player.radius;

            if (!hasCollisionWithPlayer) transform.moveToPosition(playerPosition);
            //TODO: better detection of pointer down for damage
            else if (player.isMoving && !player.isPointerDown)
            {
                this.moveAwayFrom(playerPosition);
                this.shrinkEnemy(10);
            }
        }
    }

    //TODO: if necessary more speed, fix this use of save for shadows
    draw(ctx)
    {
        ctx.save();

        const transform = this.transform;

        ctx.shadowBlur = 12;
        ctx.shadowColor = transform.color;

        const { x, y } = transform.position;

        this._spriteSheet.draw(ctx, { x: x - 100, y: y - 100 }, 0, Math.floor(this.radius * 0.30));

        super.draw(ctx);

        ctx.restore();
    }

    moveAwayFrom({ x, y })
    {
        this.isBeingKnockBack = true;

        const [myX, myY] = this.transform.position.asArray;
        const differenceX = x - myX, differenceY = y - myY;

        this._knockBackPosition = new Vector2(myX + differenceX * this._knockBackForce, myY + differenceY * this._knockBackForce);
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
        if (this._currentAnimation) this._currentAnimation.kill();
    }

    reduceSize(sizeReduce)
    {
        this.resetAnimation();

        let newSize = this.radius - sizeReduce;
        this._currentAnimation = gsap.to(this, { radius: newSize });

        return newSize;
    }

    generateParticles(areTemporal = true)
    {
        const numberOfParticlesPerSize = Math.floor(this.radius * 0.33);
        let numberOfParticles = numberOfParticlesPerSize < 3 ? 3 : numberOfParticlesPerSize;

        const transform = this.transform;
        while (numberOfParticles--) new Particle(transform.position.asValue, Math.random() * 3 + 1, getRandomInteger(3, 8), transform.color, areTemporal);
    }

    kill()
    {
        this.resetAnimation();
        this.generateParticles(false);
        AudioManager.playNewAudio(ENEMY_DEATH_SFX);
        this._onKill.notify();
        this.destroy();
    }
}