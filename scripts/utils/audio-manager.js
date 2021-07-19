import { AUDIOS_PATH } from "../game-engine/config.js";

const MISSING_AUDIO = AUDIOS_PATH + "clown.mp3";

class AudioManager
{
    static audios = {};
    static audiosPlaying = [];

    //TODO: Audio looping functional
    static playNewAudio(path, loop = false)
    {
        const audio = new Audio(path)

        audio.onerror = () => this.playAudio(MISSING_AUDIO);
        audio.onloadeddata = () =>
        {
            this.#playAudioClass(audio, loop);
            return audio;
        }
    }

    static loadAudio(path, name = "")
    {
        const audio = this.audios[name] = new Audio(path);
        audio.onerror = () =>
        {
            audio.src = MISSING_AUDIO;
            console.log(`Couldn't load audio of name ${name}`)
        }
        audio.onloadeddata = () => console.log(`Audio ${name} was loaded!`);
    }

    static playAudio(name = "")
    {
        const audio = this.audios[name];

        if (audio) this.#playAudioClass(audio);
        else this.playAudio(MISSING_AUDIO);
    }

    static #playAudioClass(audio, loop = false)
    {
        if (!audio.paused) audio.currentTime = 0;
        else
        {
            this.audiosPlaying.push(audio);
            audio.addEventListener('ended', () =>
            {
                if (loop) this.#playAudioClass(audio);
                else this.endAudio(audio)
            });
        }
        audio.play();
    }

    static endAudio(audio)
    {
        const index = this.audiosPlaying.indexOf(audio);
        if (index !== -1)
        {
            const audio = this.audiosPlaying[index];
            if (!audio.paused) audio.pause();
            this.audiosPlaying.swapDelete(index);
        }
    }

    static pauseAudio()
    {
        this.audiosPlaying.fastLoop(audio => audio.pause());
    }

    static resumeAudio()
    {
        this.audiosPlaying.fastLoop(audio => audio.play());
    }
}

const BACKGROUND_MUSIC = AUDIOS_PATH + "zenitsu-theme.mp3";

const PLAYER_WALK_SFX = MISSING_AUDIO;
const PLAYER_IDLE_SFX = AUDIOS_PATH + "sparks.mp3";
const SLASH_SFX = AUDIOS_PATH + "slash.mp3";

const ENEMY_SPAWN_SFX = AUDIOS_PATH + "spawn_growl.mp3";
const ENEMY_SFX = AUDIOS_PATH + "monster_growl.mp3";
const ENEMY_DEATH_SFX = AUDIOS_PATH + "imp_death.mp3";

//Loading sounds
AudioManager.loadAudio(MISSING_AUDIO, MISSING_AUDIO);
AudioManager.loadAudio(BACKGROUND_MUSIC, BACKGROUND_MUSIC);

AudioManager.loadAudio(SLASH_SFX, SLASH_SFX);
AudioManager.loadAudio(PLAYER_WALK_SFX, PLAYER_WALK_SFX);

export
{
    BACKGROUND_MUSIC,

    PLAYER_IDLE_SFX,
    SLASH_SFX,

    ENEMY_SPAWN_SFX,
    ENEMY_DEATH_SFX,
    ENEMY_SFX,

    AudioManager
};