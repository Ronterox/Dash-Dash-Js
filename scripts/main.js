import { Player } from "./entities/player.js";
import { pauseGame, resumeGame, startGame } from "./game-engine/game-engine.js";
import { Enemy } from "./entities/enemy.js";

function setGameConfig()
{
    const player = new Player(90);
    const enemyCounter = document.getElementById("enemy-counter");
    let enemyCount = 0;

    //Enemy generation
    function spawnEnemies()
    {
        return setInterval(() =>
        {
            const newEnemy = new Enemy(Math.random() * 5, player);
            newEnemy.color = 'blue';

            enemyCounter.innerText = `Enemy Count: ${++enemyCount}`
        }, 2000);
    }

    let enemySpawner = spawnEnemies();

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
            spawnEnemies();
            pauseButton.innerText = "Pause";
        }

    };
}

setGameConfig();
startGame();