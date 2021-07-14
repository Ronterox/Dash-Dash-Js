import { Player } from "./entities/player.js";
import { pauseGame, resumeGame, startGame } from "./game-engine/game-engine.js";
import { Enemy } from "./entities/enemy.js";
import { AudioManager } from "./utils/audio-manager.js";

function createButton(text = "Button", onClick = () => console.log("Pressed Button!"))
{
    const btn = document.createElement("button");
    btn.innerHTML = text;
    btn.onclick = onClick;
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

    const pauseButton = document.getElementById("pause-button");
    let isPaused = false;

    pauseButton.onclick = () =>
    {
        isPaused = !isPaused;

        if (isPaused)
        {
            pauseGame();
            AudioManager.pauseAudio();
            pauseButton.innerText = "Unpause";
        }
        else
        {
            resumeGame();
            AudioManager.resumeAudio();
            pauseButton.innerText = "Pause";
        }
    };

    //Developer Options
    const enemies = [];

    const updateKillCounter = enemy =>
    {
        killCount.innerText = `Enemies Killed: ${++killCounter}`;
        const index = enemies.indexOf(enemy);
        enemies.splice(index, 1);
    }

    createButton("Spawn Enemy", () =>
    {
        const newEnemy = new Enemy(Math.random() * 5, player);
        newEnemy.updateKill = () => updateKillCounter();
        enemies.push(newEnemy);

        enemyCount.innerText = `Enemy Count: ${++enemyCounter}`;
    })

    createButton("Clear Enemies", () => enemies.forEach(enemy => enemy.destroy()))
}

setTestConfig();
startGame("rgba(50,50,50,0.45)");