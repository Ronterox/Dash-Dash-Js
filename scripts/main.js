import { Player } from "./entities/player.js";
import { pauseGame, resumeGame, startGame } from "./game-engine/game-engine.js";
import { Enemy } from "./entities/enemy.js";

function setGameConfig(enemiesPerWave = 1, timeBtwWaves = 2)
{
    //Creation of player
    const player = new Player(90, 'red');

    //Enemy generation
    const enemyCount = document.getElementById("enemy-counter");
    let enemyCounter = 0;

    const killCount = document.getElementById("kill-counter");
    let killCounter = 0;

    const updateKillCounter = () => killCount.innerText = `Enemies Killed: ${++killCounter}`;

    function spawnEnemies(number = 1)
    {
        for (let i = 0; i < number; i++)
        {
            const newEnemy = new Enemy(Math.random() * 5, player);
            newEnemy.color = 'blue';
            newEnemy.updateKill = () => updateKillCounter();
            enemyCount.innerText = `Enemy Count: ${++enemyCounter}`
        }
    }

    const milisecondsBtwWaves = timeBtwWaves * 1000;
    const startSpawningEnemies = () => setInterval(() => spawnEnemies(enemiesPerWave), milisecondsBtwWaves);

    //Set Pause button
    let enemySpawner = startSpawningEnemies();

    const pauseButton = document.getElementById("pause-button");
    let isPaused = false;

    pauseButton.onclick = () =>
    {
        isPaused = !isPaused;

        if (isPaused)
        {
            pauseGame();
            clearInterval(enemySpawner);
            pauseButton.innerText = "Unpause";
        }
        else
        {
            resumeGame();
            enemySpawner = startSpawningEnemies();
            pauseButton.innerText = "Pause";
        }
    };
}

setGameConfig(3, 5);
startGame();