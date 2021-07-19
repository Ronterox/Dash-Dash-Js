import { Player } from "./entities/player.js";
import { startGame } from "./game-engine/game-engine.js";
import { hideStartScreen, PLAYER_COLOR, PLAYER_SPEED, setPauseButton, spawnEnemies } from "./game-config.js";

function createButton(text = "Button", onClick = () => console.log("Pressed Button!"))
{
    const btn = document.createElement("button");
    btn.innerHTML = text;
    btn.onclick = onClick;
    document.getElementById("developer-console").appendChild(btn);
}

function setTestConfig(enemiesPerWave = 1, timeBtwWaves = 2)
{
    function spawnEnemy(quantity)
    {
        spawnEnemies(quantity, player, 10, enemy =>
        {
            const index = enemies.indexOf(enemy);
            enemies.swapDelete(index);

        }, enemy => enemies.push(enemy))
    }

    //Enemy Generation
    const millisecondsBtwWaves = timeBtwWaves * 1000;
    const startSpawningEnemies = () => setInterval(() => spawnEnemy(enemiesPerWave), millisecondsBtwWaves);

    //Setting pause button
    let enemySpawner = { value: 0 };

    setPauseButton(enemySpawner, startSpawningEnemies)

    const crashButton = document.getElementById("crasher-button");
    crashButton.onclick = () => spawnEnemies(1000000000000);

    //Developer Options
    const enemies = [];

    const developerConsole = document.getElementById("developer-console");
    developerConsole.style.visibility = "visible";

    createButton("Spawn Enemy", () => spawnEnemy(1));
    createButton("Clear Enemies", () => enemies.fastLoop(enemy => enemy.destroy()));
    createButton("Start Spawning", () => enemySpawner = startSpawningEnemies());

    //Creation of player
    const player = new Player(PLAYER_SPEED, PLAYER_COLOR);
}

hideStartScreen();
setTestConfig();
startGame("rgba(50,50,50,0.45)", true);