const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d', { alpha: false });

let winWidth = canvas.width = window.innerWidth.valueOf(),
    winHeight = canvas.height = window.innerHeight.valueOf();

window.addEventListener("resize", () =>
{
    winWidth = window.innerWidth.valueOf();
    winHeight = window.innerHeight.valueOf();

    canvas.style.width = winWidth;
    canvas.style.height = winHeight;

    ctx.msImageSmoothingEnabled = ctx.webkitImageSmoothingEnabled = ctx.imageSmoothingEnabled = false;
});

const AUDIOS_PATH = './media/audio/';
const SPRITES_PATH = './media/sprites/';

const DEFAULT_COLOR = 'white';
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