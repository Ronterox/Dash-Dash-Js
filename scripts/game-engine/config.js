const canvas = document.getElementById('game-canvas');
export const ctx = canvas.getContext('2d');

export let winWidth = canvas.width = window.innerWidth,
    winHeight = canvas.height = window.innerHeight;

window.addEventListener("resize", () =>
{
    winWidth = canvas.width = window.innerWidth;
    winHeight = canvas.height = window.innerHeight;
});

//TODO: fix size for mobile devices of text