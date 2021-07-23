import { GameObject, pauseGame, resumeGame, Vector2 } from "./game-engine/game-engine.js";
import { AudioManager, BACKGROUND_MUSIC } from "./utils/audio-manager.js";
import { Enemy } from "./entities/enemy.js";
import { getRandomFloat } from "./utils/utilities.js";
import { mouseInput } from "./game-engine/input.js";

function setPauseButton(enemySpawner, startSpawningEnemies)
{
    const pauseButton = document.getElementById("pause-button");
    let isPaused = false;

    pauseButton.onclick = () =>
    {
        isPaused = !isPaused;

        if (isPaused)
        {
            pauseGame();
            AudioManager.pauseAudio();
            clearInterval(enemySpawner);
            pauseButton.innerText = "Unpause";
        }
        else
        {
            resumeGame();
            AudioManager.resumeAudio();
            enemySpawner.value = startSpawningEnemies();
            pauseButton.innerText = "Pause";
        }
    };
}

let enemyCounter = 0, killCounter = 0;
const enemyCount = document.getElementById("enemy-counter"), killCount = document.getElementById("kill-counter");

const updateKillCounter = () => killCount.innerText = `Enemies Killed: ${++killCounter}`;

function spawnEnemies(number, playerRef, speedLimit = 5, onKill = enemy => console.info("Enemy Killed! " + enemy), onSpawn = enemy => console.info("Spawn " + enemy))
{
    while (number--)
    {
        const newEnemy = new Enemy(getRandomFloat(3, speedLimit), playerRef);
        newEnemy._onKill.addListener(() =>
        {
            updateKillCounter();
            onKill(newEnemy);
        });

        enemyCount.innerText = `Enemy Count: ${++enemyCounter}`
        onSpawn(newEnemy);
    }
}

const hideStartScreen = () => document.getElementById("start-screen").style.visibility = "hidden";

let firstAttack = false;
const playBackgroundMusicOnFirstAttack = () =>
{
    if (!firstAttack)
    {
        AudioManager.playAudio(BACKGROUND_MUSIC);
        firstAttack = true;
    }
}

const PLAYER_COLOR = 'yellow', PLAYER_ACCELERATION = 90;

class Slingshot extends GameObject
{
    _startPosition;
    _stiffness;
    _length;

    _lastMousePos = mouseInput.mousePosition.asValue;
    _targetPos = new Vector2();

    _playerRef;
    _color;

    constructor(stiffness = 0, length = 250, playerRef)
    {
        super();
        this._startPosition = null;
        this._stiffness = stiffness;
        this._length = length;
        this._playerRef = playerRef;
    }

    awake()
    {
        document.addEventListener("pointerdown", () => this._startPosition = this._playerRef?.transform.position);
        document.addEventListener("pointerup", () =>
        {
            const multiplier = -2;
            const { x, y } = this._startPosition.asValue.substract(this._targetPos);

            this._playerRef.targetPos = this._playerRef.transform.position.asValue.add({ x: x * multiplier, y: y * multiplier });
            this._playerRef.transform.resetVelocity();

            this._playerRef.isMoving = true;

            this._startPosition = null
        });
    }

    update()
    {
        if (this._startPosition !== null)
        {
            const { x, y } = this._startPosition;
            const mouse = mouseInput.mousePosition;

            const diffX = Math.abs(mouse.x - x), diffY = Math.abs(mouse.y - y);

            //TODO: Obtain last post difference with math maybe?
            //If faster calculate the old position, by adding or subtracting the difference
            const targetX = diffX > this._length ? this._lastMousePos.x : mouse.x;
            const targetY = diffY > this._length ? this._lastMousePos.y : mouse.y;

            this._color = this.getSlingshotColor(diffX + diffY);

            //TODO: Angle this restriction to be rounded instead of squared
            //Probably use of atan2 to get the angle between the coordinates
            this._lastMousePos = { x: targetX, y: targetY };

            this._targetPos.setValues(targetX, targetY);

            this._playerRef.transform.rotateTowards(this._targetPos);
        }
    }

    draw(ctx)
    {
        if (this._startPosition !== null)
        {
            const { x, y } = this._startPosition;

            ctx.beginPath();

            ctx.strokeStyle = this._color;
            ctx.lineWidth = 10;
            ctx.lineCap = 'round';

            ctx.moveTo(x, y);

            ctx.lineTo(this._targetPos.x, this._targetPos.y);

            ctx.stroke();
        }
    }

    getSlingshotColor(difference)
    {
        const length = this._length * 2;

        const MAX_STRENGTH = length * .75;
        const MEDIUM_STRENGTH = length * .45;
        const LOW_STRENGTH = length * .25;

        if (difference >= MAX_STRENGTH) return 'red';
        if (difference >= MEDIUM_STRENGTH) return 'orange';
        return difference >= LOW_STRENGTH ? 'yellow' : 'green';
    }
}

export
{
    setPauseButton,
    spawnEnemies,
    hideStartScreen,
    playBackgroundMusicOnFirstAttack,

    PLAYER_COLOR,
    PLAYER_ACCELERATION,
    Slingshot
}