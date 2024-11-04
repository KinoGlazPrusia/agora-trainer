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

    const Action = {
        WAIT_DOM_CONTENT_LOADED: async () => {
            return new Promise(resolve => {
                if (document.readyState === "complete") {
                    console.log("DOMContentLoaded");
                    resolve();
                } else {
                    document.addEventListener("DOMContentLoaded", () => {
                        console.log("DOMContentLoaded");
                        resolve();
                    });
                }
            })
        },

        SETUP_CURSOR: async () => {
            console.log("Setting up cursor...");
            const cursor = document.createElement("div");
            cursor.setAttribute("id", "fake-cursor");
            cursor.innerHTML = `
            <style>
                @keyframes fadein {
                    0% { opacity: 0 }
                    100% {  opacity: 1}
                }

                @keyframes fadeout {
                    0% { opacity: 1 }
                    100% { opacity: 0 }
                }

                @keyframes glow {
                    0% { background-color: yellowgreen }
                    100% { background-color: cyan }
                }
            </style>
            <div class="center">
            </div>
        `;

            const center = cursor.querySelector('.center');

            document.querySelector("#fake-cursor") 
                ? null
                : document.body.appendChild(cursor);

            cursor.style.position = "absolute";
            cursor.style.top = "0";
            cursor.style.left = "0";
            cursor.style.width = "50px";
            cursor.style.height = "50px";
            cursor.style.display = 'grid';
            cursor.style.placeContent = 'center';
            cursor.style.borderRadius = "100%";
            cursor.style.backgroundColor = "rgba(71, 128, 214, 0.2)";
            cursor.style.backdropFilter = 'blur(0.5px)';
            cursor.style.zIndex = "9999";
            cursor.style.transition = "500ms";
            cursor.style.animation = 'fadein 1s normal ease-in';

            center.style.width = '10px';
            center.style.height = '10px';
            center.style.borderRadius = "100%";
            center.style.backgroundColor = 'yellowgreen';
            center.style.zIndex = "99999";
            center.style.transition = "500ms";
            center.style.boxShadow = '0px 5px 10px rgba(0, 0, 0, 0.2)';
            center.style.animation = 'glow 4s ease-in-out infinite alternate';
        },

        REMOVE_CURSOR: async () => {
            console.log("Removing cursor...");
            const cursor = document.querySelector("#fake-cursor");
            // Insert a fadeout animation (500ms) 
            cursor.style.animation = 'fadeout 1s normal ease-in';
            setTimeout(() => cursor.remove(), 1000);
        },

        WAIT: async (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms))
        },

        MOVE_CURSOR_TO: async (selector) => {
            // It could use another param called speed, which will modify the cursor.style.transition
            const cursor = document.querySelector("#fake-cursor");
            const element = document.querySelector(selector);

            console.log("Moving the cursor to:", element);


            cursor.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            
            const targetPos = {
                x: elementRect.top + (elementRect.height / 2),
                y: elementRect.left + (elementRect.width / 2)
            };

            cursor.style.transform = `translate(calc(${targetPos.y}px - 50%), calc(${targetPos.x}px - 50%))`;
        },

        CLICK_ON: async (selector) => {
            const element = document.querySelector(selector);
            console.log("Clicking on:", element);
            element.click();
        },

        FOCUS_INPUT: async (selector) => {
            const element = document.querySelector(selector);
            console.log("Focusing on:", element);
            element.focus();
        },

        WRITE_ON_TEXT_INPUT: async (selector, text, writingSpeed = 100) => {
            /* return new Promise(async resolve => {
                const element = document.querySelector(selector)
                console.log("Writing on:", element)
                const textArray = text.split('')
                for (const char of textArray) {
                    element.value += char
                    await new Promise(resolve => setTimeout(resolve, writingSpeed))
                }
                resolve()
            }) */
            const element = document.querySelector(selector);
            const textArray = text.split('');
            console.log("Writing on:", element);
            for (const char of textArray) {
                element.value += char;
                await new Promise(resolve => setTimeout(resolve, writingSpeed));
            }
        },

        OPEN_POPUP: '',
        CLOSE_POPUP: '',
    };

    class Player {
        constructor(controller) {
            this.controller = controller;

            this.isPlaying = false;
            this.isPaused = false;
            this.isStopped = true;

            this.step = 0;
            this.script = null;

            this.narrator = new Narrator();
        }

        async executeAction(callback, args = []) {
            await callback(...args);
        }

        async play(script, from = 0, component = null) {
            // We only redirect if the script is not already playing
            /* if (from === 0) {
                await this.navigateToTarget(script.target) // Not awaiting (some issue with the async/await)
                // Temporary solution:
                await this.executeAction(ACTION.WAIT, [1000]) // Weird bug (it works but idk why)
            } */

            // This scripts creation could be automated with user natural input, developing a kind of "script editor" UI.
            const steps = script.steps;
            let index = 0;
            // We're using a 'for' because forEach cannot handle 'awaits'
            for (const {action, args, delay, wait, voiceover} of steps) {
                if (this.isPaused) {
                    console.log("Script paused...");
                    break
                }
                
                //console.log("Script started:", voiceover)
                if (index >= from) {
                    if (delay > 0) {
                        console.log("Delaying for: ", delay);
                        await this.executeAction(Action.WAIT, [delay]);
                        console.log("Delay finished...");
                    }
        
                    //console.log("Delay finished... executing action.")
                    let voiceFinished;
        
                    if (voiceover.length > 0) {
                        voiceFinished = this.narrator.speak(voiceover);
                    }
        
                    await this.executeAction(action, args);
                    await voiceFinished;
        
                    if (wait > 0) {
                        console.log("Waiting for: ", wait);
                        await this.executeAction(Action.WAIT, [wait]);
                        console.log("Wait finished...");
                    }   
        
                    //console.log("Wait finished...")
                    this.step = index + 1;
                    this.controller.syncState();
                }
                index++;

                if (index >= steps.length) {
                    this.controller.handleStop();
                }
            }
        }

        /* 
        async navigateToTarget(targetURL) {
            const tabId = await getCurrentTabId()
            const tabUrl = await getCurrentTabUrl()


            if (targetURL.replace(/\/$/, '') === tabUrl.replace(/\/$/, '')) return

            console.log("TAB URL:", tabUrl.replace(/\/$/, ''), "TARGET:", targetURL.replace(/\/$/, ''))

            
            return new Promise(resolve => {
                this.messenger.send({message: Message.NAVIGATE_TO_TARGET, data: {current: tabId, target: targetURL}}, (response) => {
                    console.log('Response received:', response)
                    resolve()
                })
            })
        }

        */
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

    function parseScript(script) {
        if (!script) return
        const jsonScript = JSON.parse(script);
        
        jsonScript.steps.forEach(step => {
            step.action = Action[step.action];
        });

        return jsonScript
    }

    // CONTENT SCRIPT
    /* This scripts will be injected into the page and will be responsible 
    for having an instance of the Player and keep its state updated communicating with the 
    player service. */


    class PlayerAPI {
        constructor() {
            this.player = new Player(this);

            this.fetchInitialState();
            this.setupListeners();
        }

        fetchInitialState() {
            console.log("Player API loaded. Syncing state...");
            chrome.runtime.sendMessage(
                new Message(Message.GET_STATE, Context.PLAYER_SERVICE).get(), 
                (state) => {
                    this.fetchSate(state);
                    if (this.player.isPlaying) {
                        // Aquí revisamos en la carga inicial si el script se estaba reproduciendo para seguir con ello
                        this.handlePlay(this.player.script, ++this.player.step);
                    }
                }
            );
        }
        
        /* LISTENERS */
        setupListeners() {
            console.log("API");
            chrome.runtime.onMessage.addListener((message, sender, response) => {
                console.log(message);
                if (message.target === Context.PLAYER_API) {
                    switch (message.code) {
                        case Message.PLAY:
                            if (this.player.isPlaying) {
                                response("This script is already playing.");
                                break
                            }
                
                            this.handlePlay(message.data, this.player.step);
                            response('The script is playing.');
                            break
                
                        case Message.PAUSE:
                            if (this.player.isPaused) {
                                this.handleStop();
                                response("The script is stopped.");
                                break
                            }

                            this.handlePause();
                            response("The script is paused.");
                            break
                    }
                }
            });
        }

        /* HANDLERS */
        handlePlay(script) {
            this.player.isPlaying = true;
            this.player.isPaused = false;
            this.player.isStopped = false;
            this.player.script = script;
            this.syncState();
        
            this.player.play(parseScript(script), this.player.step);
        }

        handlePause() {
            this.player.isPlaying = false;
            this.player.isPaused = true;
            this.player.isStopped = false;
            this.syncState();
        }

        handleStop() {
            this.player.isPlaying = false;
            this.player.isPaused = false;
            this.player.isStopped = true;
            this.player.step = 0;
            this.syncState();

            console.log("The script is finished");

            // We emit a message so that if the recorder is running, it can stop recording
            chrome.runtime.sendMessage(new Message(Message.STOP_RECORDING, Context.RECORDER_SERVICE).get());
            chrome.runtime.sendMessage(new Message(Message.STOP, Context.POPUP).get());
        }

        /* STATE MANAGEMENT */
        fetchSate(state) {
            this.player.isPlaying = state.playing;
            this.player.isPaused = state.paused;
            this.player.isStopped = state.stopped;
            this.player.script = state.script;
            this.player.step = state.step;
        }

        syncState() {
            const state = {
                playing: this.player.isPlaying,
                paused: this.player.isPaused,
                stopped: this.player.isStopped,
                script: this.player.script,
                step: this.player.step
            };
        
            chrome.runtime.sendMessage(new Message(Message.SET_STATE, Context.PLAYER_SERVICE, {state: state}).get());
        }
    }

    new PlayerAPI();

})();
