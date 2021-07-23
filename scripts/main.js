import { Player } from "./entities/player.js";
import { startGame, Vector2 } from "./game-engine/game-engine.js";
import { hideStartScreen, PLAYER_COLOR, PLAYER_ACCELERATION, setPauseButton, spawnEnemies, Slingshot, SLINGSHOT_LENGTH } from "./game-config.js";
import { ctx, winHeight, winWidth } from "./game-engine/config.js";
import { Block } from "./environment/block.js";
import { getRandomInteger } from "./utils/utilities.js";

function generateBackgroundProps(maxBoxes)
{
    const numberOfBoxes = Math.random() * maxBoxes + 1;
    for (let i = 0; i < numberOfBoxes; i++)
    {
        new Block({ width: getRandomInteger(50, 250), height: getRandomInteger(50, 250) },
            new Vector2(Math.random() * winWidth, Math.random() * winHeight),
            Math.random() * 30);
    }
}

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

    generateBackgroundProps(10);
}

document.getElementById("start-game-button").onclick = () =>
{
    ctx.canvas.requestFullscreen().then(r => console.log(r));
    hideStartScreen();
    setGameConfig(3, 5);
    startGame("rgba(50,50,50,0.45)");
}