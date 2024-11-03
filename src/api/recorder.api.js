import { Recorder } from "../Recorder.mjs";
import { Message } from "../Message.mjs";
import { Context } from "../Context.mjs";

class RecorderAPI {
    constructor() {
        this.recorder = new Recorder()

        this.fetchInitialState()
        this.setupListeners()
    }

    fetchInitialState() {
        console.log("Recorder API loaded. Syncing state...")
        chrome.runtime.sendMessage(
            new Message(Message.GET_STATE, Context.RECORDER_SERVICE).get(), 
            (state) => {
                this.fetchSate(state)
            }
        )
    }

    /* LISTENERS */
    setupListeners() {
        chrome.runtime.onMessage.addListener((message, sender, response) => {
            if (message.target === Context.RECORDER_API) {
                switch (message.code) {

                    case Message.RECORD:
                        this.handleStart(message.data.streamId, message.data.filename)
                        response('Started recording...')
                        break

                    case Message.STOP_RECORDING:
                        this.handleStop()
                        break
                }
            }
        })
    }

    /* HANDLERS */
    handleStart(streamId, filename) {
        this.recorder.isRecording = true
        this.syncState()

        this.recorder.start(streamId, filename)
    }

    handleStop() {
        this.recorder.stop()
    }

    /* STATE MANAGEMENT */ 
    fetchSate(state) {
        this.recorder.config = state.config
        this.recorder.data = state.data
    }

    syncState() {
        const state = {
            recording: this.recorder.isRecording,
            config: this.recorder.config,
            data: this.recorder.data
        }

        chrome.runtime.sendMessage(new Message(Message.SET_STATE, Context.RECORDER_SERVICE, {state: state}).get())
    }
}

const recorderAPI = new RecorderAPI()