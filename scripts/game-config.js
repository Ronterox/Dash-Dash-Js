import { pauseGame, resumeGame } from "./game-engine/game-engine.js";
import { AudioManager, BACKGROUND_MUSIC } from "./utils/audio-manager.js";
import { Enemy } from "./entities/enemy.js";
import { getRandomFloat } from "./utils/utilities.js";

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

const PLAYER_COLOR = 'yellow', PLAYER_SPEED = 90;

export
{
    setPauseButton,
    spawnEnemies,
    hideStartScreen,
    playBackgroundMusicOnFirstAttack,

    PLAYER_COLOR,
    PLAYER_SPEED
}