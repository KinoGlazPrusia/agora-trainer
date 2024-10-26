import { PlainComponent, PlainState } from "../../../node_modules/plain-reactive/src/index.js"
import { Player } from "../../Player.mjs"
import { ACTION } from "../../Action.mjs"

class Script extends PlainComponent {
    constructor() {
        super('script-component', '../src/components/script/script.css')

        this.player = new Player()
        this.STATUS = {
            IS_INACTIVE: -1,
            IS_PLAYING: 0,
            IS_PAUSED: 1,
            IS_RECORDING: 2
        }
        
        this.script = new PlainState(this.parseScript(this.dataset.script), this)
        this.status = new PlainState(this.STATUS.IS_INACTIVE, this)
        this.currentStep = new PlainState(0, this)
    }

    template() {
        return `
            <!-- SCRIPT INFO -->
            <div class="script-info">
                <span class="script-title">${this.script.getState().name}</span>
                <span class="script-description">${this.script.getState().metadata.description}</span>
            </div>

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
        `
    }

    listeners() {
        this.$('.script-play-button').onclick = () => this.handlePlay()
        this.$('.script-stop-button').onclick = () => this.handleStop()
        this.$('.script-record-button').onclick = () => this.handleRecord()
    }

    handlePlay() {
        console.log(this.script.getState())
        this.status.setState(this.STATUS.IS_PLAYING)
        this.player.play(this.script.getState(), this.currentStep.getState(), this)
    }

    handleStop() {
        this.status.setState(this.STATUS.IS_PAUSED)
        this.player.stop()
    }

    handleRecord() {
        this.status.setState(this.STATUS.IS_RECORDING)
    }

    setCurrentStep(index) {
        this.currentStep.setState(index, false)
     
        if (this.currentStep.getState() >= this.script.getState().steps.length) {
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
        this.currentStep.setState(0, false)
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
        return ACTION[action]
    }
}

export default window.customElements.define("script-component", Script)
