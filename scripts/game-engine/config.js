const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d', { alpha: false });

let winWidth = canvas.width = window.innerWidth,
    winHeight = canvas.height = window.innerHeight;

window.addEventListener("resize", () =>
{
    winWidth = canvas.width = window.innerWidth;
    winHeight = canvas.height = window.innerHeight;
});

const SPRITES_PATH = './media/sprites/';
const AUDIOS_PATH = './media/audio/';

const DEFAULT_COLOR = 'red';
const DEFAULT_RGB = { r: 255, g: 255, b: 255 }

export
{
    winHeight,
    winWidth,

    SPRITES_PATH,
    AUDIOS_PATH,

    DEFAULT_COLOR,
    DEFAULT_RGB,

    ctx
}