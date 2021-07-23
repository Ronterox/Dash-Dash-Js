import { Player } from "./entities/player.js";
import { startGame } from "./game-engine/game-engine.js";
import { hideStartScreen, PLAYER_COLOR, PLAYER_ACCELERATION, setPauseButton, spawnEnemies, Slingshot, SLINGSHOT_LENGTH } from "./game-config.js";

function setGameConfig(enemiesPerWave = 1, timeBtwWaves = 2)
{
    //Creation of player
    const player = new Player(PLAYER_ACCELERATION, PLAYER_COLOR);

    //Enemy Generation
    const millisecondsBtwWaves = timeBtwWaves * 1000;
    const startSpawningEnemies = () => setInterval(() => spawnEnemies(enemiesPerWave, player), millisecondsBtwWaves);

    //Setting Pause button
    let enemySpawner = { value: startSpawningEnemies() };

    setPauseButton(enemySpawner, startSpawningEnemies);

    new Slingshot(0, SLINGSHOT_LENGTH, player);
}

document.getElementById("start-game-button").onclick = () =>
{
    hideStartScreen();
    setGameConfig(3, 5);
    startGame("rgba(50,50,50,0.45)");
}