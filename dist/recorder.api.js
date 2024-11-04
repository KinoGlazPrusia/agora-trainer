(function () {
    'use strict';

    class Narrator {
        constructor(audioContext = null, destination = null) {
            this.voices = window.speechSynthesis.getVoices();
            this.narrator = new SpeechSynthesisUtterance();
            this.narrator.voice = this.voices[0];
            this.narrator.lang = "es-ES";
            this.narrator.rate = 0.9;
            this.narrator.pitch = 0.75;
            this.audioContext = audioContext;
            this.destination = destination;
        }

        async speak(text) {
            return new Promise(resolve => {
                this.narrator.onend = () => {
                    resolve();
                };

                // Just for recording purposes
                if (this.audioContext && this.destination) {
                    const mediaStreamSource = this.audioContext.createMediaStreamSource(this.narrator.stream);
                    mediaStreamSource.connect(this.destination);
                }

                this.narrator.text = text;
                window.speechSynthesis.speak(this.narrator);
            })
        }
    }

    class Message {
        // STATE MESSAGES
        static SET_STATE = 'SET_STATE'
        static GET_STATE = 'GET_STATE'

        // MISC MESSAGES
        static NAVIGATE_TO_TARGET = 0

        // STORAGE MESSAGES
        static SCRIPT_LOADED = 'SCRIPT_LOADED'

        // PLAYER MESSAGES
        static PLAY = 'PLAY'
        static PAUSE = 'PAUSE'
        static STOP = 'STOP'

        // RECORDER MESSAGES
        static RECORD = 'RECORD'
        static STOP_RECORDING = 'STOP_RECORDING'

        constructor(code, target, data) {
            this.message = {
                code: code,
                target: target,
                data: data
            };
        }

        get() {
            return this.message
        }
    }

    class Context  {
        static POPUP = 'POPUP'
        static BACKGROUND = 'BACKGROUND'
        static OFFSCREEN_DOCUMENT = 'OFFSCREEN_DOCUMENT'

        static UI_SERVICE = 'UI'

        static PLAYER_SERVICE = 'PLAYER_SERVICE'
        static PLAYER_API = 'PLAYER_API'

        static RECORDER_SERVICE = 'RECORDER_SERVICE'
        static RECORDER_API = 'RECORDER_API'

        static STORAGE_API = 'STORAGE_API'
    }

    class Recorder {
        constructor(controller) {
            this.controller = controller;

            this.isRecording = false;

            this.recorder = null;
            this.config = {};
            this.data = [];

            this.narrator = new Narrator();
        }

        async start(streamId, filename) {
            console.log("RECORDER: Starting recording...");

            const combinedMedia = await this.setupCombinedMediaStream(streamId);
            this.recorder = new MediaRecorder(combinedMedia, {mimeType: `video/${this.config.format}`});
            
            this.recorder.ondataavailable = (event) => {
                this.data.push(event.data);
                this.controller.syncState();
            };

            this.recorder.onstop = () => {
                const blob = new Blob(this.data, {type: `video/${this.config.format}`});
                const url = URL.createObjectURL(blob);
        
                // Download the recorded video
                this.downloadVideo(url, filename, this.config.format);
        
                // Open a new tab with the recorded video
                this.previewVideo(url);

                this.recorder.stop();
        
                // Reset the recorder and data array
                this.recorder = undefined;
                this.data = [];
                this.controller.syncState();
            };

            this.recorder.start();
        }

        async stop() {
            this.recorder.stop();
            this.recorder.stream.getTracks().forEach(track => track.stop());
        }
        
        downloadVideo(url, filename, format) {
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        
        previewVideo(url) {
            window.open(url, '_blank');
        }

        async setupCombinedMediaStream(streamId) {
            // Video
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    mandatory: {
                        chromeMediaSource: 'tab',
                        chromeMediaSourceId: streamId
                    }
                },
                video: {
                    mandatory: {
                        chromeMediaSource: 'tab',
                        chromeMediaSourceId: streamId,
                        minWidth: this.config.resolution.width,
                        maxWidth: this.config.resolution.width,
                        minHeight: this.config.resolution.height,
                        maxHeight: this.config.resolution.height,
                        frameRate: this.config.fps
                    }
                }
            });

            // Audio (Speech)
            const speechContext = new AudioContext();
            const speechDestination = speechContext.createMediaStreamDestination();

            const oscillator = speechContext.createOscillator();
            oscillator.connect(speechDestination);
            oscillator.start();

            //speechDestination.connect(speechContext.destination)

            // Combined stream
            const combinedStream = new MediaStream();

            // Add video track
            mediaStream.getVideoTracks().forEach(track => {
                combinedStream.addTrack(track);
            });

            // Add audio track
            /* mediaStream.getAudioTracks().forEach(track => {
                combinedStream.addTrack(track)
            }) */

            // Add audio track
            speechDestination.stream.getAudioTracks().forEach(track => {
                combinedStream.addTrack(track);
            });

            return combinedStream
        }

        async play(script, from = 0, component = null) {
            // We only redirect if the script is not already playing
            if (from === 0) {
                await this.navigateToTarget(script.target); // Not awaiting (some issue with the async/await)
                // Temporary solution:
                await this.executeAction(ACTION.WAIT, [1000]); // Weird bug (it works but idk why)
            }

            // This scripts creation could be automated with user natural input, developing a kind of "script editor" UI.
            const steps = script.steps;
            let index = 0;
            // We're using a 'for' because forEach cannot handle 'awaits'
            for (const {action, args, delay, wait, voiceover} of steps) {
                if (this.pause) {
                    this.pause = false;
                    break
                }
                
                //console.log("Script started:", voiceover)
                if (index >= from) {
                    if (delay > 0) {
                        await this.executeAction(ACTION.WAIT, [delay]);
                    }
        
                    //console.log("Delay finished... executing action.")
                    let voiceFinished;
        
                    if (voiceover.length > 0) {
                        voiceFinished = this.narrator.speak(voiceover);
                    }
        
                    await this.executeAction(action, args);
                    await voiceFinished;
        
                    if (wait > 0) {
                        await this.executeAction(ACTION.WAIT, [wait]);
                    }   
        
                    //console.log("Wait finished...")
                    component.setCurrentStep(index + 1);
                }
                index++;
            }
        }

       
    }

    class RecorderAPI {
        constructor() {
            this.recorder = new Recorder();

            this.fetchInitialState();
            this.setupListeners();
        }

        fetchInitialState() {
            console.log("Recorder API loaded. Syncing state...");
            chrome.runtime.sendMessage(
                new Message(Message.GET_STATE, Context.RECORDER_SERVICE).get(), 
                (state) => {
                    this.fetchSate(state);
                }
            );
        }

        /* LISTENERS */
        setupListeners() {
            chrome.runtime.onMessage.addListener((message, sender, response) => {
                if (message.target === Context.RECORDER_API) {
                    switch (message.code) {

                        case Message.RECORD:
                            this.handleStart(message.data.streamId, message.data.filename);
                            response('Started recording...');
                            break

                        case Message.STOP_RECORDING:
                            this.handleStop();
                            break
                    }
                }
            });
        }

        /* HANDLERS */
        handleStart(streamId, filename) {
            this.recorder.isRecording = true;
            this.syncState();

            this.recorder.start(streamId, filename);
        }

        handleStop() {
            this.recorder.stop();
        }

        /* STATE MANAGEMENT */ 
        fetchSate(state) {
            this.recorder.config = state.config;
            this.recorder.data = state.data;
        }

        syncState() {
            const state = {
                recording: this.recorder.isRecording,
                config: this.recorder.config,
                data: this.recorder.data
            };

            chrome.runtime.sendMessage(new Message(Message.SET_STATE, Context.RECORDER_SERVICE, {state: state}).get());
        }
    }

    new RecorderAPI();

})();
