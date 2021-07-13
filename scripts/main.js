import { Player } from "./entities/player.js";
import { pauseGame, resumeGame, startGame} from "./game-engine/game-engine.js";
import { Enemy } from "./entities/enemy.js";

function createButton(text = "Button", onClick = () => console.log("Pressed Button!"), className = "")
{
    const btn = document.createElement("button");
    btn.innerHTML = text;
    btn.onclick = onClick;
    btn.className = className;
    document.getElementById("developer-console").appendChild(btn);
}

function setTestConfig()
{
    //Creation of player
    const player = new Player(90, 'yellow');

    //Enemy generation
    const enemyCount = document.getElementById("enemy-counter");
    let enemyCounter = 0;

    const killCount = document.getElementById("kill-counter");
    let killCounter = 0;

    const updateKillCounter = () => killCount.innerText = `Enemies Killed: ${++killCounter}`;

    const pauseButton = document.getElementById("pause-button");
    let isPaused = false;

    pauseButton.onclick = () =>
    {
        isPaused = !isPaused;

        if (isPaused)
        {
            pauseGame();
            pauseButton.innerText = "Unpause";
        }
        else
        {
            resumeGame();
            pauseButton.innerText = "Pause";
        }
    };

    //Developer Options
    const enemies = [];

    createButton("Spawn Enemy", () =>
    {
        const newEnemy = new Enemy(Math.random() * 5, player);
        newEnemy.updateKill = () => updateKillCounter();
        enemies.push(newEnemy);

        enemyCount.innerText = `Enemy Count: ${++enemyCounter}`;
    })

    createButton("Clear Enemies", () => enemies.forEach(enemy => enemy.destroy()))
}

function setGameConfig(enemiesPerWave = 1, timeBtwWaves = 2)
{
    //Creation of player
    const player = new Player(90, 'yellow');

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
            newEnemy.updateKill = () => updateKillCounter();
            enemyCount.innerText = `Enemy Count: ${++enemyCounter}`
        }
    }

    const millisecondsBtwWaves = timeBtwWaves * 1000;
    const startSpawningEnemies = () => setInterval(() => spawnEnemies(enemiesPerWave), millisecondsBtwWaves);

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

// setTestConfig();
setGameConfig(3, 5);
startGame("rgba(50,50,50,0.45)");