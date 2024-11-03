(function () {
    'use strict';

    class Messenger {
        send(data, callback = () => null) {
           chrome.runtime.sendMessage(data, (response) => {
                callback(response);
           });
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
        static UI = 'UI'
        static POPUP = 'POPUP'
        static CONTENT_SCRIPT = 'CONTENT_SCRIPT'
        static SERVICE = 'SERVICE'
        static BACKGROUND = 'BACKGROUND'
        static OFFSCREEN_DOCUMENT = 'OFFSCREEN_DOCUMENT'

        static PLAYER_SERVICE = 'PLAYER_SERVICE'
        static PLAYER_API = 'PLAYER_API'

        static RECORDER_SERVICE = 'RECORDER_SERVICE'
        static RECORDER_API = 'RECORDER_API'

        static STORAGE_API = 'STORAGE_API'
    }

    // SERVICE DEFINITION (It is actually a controller more than a service)
    /* We'll define the play service here. 
    It will be responsible for managing and storing the state of the player.
    It will also be responsible for listening to messages from the content scripts (API's) 
    and updating or fetching the state accordingly.*/


    class PlayService {
        constructor() {
            this.messenger = new Messenger();
            this.state = {
                playing: false,
                paused: false,
                stopped: true,
                script: null,
                step: 0
            };

            this.setupListeners();
        }

        setState(state, key = null) {
            if (key) {
                this.state[key] = state;
            } else {
                this.state = state;
            }
        }

        getState() {
            return this.state
        }

        setupListeners() {
            // FETCH STATE
            chrome.runtime.onMessage.addListener((message, sender, response) => {
                if (message.target === Context.PLAYER_SERVICE) {
                    switch (message.code) {

                        /* STATTE MANAGEMENT */
                        case Message.GET_STATE:
                            console.log("The player instance has been fetched with a sync state.");
                            response(this.getState());
                            break

                        case Message.SET_STATE:
                            this.setState(message.data.state, message.data.key ?? null);
                            console.log("New state:", this.getState());
                            break

                        /* PLAYER MANAGEMENT */
                        case Message.PLAY:
                            this.setState(message.data.script, 'script');
                            this.play();
                            break

                        case Message.PAUSE:
                            this.pause();
                            break

                        case Message.STOP:
                            this.stop();
                            break
                    }
                }
            });
        }

        play() {
            chrome.tabs.query({active: true}, (tabs) => {
                chrome.tabs.sendMessage(
                    tabs[0].id, 
                    new Message(Message.PLAY, Context.PLAYER_API, this.getState().script).get(),
                    (response) => {
                        console.log("PLAY SERVICE:", response);
                    });
            }); 
        }

        pause() {
            console.log("Pausing...");
            chrome.tabs.query({active: true}, (tabs) => {
                chrome.tabs.sendMessage(
                    tabs[0].id, 
                    new Message(Message.PAUSE, Context.PLAYER_API).get(),
                    (response) => {
                        console.log("PLAY SERVICE:", response);
                    });
            }); 
        }
    }

    class RecordService {
        constructor() {
            this.state = {
                recording: false,
                config: {
                    format: 'mp4',
                    fps: 120,
                    resolution: {
                        width: 1920,
                        height: 1080
                    }
                },
                data: []
            };

            this.initializeOffscreen();
            this.setupListeners();
        }

        setState(state, key = null) {
            if (key) {
                this.state[key] = state;
            } else {
                this.state = state;
            }
        }

        getState() {
            return this.state
        }

        setupListeners() {
            // FETCH STATE
            chrome.runtime.onMessage.addListener((message, sender, response) => {
                if (message.target === Context.RECORDER_SERVICE) {
                    switch (message.code) {

                        case Message.GET_STATE:
                            console.log("The recorder instance has been fetched with a sync state.");
                            response(this.getState());
                            break

                        case Message.SET_STATE:
                            this.setState(message.data.state, message.data.key ?? null);
                            console.log("New state:", this.getState());
                            break

                        case Message.RECORD:
                            console.log("The request to record has been received.");
                            if (this.state.recording) {
                                console.log("The recorder is  already recording.");
                                break
                            }

                            console.log("The request to record has been received.");
                            this.record(message.data.scriptName);
                            break

                        case Message.STOP_RECORDING:
                            console.log("The request to stop recording has been received.");
                            if (!this.state.recording) {
                                console.log("The recorder is not recording.");
                                break
                            }

                            this.stop();
                            break
                    }
                }
            });
        }

        record(scriptName) {
            chrome.tabs.query({active: true}, async (tabs) => {
                // The get streamId logic should be moved to other place
                const [streamId, filename] = await this.setup(tabs[0].id, scriptName);
                
                chrome.runtime.sendMessage(
                    new Message(Message.RECORD, Context.RECORDER_API, {streamId: streamId, filename: filename}).get(),
                    (response) => {
                        console.log("RECORD SERVICE:", response);
                });
            });
        }

        stop() {
            chrome.tabs.query({active: true}, async (tabs) => {
                chrome.runtime.sendMessage(
                    new Message(Message.STOP_RECORDING, Context.RECORDER_API).get(),
                    (response) => {
                        console.log("RECORD SERVICE:", response);
                });
            });
        }

        async setup(tabId, scriptName) {
            const streamId = await chrome.tabCapture.getMediaStreamId({targetTabId: tabId});
            const filename = `${scriptName}.${this.state.config.format}`.replace(/\s+/g, '_').toLowerCase();
            return [streamId, filename]
        }

        async initializeOffscreen() {
             // Initialize offscreen recorder
             const contexts = await chrome.runtime.getContexts({});
             const offscreen = contexts.find(c => {
                 c.contextType === 'OFFSCREEN_DOCUMENT';
             });
     
             if (!offscreen) {
                 await chrome.offscreen.createDocument({
                     url: 'public/offscreen.html',
                     reasons: ['USER_MEDIA'],
                     justification: 'Recording from chrome.tabCapture API'
                 });
             }
        }
    }

    // SERVICES INITIALIZATION
    /* We'll create an instance for each service within this background service */


    chrome.runtime.onInstalled.addListener(async () => {
        new PlayService();
        new RecordService();
    });

})();
