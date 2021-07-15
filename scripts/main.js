import { Player } from "./entities/player.js";
import { startGame } from "./game-engine/game-engine.js";
import { setPauseButton, spawnEnemies } from "./game-config.js";

//TODO: make main-test and main equally evolve
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

setGameConfig(3, 5);
startGame("rgba(50,50,50,0.45)");