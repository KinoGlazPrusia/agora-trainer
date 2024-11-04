// CONTENT SCRIPT
/* This scripts will be injected into the page and will be responsible 
for having an instance of the Player and keep its state updated communicating with the 
player service. */

import { Player } from "../Player.mjs"
import { Message } from "../Message.mjs"
import { Context } from "../Context.mjs"
import { Action } from "../Action.mjs"

import { parseScript } from "../utils/parser.utils"

class PlayerAPI {
    constructor() {
        this.player = new Player(this)

        this.fetchInitialState()
        this.setupListeners()
    }

    fetchInitialState() {
        console.log("Player API loaded. Syncing state...")
        chrome.runtime.sendMessage(
            new Message(Message.GET_STATE, Context.PLAYER_SERVICE).get(), 
            (state) => {
                this.fetchSate(state)
                if (this.player.isPlaying) {
                    // Aquí revisamos en la carga inicial si el script se estaba reproduciendo para seguir con ello
                    this.handlePlay(this.player.script, ++this.player.step)
                }
            }
        )
    }
    
    /* LISTENERS */
    setupListeners() {
        chrome.runtime.onMessage.addListener((message, sender, response) => {
            if (message.target === Context.PLAYER_API) {
                switch (message.code) {
                    case Message.PLAY:
                        if (this.player.isPlaying) {
                            response("This script is already playing.")
                            break
                        }
            
                        this.handlePlay(message.data, this.player.step)
                        response('The script is playing.')
                        break
            
                    case Message.PAUSE:
                        if (this.player.isPaused) {
                            this.handleStop()
                            response("The script is stopped.")
                            break
                        }

                        this.handlePause()
                        response("The script is paused.")
                        break
                }
            }
        })
    }

    /* HANDLERS */
    handlePlay(script) {
        this.player.isPlaying = true
        this.player.isPaused = false
        this.player.isStopped = false
        this.player.script = script
        this.syncState()
    
        this.player.play(parseScript(script), this.player.step)
    }

    handlePause() {
        this.player.isPlaying = false
        this.player.isPaused = true
        this.player.isStopped = false
        this.syncState()
    }

    handleStop() {
        this.player.isPlaying = false
        this.player.isPaused = false
        this.player.isStopped = true
        this.player.step = 0
        this.syncState()

        console.log("The script is finished")

        // We emit a message so that if the recorder is running, it can stop recording
        chrome.runtime.sendMessage(new Message(Message.STOP_RECORDING, Context.RECORDER_SERVICE).get())
        chrome.runtime.sendMessage(new Message(Message.STOP, Context.POPUP).get())
    }

    /* STATE MANAGEMENT */
    fetchSate(state) {
        this.player.isPlaying = state.playing
        this.player.isPaused = state.paused
        this.player.isStopped = state.stopped
        this.player.script = state.script
        this.player.step = state.step
    }

    syncState() {
        const state = {
            playing: this.player.isPlaying,
            paused: this.player.isPaused,
            stopped: this.player.isStopped,
            script: this.player.script,
            step: this.player.step
        }
    
        chrome.runtime.sendMessage(new Message(Message.SET_STATE, Context.PLAYER_SERVICE, {state: state}).get())
    }
}

const playerAPI = new PlayerAPI()