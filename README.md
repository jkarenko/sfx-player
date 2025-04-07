# SFX-Player

A utility for loading and playing sound effects in web applications with support for sample indexing.

## Features

- Load and cache audio files
- Play full sounds or specific samples from sound files
- Volume control and muting
- Support for looping sounds
- Asynchronous playback to avoid blocking the main thread

## Installation

```bash
npm install sfx-player
```

## Usage

### Basic Usage

```typescript
import { SoundEffectsPlayer, SoundSample } from 'sfx-player';

// Define your sound paths
const soundPaths = {
  whoosh: './sounds/whoosh.mp3',
  explosion: './sounds/explosion.mp3',
  pop: './sounds/pop.mp3'
};

// Create a new player
const player = new SoundEffectsPlayer(soundPaths);

// Preload all sounds
player.preloadAllSounds();

// Play a full sound
player.playSound('explosion');

// Define samples for a sound
const whooshSamples: SoundSample[] = [
  { start: 0, duration: 0.5 },
  { start: 0.5, duration: 0.5 },
  { start: 1.0, duration: 0.5 }
];

// Register samples for easy access
player.registerSamples('whoosh', whooshSamples);

// Play a random sample
player.playRegisteredSample('whoosh');

// Or play a sample directly
player.playSoundSample('whoosh', whooshSamples);

// Control volume
player.setVolume(0.5);

// Mute/unmute
player.setMuted(true);
```

### Advanced Usage

```typescript
// Play with custom volume
const sound = player.playSound('explosion', 0.8);

// Play looping sound
const loopingSound = player.playSound('ambient', undefined, true);

// Stop a sound manually
import { stopSound } from 'sfx-player';
stopSound(loopingSound);
```

## License

MIT