import { Player } from "./entities/player.js";
import { GameObject, startGame, Vector2 } from "./game-engine/game-engine.js";
import { hideStartScreen, PLAYER_COLOR, PLAYER_SPEED, setPauseButton, spawnEnemies } from "./game-config.js";
import { DEFAULT_COLOR } from "./game-engine/config.js";

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
        spawnEnemies(quantity, player, 10, enemy => enemies.deleteIndexOf(enemy), enemy => enemies.push(enemy))
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

    class Hitbox extends GameObject
    {
        size = { width: 50, height: 50 };
        _offset = { offX: 0, offY: 0 };
        position = new Vector2();
        _color = DEFAULT_COLOR;

        constructor(size = { width: 50, height: 50 }, position = new Vector2(), color = DEFAULT_COLOR, offset = { offX: 0, offY: 0 })
        {
            super()
            this.size = size;
            this._offset = offset;
            this._color = color;
            this.position = position;
        }

        update()
        {

        }

        draw(ctx)
        {
            const { x, y } = this.position;
            const { offX, offY } = this._offset;
            const { width, height } = this.size;

            ctx.strokeStyle = this._color;
            ctx.strokeRect(x + offX, y + offY, width, height);
        }
    }

    new Hitbox({ width: 100, height: 100 }, player.transform.position, "green", { offX: -25, offY: -25});
}

hideStartScreen();
setTestConfig();
startGame("rgba(50,50,50,0.45)", true);