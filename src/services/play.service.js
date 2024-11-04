// SERVICE DEFINITION (It is actually a controller more than a service)
/* We'll define the play service here. 
It will be responsible for managing and storing the state of the player.
It will also be responsible for listening to messages from the content scripts (API's) 
and updating or fetching the state accordingly.*/

import { Messenger } from "../Messenger.mjs"
import { Message } from "../Message.mjs"
import { Context } from "../Context.mjs"

export class PlayService {
    constructor() {
        this.messenger = new Messenger()
        this.state = {
            playing: false,
            paused: false,
            stopped: true,
            script: null,
            step: 0
        }

        this.setupListeners()
    }

    setState(state, key = null) {
        if (key) {
            this.state[key] = state
        } else {
            this.state = state
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
                        console.log("The player instance has been fetched with a sync state.")
                        response(this.getState())
                        break

                    case Message.SET_STATE:
                        this.setState(message.data.state, message.data.key ?? null)
                        // console.log("New state:", this.getState())
                        break

                    /* PLAYER MANAGEMENT */
                    case Message.PLAY:
                        this.setState(message.data.script, 'script')
                        this.play()
                        break

                    case Message.PAUSE:
                        this.pause()
                        break

                    case Message.STOP:
                        this.stop()
                        break
                }
            }
        })
    }

    play() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(
                tabs[0].id, 
                new Message(Message.PLAY, Context.PLAYER_API, this.getState().script).get(),
                (response) => {
                    console.log("PLAY SERVICE:", response);
                });
        }); 
    }

    pause() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(
                tabs[0].id, 
                new Message(Message.PAUSE, Context.PLAYER_API).get(),
                (response) => {
                    console.log("PLAY SERVICE:", response);
                });
        }); 
    }
}
