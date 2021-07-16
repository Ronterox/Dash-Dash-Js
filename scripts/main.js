import { Player } from "./entities/player.js";
import { startGame } from "./game-engine/game-engine.js";
import { hideStartScreen, setPauseButton, spawnEnemies } from "./game-config.js";

function setGameConfig(enemiesPerWave = 1, timeBtwWaves = 2)
{
    //Creation of player
    const player = new Player(90, 'yellow');

    //Enemy Generation
    const millisecondsBtwWaves = timeBtwWaves * 1000;
    const startSpawningEnemies = () => setInterval(() => spawnEnemies(enemiesPerWave, player), millisecondsBtwWaves);

    //Setting Pause button
    let enemySpawner = { value: startSpawningEnemies() };

    setPauseButton(enemySpawner, startSpawningEnemies);
}

document.getElementById("start-game-button").onclick = () =>
{
    hideStartScreen();
    setGameConfig(3, 5);
    startGame("rgba(50,50,50,0.45)");
}