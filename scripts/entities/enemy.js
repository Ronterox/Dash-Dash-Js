import { ClassEvent, Entity, Size, SpriteSheet, Transform, Vector2 } from "../game-engine/game-engine.js";
import { winHeight, winWidth } from "../game-engine/config.js";
import { Particle } from "../game-engine/particle-system.js";
import { getRandomColor, getRandomInteger } from "../utils/utilities.js";
import { AudioManager, ENEMY_DEATH_SFX, ENEMY_HIT_SFX, ENEMY_SFX, ENEMY_SPAWN_SFX, SLASH_SFX } from "../utils/audio-manager.js";
import { playBackgroundMusicOnFirstAttack } from "../game-config.js";

const enemySizes = [10, 20, 30, 40];

export class Enemy extends Entity
{
    _playerRef;
    _onKill = new ClassEvent(this);

    isBeingKnockBack = false;
    _knockBackForce = 10;
    _knockBackPosition;

    _spriteSheet;
    _currentAnimation;
    _multiplier;

    constructor(acceleration, player)
    {
        const startPos = new Vector2(Math.random() * winWidth, Math.random() * winHeight);
        const randomColor = getRandomColor(100, 50);
        const randomSize = enemySizes.getRandomValue();

        const sizeMultiplier = Math.floor(randomSize * .33);

        super(new Transform(startPos, 0, randomColor, acceleration), new Size(randomSize, randomSize));

        this._playerRef = player;
        this._spriteSheet = new SpriteSheet("imp-anim.png", 7, { offX: 30, offY: 0 });
        this._multiplier = sizeMultiplier;
    }

    awake()
    {
        this.isMoving = true;
        AudioManager.playNewAudio(ENEMY_SPAWN_SFX);
        const growlSfx = AudioManager.playNewAudio(ENEMY_SFX, true);
        this._onKill.addListener(() => AudioManager.endAudio(growlSfx));

        this.hitbox.onCollisionEnter.addListener((caller, hitbox) =>
        {
            const player = this._playerRef;

            if (hitbox.collisionId === player.hitbox.collisionId && player.isMoving && !player.isPointerDown)
            {
                this.knockbackAwayFrom(hitbox.position);
                this.shrinkMyself(10);
            }
        });
    }

    update()
    {
        this._multiplier = Math.floor(this._size.width * .33);
        const { spriteHeight } = this._spriteSheet.spriteSize;
        this.hitbox.size = { width: spriteHeight * this._multiplier, height: spriteHeight * this._multiplier };

        if (!this.isMoving) return;

        const player = this._playerRef;
        const playerPosition = player.transform.position;

        const transform = this.transform;

        if (this.isBeingKnockBack)
        {
            transform.moveToPosition(this._knockBackPosition, this._knockBackForce);
            console.log(Vector2.sqrMagnitude(this._knockBackPosition.asValue.substract(transform.position)), this._size.width)
            this.isBeingKnockBack = Vector2.sqrMagnitude(this._knockBackPosition.asValue.substract(transform.position)) > this._size.width;
        }
        else transform.moveToPosition(playerPosition);
    }

    //TODO: if necessary more speed, fix this use of save for shadows
    //Check enemies on a different array and draw them there together
    //TODO: flip sprite to look at player
    //Save a flip image of the same sprite sheet and change the image when drawing (since faster than flipping canvas)
    draw(ctx)
    {
        ctx.save();

        const transform = this.transform;

        ctx.shadowBlur = 12;
        ctx.shadowColor = transform._color;

        const { x, y } = transform.position;

        this._spriteSheet.animate(ctx, { x: x, y: y }, this._multiplier);

        // this.hitbox.draw(ctx);

        ctx.restore();
    }

    knockbackAwayFrom({ x, y })
    {
        this.isBeingKnockBack = true;
        this._knockBackPosition = this.transform.getKnockbackPositionFrom({ x, y }, this._knockBackForce);
    }

    shrinkMyself(size)
    {
        const { width, height } = this.reduceSize(size);

        if (width < 1 || height < 1) this.kill();
        else
        {
            this.generateParticles();
            AudioManager.playAudio(SLASH_SFX);
            AudioManager.playNewAudio(ENEMY_HIT_SFX);
        }

        playBackgroundMusicOnFirstAttack();
    }

    resetAnimation()
    {
        if (this._currentAnimation) this._currentAnimation.kill();
    }

    reduceSize(sizeReduce)
    {
        this.resetAnimation();

        const { width, height } = this._size;

        const newSize = { width: width - sizeReduce, height: height - sizeReduce };
        this._currentAnimation = gsap.to(this._size, { width: newSize.width, height: newSize.height });

        return newSize;
    }

    generateParticles(areTemporal = true)
    {
        const numberOfParticlesPerSize = Math.floor(this._size.width * 0.33);
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