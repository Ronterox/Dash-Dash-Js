const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let winWidth = canvas.width = window.innerWidth,
    winHeight = canvas.height = window.innerHeight;

window.addEventListener("resize", () =>
{
    winWidth = canvas.width = window.innerWidth;
    winHeight = canvas.height = window.innerHeight;
});

export
{
    winHeight,
    winWidth,
    ctx
}