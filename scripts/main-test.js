import { Player } from "./entities/player.js";
import { startGame } from "./game-engine/game-engine.js";
import { hideStartScreen, setPauseButton, spawnEnemies } from "./game-config.js";

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
        spawnEnemies(quantity, player, 5, enemy =>
        {
            const index = enemies.indexOf(enemy);
            enemies.splice(index, 1);

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
    createButton("Clear Enemies", () => enemies.forEach(enemy => enemy.destroy()));
    createButton("Start Spawning", () => enemySpawner = startSpawningEnemies());

    //Override this for testing since is an interpreted language
    const renderCounter = document.getElementById("render-counter");
    let renderedObjects = 0;

    function updateRenderCounter(increment)
    {
        renderCounter.innerText = `Rendered Objects: ${renderedObjects += increment}`;
    }

    Array.prototype.createGameObject = function (obj)
    {
        obj.sceneIndex = this.push(obj) - 1;
        updateRenderCounter(1);
    }

    Array.prototype.removeGameObject = function (index)
    {
        this.swagOrderDelete(index);
        updateRenderCounter(-1);
    }

    Array.prototype.clean = function ()
    {
        const oldLength = this.length;
        this.shiftFilter(exist => exist);
        updateRenderCounter(-(oldLength - this.length));
    }

    Array.prototype.removeFrom = function (index, count)
    {
        const oldLength = this.length;
        this.splice(index, count);
        updateRenderCounter(-(oldLength - this.length));
    }

    //Creation of player
    const player = new Player(90, 'yellow');
}

hideStartScreen();
setTestConfig();
startGame("rgba(50,50,50,0.45)");