import { pauseGame, resumeGame } from "./game-engine/game-engine.js";
import { AudioManager } from "./utils/audio-manager.js";
import { Enemy } from "./entities/enemy.js";

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
    for (let i = 0; i < number; i++)
    {
        const newEnemy = new Enemy(Math.random() * speedLimit, playerRef);
        newEnemy.onKill = () =>
        {
            updateKillCounter();
            onKill(newEnemy);
        }
        enemyCount.innerText = `Enemy Count: ${++enemyCounter}`
        onSpawn(newEnemy);
    }
}

const hideStartScreen = () => document.getElementById("start-screen").style.visibility = "hidden";

export
{
    setPauseButton,
    spawnEnemies,
    hideStartScreen
}