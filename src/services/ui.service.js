import { Context } from '../Context.mjs'
import { Message } from '../Message.mjs'

export class UIService {
    constructor() {
        this.states = {}

        /* EXAMPLE:
        "script-component-1": {
            status: 0, // 0: inactive, 1: playing, 2: paused, 3: recording
            progress: 35 // 0 to 100 (%)
        }
        */

        this.setupListeners()
    }

    setState(state, key) {
        this.states[key] = state
    }

    getState(componentId) {
        if (!this.states[componentId]) {
            this.states[componentId] = null
        }

        return this.states[componentId] 
    }

    setupListeners() {
        // FETCH STATE
        chrome.runtime.onMessage.addListener((message, sender, response) => {
            if (message.target === Context.UI_SERVICE) {
                switch (message.code) {
                    /* STATTE MANAGEMENT */
                    case Message.GET_STATE:
                        console.log("The UI component has been fetched with a sync state.")
                        response(this.getState(message.data))
                        break

                    case Message.SET_STATE:
                        console.log("The state has been updated")
                        this.setState(message.data.state, message.data.key)
                        break
                }
            }
        })
    }
}