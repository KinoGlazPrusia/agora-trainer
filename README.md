# Agora Trainer

## Overview

Agora Trainer is a Chrome extension that automates website interactions for training purposes. It records these interactions as video tutorials with synchronized audio narration, helping users understand website functionality through guided demonstrations.

## Features

- Script-based interaction automation
- Video/audio recording of browser interactions
- Voice narration for each step
- Interactive cursor movements and clicks
- Customizable sound effects
- Multi-language support for narration

## Technologies Used

- **Action Scripts** - *Defines automated interaction* sequences
- **Chrome Extension API** - *Browser integration and control*
- **Media Recorder API** - *Video and audio capture*
- **Web Audio API** - *Sound effect generation*
- **SpeechSynthesis API** - *Text-to-speech narration*

## Getting Started

### Installation

1. Clone this repository
2. Open Chrome Extensions (chrome://extensions/)
3. Enable Developer Mode
4. Click "Load unpacked" and select the extension directory
5. Fix on the toolbar (within extension details)

### Basic Usage

1. Navigate to your target website - *In this case you have to go to Odoo's Unite! website home page as admin to be able to execute the demo.*
2. Click the Agora Trainer extension icon
3. Load your action script (*not implemented*)
4. Click "Start Recording" to begin the demonstration

## Action Scripts
Action scripts define the sequence of interactions to be performed. Each script consists of a name and an array of steps.

### Script Structure
```js 
{
    "name": "Demo Interaction",
    "metadata": {
        "version": "1.0",
        "author": "Your Name",
        "description": "Brief description of what this script does"
    },
    "steps": [
        {
            "action": ACTION.SETUP_CURSOR,     // Type of action to perform
            "args": [],                        // Arguments for the action
            "delay": 0,                        // Delay before action (ms)
            "wait": 500,                       // Wait after action (ms)
            "voiceover": "Welcome message"     // Narration text
        }
        // ... more steps
    ]
}
```

### Available Actions
```js
const ACTION = {
    SETUP_CURSOR: "setupCursor",           // Initialize cursor position
    MOVE_CURSOR_TO: "moveCursorTo",       // Move cursor to element
    CLICK_ON: "clickOn",                  // Click on element
    WRITE_ON_TEXT_INPUT: "writeOnInput"   // Type in text input
    // Add other available actions here
}
```

### Special Parameters

- ``wait: -1`` - Wait until voiceover finishes before next action (*not implemented*)
- ``delay: 0`` - Execute immediately after previous action
- ``args: []`` - Empty array for actions without parameters

## Output Configuration
The extension can be customized through a configuration file:

```js
{
    "video": {
        "resolution": VIDEO_RESOLUTION.1080P,    // 1920x1080
        "format": VIDEO_FORMAT.MP4,              // Output format
        "codec": VIDEO_CODEC.H264,               // Video codec
        "framerate": VIDEO_FRAMERATE.24FPS,      // Frame rate
        "compression": VIDEO_COMPRESSION.NONE     // Compression level
    },
    "audio": {
        "format": AUDIO_FORMAT.WAV,              // Audio format
        "codec": AUDIO_CODEC.LINEAR_PCM,         // Audio codec
        "sampleRate": AUDIO_SAMPLE_RATE.44100HZ, // Sample rate
        "compression": AUDIO_COMPRESSION.NONE     // Compression level
    },
    "animation": {
        "speed": 10                              // Cursor animation speed
    },
    "sound": {
        "kit": SOUND_KITS.CUTE,                  // Sound effect theme
        "voice": VOICE.OLD_MAN                   // Narrator voice
    }
}
```