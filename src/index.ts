/**
 * A utility for loading and playing sound effects in web applications.
 * Provides functions for playing full sounds or specific samples from sound files.
 */

// Map to store loaded audio elements
const audioCache: Map<string, HTMLAudioElement> = new Map();

// Default global settings
let globalVolume = 0.7;
let muted = false;

// Define a sample with start time and duration
export interface SoundSample {
    start: number;
    duration: number;
}

// Sound configuration interface
export interface SoundConfig {
    [key: string]: string;
}

/**
 * SoundEffectsPlayer class for managing and playing sound effects
 */
export class SoundEffectsPlayer {
    private soundPaths: SoundConfig;
    private sampleCollections: Record<string, SoundSample[]> = {};

    /**
     * Create a new SoundEffectsPlayer
     * @param soundPaths - Object mapping sound keys to file paths
     * @param initialVolume - Initial volume (0.0 to 1.0)
     */
    constructor(soundPaths: SoundConfig, initialVolume: number = 0.7) {
        this.soundPaths = soundPaths;
        globalVolume = Math.max(0, Math.min(1, initialVolume));
    }

    /**
     * Register a collection of samples for a specific sound
     * @param key - The sound key
     * @param samples - Array of samples with start times and durations
     */
    registerSamples(key: string, samples: SoundSample[]): void {
        this.sampleCollections[key] = samples;
    }

    /**
     * Preload a sound file into the audio cache
     * @param key - The identifier for the sound
     * @param path - The path to the sound file
     */
    preloadSound(key: string, path: string): void {
        if (!audioCache.has(key)) {
            const audio = new Audio(path);
            audio.preload = 'auto';
            audioCache.set(key, audio);

            // Load the audio file
            audio.load();
        }
    }

    /**
     * Preload all configured sounds
     */
    preloadAllSounds(): void {
        Object.entries(this.soundPaths).forEach(([key, path]) => {
            this.preloadSound(key, path);
        });
    }

    /**
     * Play a sound effect
     * @param key - The identifier for the sound to play
     * @param volume - Optional volume override (0.0 to 1.0)
     * @param loop - Whether the sound should loop
     * @returns The audio element that's playing, or undefined if the sound couldn't be played
     */
    playSound(key: string, volume?: number, loop: boolean = false): HTMLAudioElement | undefined {
        if (muted) return undefined;

        // If the sound isn't cached, try to load it
        if (!audioCache.has(key) && key in this.soundPaths) {
            this.preloadSound(key, this.soundPaths[key]);
        }

        const audio = audioCache.get(key);
        if (audio) {
            // Clone the audio to allow overlapping sounds
            const soundInstance = new Audio(audio.src);
            soundInstance.volume = volume !== undefined ? volume : globalVolume;
            soundInstance.loop = loop;

            // Play the sound asynchronously to avoid blocking the main thread
            setTimeout(() => {
                soundInstance.play().catch(error => {
                    console.error(`Error playing sound "${key}":`, error);
                });
            }, 0);

            return soundInstance;
        }

        console.warn(`Sound "${key}" not found in audio cache`);
        return undefined;
    }

    /**
     * Play a random sample from a sound file
     * @param key - The identifier for the sound to play
     * @param samples - Array of samples with start times and durations
     * @param volume - Optional volume override (0.0 to 1.0)
     * @returns The audio element that's playing, or undefined if the sound couldn't be played
     */
    playSoundSample(
        key: string,
        samples: SoundSample[],
        volume?: number
    ): HTMLAudioElement | undefined {
        if (muted) return undefined;

        // If the sound isn't cached, try to load it
        if (!audioCache.has(key) && key in this.soundPaths) {
            this.preloadSound(key, this.soundPaths[key]);
        }

        const audio = audioCache.get(key);
        if (audio) {
            // Clone the audio to allow overlapping sounds
            const soundInstance = new Audio(audio.src);
            soundInstance.volume = volume !== undefined ? volume : globalVolume;

            // Select a random sample
            const randomSample = samples[Math.floor(Math.random() * samples.length)];

            // Set the start time to play only the selected sample
            soundInstance.currentTime = randomSample.start;

            // Play the sound asynchronously to avoid blocking the main thread
            setTimeout(() => {
                soundInstance.play().catch(error => {
                    console.error(`Error playing sound "${key}":`, error);
                });

                // Stop the sound after the sample duration
                setTimeout(() => {
                    this.stopSound(soundInstance);
                }, randomSample.duration * 1000);
            }, 0);

            return soundInstance;
        }

        console.warn(`Sound "${key}" not found in audio cache`);
        return undefined;
    }

    /**
     * Play a registered sample collection
     * @param key - The sound key
     * @param volume - Optional volume override
     */
    playRegisteredSample(key: string, volume?: number): HTMLAudioElement | undefined {
        if (key in this.sampleCollections) {
            return this.playSoundSample(key, this.sampleCollections[key], volume);
        }
        console.warn(`No sample collection registered for "${key}"`);
        return undefined;
    }

    /**
     * Stop a currently playing sound
     * @param audio - The audio element to stop
     */
    stopSound(audio: HTMLAudioElement): void {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    /**
     * Set the global volume for all sounds
     * @param volume - Volume level (0.0 to 1.0)
     */
    setVolume(volume: number): void {
        globalVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Get the current global volume
     * @returns The current volume level
     */
    getVolume(): number {
        return globalVolume;
    }

    /**
     * Mute or unmute all sounds
     * @param isMuted - Whether sounds should be muted
     */
    setMuted(isMuted: boolean): void {
        muted = isMuted;
    }

    /**
     * Check if sounds are currently muted
     * @returns Whether sounds are muted
     */
    isMuted(): boolean {
        return muted;
    }
}

// Export utility functions for direct use
export function stopSound(audio: HTMLAudioElement): void {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}