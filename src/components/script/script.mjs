import { PlainComponent, PlainState } from "../../../node_modules/plain-reactive/src/index.js"
import { Player } from "../../Player.mjs"
import { Recorder } from "../../Recorder.mjs"
import { Messenger } from "../../Messenger.mjs"
import { Action } from "../../Action.mjs"
import { Message } from "../../Message.mjs"
import { Context } from "../../Context.mjs"

class Script extends PlainComponent {
    constructor() {
        super('script-component', '../src/components/script/script.css')

        this.STATUS = {
            IS_INACTIVE: -1,
            IS_PLAYING: 0,
            IS_PAUSED: 1,
            IS_RECORDING: 2
        }
        
        this.script = new PlainState(this.parseScript(this.dataset.script), this)
        this.status = new PlainState(this.STATUS.IS_INACTIVE, this)
        this.currentStep = new PlainState(0, this)

        this.messageListeners()
        this.fetchInitialState()
    }

    template() {
        // <span class="script-target">${this.script.getState().target}</span>
        return `
            <div class="left">
                <!-- SCRIPT INFO -->
                <div class="script-info">
                    <span class="script-title">${this.script.getState().name}</span>
                    <span class="script-description">${this.script.getState().metadata.description}</span>
                </div>
            </div>

            <div class="right">
                <!-- SCRIPT ACTIONS -->
                <div class="script-actions">

                    <button class="script-play-button ${this.status.getState() === this.STATUS.IS_PLAYING ? 'active' : ''}">
                        <span class="play-icon material-symbols-outlined">play_circle</span>
                    </button>
                    <button class="script-stop-button ${this.status.getState() === this.STATUS.IS_PAUSED ? 'active' : ''}">
                        <span class="stop-icon material-symbols-outlined">stop_circle</span>
                    </button>
                    <button class="script-record-button ${this.status.getState() === this.STATUS.IS_RECORDING ? 'active' : ''}">
                        <span class="record-icon material-symbols-outlined">screen_record</span>
                    </button>
                </div>

                <!-- SCRIPT PROGRESS -->
                <div class="script-progress-track">
                    <div class="script-progress-thumb"></div>
                </div>
            </div>
        `
    }

    listeners() {
        this.$('.script-play-button').onclick = () => this.handlePlay()
        this.$('.script-stop-button').onclick = () => this.handleStop()
        this.$('.script-record-button').onclick = () => this.handleRecord()
    }

    fetchInitialState() {
        chrome.runtime.sendMessage(
            new Message(Message.GET_STATE, Context.UI_SERVICE, this.id).get(), 
            (response) => {
                const state = response
                this.status.setState(state.status)
            }
        )
        // Action State
        // Progress State
    }

    messageListeners() {
        chrome.runtime.onMessage.addListener((message, sender, response) => {
            if (message.target === Context.POPUP) {
                switch (message.code) {
                    
                    case Message.STOP:
                        console.log("The player is requested to be stopped.")
                        this.reset()
                        break
                }
            }
        })
    }

    handlePlay(isRecording = false) {
        chrome.runtime.sendMessage(new Message(
            Message.PLAY, 
            Context.PLAYER_SERVICE, 
            {script: this.dataset.script }
        ).get())
        
        /* chrome.windows.create({
            url: "public/popup.html", // Your secondary popup HTML file
            type: "popup",
            width: 400,
            height: 150
        }) */

        if (isRecording) return
        this.status.setState(this.STATUS.IS_PLAYING)
        this.syncState()
    }

    handleStop() {
        chrome.runtime.sendMessage(new Message(
            Message.PAUSE, 
            Context.PLAYER_SERVICE
        ).get())

        this.status.setState(this.STATUS.IS_PAUSED)
        this.syncState()
    }

    handleReset() {
        this.status.setState(this.STATUS.IS_INACTIVE)
        this.currentStep.setState(0, false)
        this.syncState()
    }

    handleRecord() {
        chrome.runtime.sendMessage(new Message(
            Message.RECORD, 
            Context.RECORDER_SERVICE,
            {scriptName: this.script.getState().name}
        ).get())

        this.handlePlay()
        this.status.setState(this.STATUS.IS_RECORDING)
        this.syncState()
    }

    setCurrentStep(index) {
        this.currentStep.setState(index, false)
        
        // If the current step is greater than or equal to the number of steps, then reset the script
        if (this.currentStep.getState() >= this.script.getState().steps.length) {
            this.recorder.requestStop()
            this.reset()
            return
        }

        this.updateProgressBar()
    }

    updateProgressBar() {
        const progress = this.currentStep.getState() / this.script.getState().steps.length * 100
        const translation = Math.round(-100 + progress)
        this.$('.script-progress-thumb').style.transform = `translateY(${translation}%)`
    }

    reset() {
        this.status.setState(this.STATUS.IS_INACTIVE)
    }

    parseScript(script) {
        if (!script) return
        const jsonScript = JSON.parse(script)
        
        jsonScript.steps.forEach(step => {
            step.action = this.parseAction(step.action)
        })

        return jsonScript
    }

    parseAction(action) {
        return Action[action]
    }

    syncState() {
        const state = {
            status: this.status.getState(),
            progress: this.currentStep.getState(),
        }

        chrome.runtime.sendMessage(new Message(
            Message.SET_STATE,
            Context.UI_SERVICE,
            {state: state, key: this.id}
        ).get())
    }
}

export default window.customElements.define("script-component", Script)
