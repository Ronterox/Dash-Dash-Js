import { AUDIOS_PATH } from "../game-engine/config.js";

class AudioManager
{
    static audios = {};
    static audiosPlaying = [];

    static playNewAudio(path)
    {
        const audio = new Audio(path);
        this.playAudioClass(audio);
    }

    static loadAudio(path, name = "")
    {
        this.audios[name] = new Audio(path);
        console.log(`Audio ${name} was loaded!`);
    }

    static playAudio(name = "")
    {
        const audio = this.audios[name];
        if (!audio) console.error(`Audio with the name of ${name} is not loaded yet!`);
        else this.playAudioClass(audio);
    }

    static playAudioClass(audio)
    {
        if (!audio.paused) audio.currentTime = 0;
        else
        {
            const index = this.audiosPlaying.push(audio) - 1;
            audio.addEventListener('ended', () => this.audiosPlaying.swapOrderDelete(index));
        }
        audio.play();
    }

    static pauseAudio()
    {
        this.audiosPlaying.forEach(audio => audio.pause());
    }

    static resumeAudio()
    {
        this.audiosPlaying.forEach(audio => audio.play());
    }
}

const BACKGROUND_MUSIC = "background";
const SLASH_SFX = "slash";

//Loading sounds
AudioManager.loadAudio(AUDIOS_PATH + "zenitsu-theme.mp3", BACKGROUND_MUSIC);
AudioManager.loadAudio(AUDIOS_PATH + "slash.mp3", SLASH_SFX);

export
{
    BACKGROUND_MUSIC,
    SLASH_SFX,

    AudioManager
};