import { Message } from "../Message.mjs"
import { Context } from "../Context.mjs"
import { initializeOffscreen } from "../utils/offscreen.utils"

export class RecordService {
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
        }

        this.initializeOffscreen()
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
            if (message.target === Context.RECORDER_SERVICE) {
                switch (message.code) {

                    case Message.GET_STATE:
                        console.log("The recorder instance has been fetched with a sync state.")
                        response(this.getState())
                        break

                    case Message.SET_STATE:
                        this.setState(message.data.state, message.data.key ?? null)
                        console.log("New state:", this.getState())
                        break

                    case Message.RECORD:
                        console.log("The request to record has been received.")
                        if (this.state.recording) {
                            console.log("The recorder is  already recording.")
                            break
                        }

                        console.log("The request to record has been received.")
                        this.record(message.data.scriptName)
                        break

                    case Message.STOP_RECORDING:
                        console.log("The request to stop recording has been received.")
                        if (!this.state.recording) {
                            console.log("The recorder is not recording.")
                            break
                        }

                        this.stop()
                        break
                }
            }
        })
    }

    record(scriptName) {
        chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
            // The get streamId logic should be moved to other place
            const [streamId, filename] = await this.setup(tabs[0].id, scriptName)
            
            chrome.runtime.sendMessage(
                new Message(Message.RECORD, Context.RECORDER_API, {streamId: streamId, filename: filename}).get(),
                (response) => {
                    console.log("RECORD SERVICE:", response);
            })
        })
    }

    stop() {
        chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
            chrome.runtime.sendMessage(
                new Message(Message.STOP_RECORDING, Context.RECORDER_API).get(),
                (response) => {
                    console.log("RECORD SERVICE:", response);
            })
        })
    }

    async setup(tabId, scriptName) {
        const streamId = await chrome.tabCapture.getMediaStreamId({targetTabId: tabId})
        const filename = `${scriptName}.${this.state.config.format}`.replace(/\s+/g, '_').toLowerCase()
        return [streamId, filename]
    }

    async initializeOffscreen() {
         // Initialize offscreen recorder
         const contexts = await chrome.runtime.getContexts({})
         const offscreen = contexts.find(c => {
             c.contextType === 'OFFSCREEN_DOCUMENT'
         })
 
         if (!offscreen) {
             await chrome.offscreen.createDocument({
                 url: 'public/offscreen.html',
                 reasons: ['USER_MEDIA'],
                 justification: 'Recording from chrome.tabCapture API'
             })
         }
    }
}