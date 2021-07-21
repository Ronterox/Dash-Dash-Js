import { Player } from "./entities/player.js";
import { GameObject, startGame, Vector2 } from "./game-engine/game-engine.js";
import { hideStartScreen, PLAYER_COLOR, PLAYER_SPEED, setPauseButton, spawnEnemies } from "./game-config.js";
import { mouseInput } from "./game-engine/input.js";

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

    class Slingshot extends GameObject
    {
        _startPosition;
        _stiffness;
        _length;

        _lastMousePos = mouseInput.mousePosition.asValue;
        _targetPos = new Vector2();

        _playerRef;

        constructor(stiffness = 0, length = 250, playerRef)
        {
            super();
            this._startPosition = null;
            this._stiffness = stiffness;
            this._length = length;
            //TODO: Make this so calling the player movement can be more understandable
            //If the calculus can still be on the player, but has to be more readable
            //If you are gonna change the is moving, maybe add the whole method to the player
            this._playerRef = playerRef;
        }

        awake()
        {
            document.addEventListener("pointerdown", () =>
            {
                if (this._playerRef) this._startPosition = this._playerRef.transform.position;
            });

            document.addEventListener("pointerup", () =>
            {
                //TODO: Calculate speed by distance
                //Depending of the pulling distance more speed
                const multiplier = 1.4;
                const { x, y } = this._startPosition.asValue.substract(this._targetPos);

                this._playerRef.targetPos = this._playerRef.transform.position.asValue.add({ x: Math.floor(x * multiplier), y: Math.floor(y * multiplier) });
                this._playerRef.isMoving = true;

                this._startPosition = null
            });
        }

        update()
        {
            if (this._startPosition !== null)
            {
                const { x, y } = this._startPosition;
                const mouse = mouseInput.mousePosition;

                const diffX = Math.abs(mouse.x - x), diffY = Math.abs(mouse.y - y);

                //TODO: Obtain last post difference with math maybe?
                //If faster calculate the old position, by adding or subtracting the difference
                const targetX = diffX > this._length ? this._lastMousePos.x : mouse.x;
                const targetY = diffY > this._length ? this._lastMousePos.y : mouse.y;

                //TODO: Angle this restriction to be rounded instead of squared
                //Probably use of atan2 to get the angle between the coordinates
                this._lastMousePos = { x: targetX, y: targetY };

                this._targetPos.setValues(targetX, targetY);
            }
        }

        draw(ctx)
        {
            if (this._startPosition !== null)
            {
                const { x, y } = this._startPosition;

                ctx.beginPath();

                ctx.strokeStyle = 'white';

                ctx.moveTo(x, y);

                ctx.lineTo(this._targetPos.x, this._targetPos.y);

                ctx.stroke();
            }
        }
    }

    new Slingshot(0, 250, player);
}

hideStartScreen();
setTestConfig();
startGame("rgba(50,50,50,0.45)", true);