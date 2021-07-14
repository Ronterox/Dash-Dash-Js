import { Player } from "./entities/player.js";
import { pauseGame, resumeGame, startGame } from "./game-engine/game-engine.js";
import { Enemy } from "./entities/enemy.js";
import { AudioManager } from "./utils/audio-manager.js";

//TODO: make main-test and main equally evolve
function setGameConfig(enemiesPerWave = 1, timeBtwWaves = 2)
{
    //Creation of player
    const player = new Player(90, 'yellow');

    //Enemy generation
    let enemyCounter = 0;
    let killCounter = 0;

    function spawnEnemies(number = 1)
    {
        const enemyCount = document.getElementById("enemy-counter");
        const killCount = document.getElementById("kill-counter");

        const updateKillCounter = () => killCount.innerText = `Enemies Killed: ${++killCounter}`;

        for (let i = 0; i < number; i++)
        {
            const newEnemy = new Enemy(Math.random() * 5, player);
            newEnemy.updateKill = () => updateKillCounter();
            enemyCount.innerText = `Enemy Count: ${++enemyCounter}`
        }
    }

    const millisecondsBtwWaves = timeBtwWaves * 1000;
    const startSpawningEnemies = () => setInterval(() => spawnEnemies(enemiesPerWave), millisecondsBtwWaves);

    //Setting Pause button
    let enemySpawner = startSpawningEnemies();

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
            enemySpawner = startSpawningEnemies();
            pauseButton.innerText = "Pause";
        }
    };
}

setGameConfig(3, 5);
startGame("rgba(50,50,50,0.45)");