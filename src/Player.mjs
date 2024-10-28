import { Narrator } from "./Narrator.mjs"
import { ACTION } from "./Action.mjs"

import { Messenger } from "./Messenger.mjs"
import { MESSAGE } from "./Message.mjs"

export class Player {
    constructor() {
        this.pause = false
        this.narrator = new Narrator()
        this.messenger = new Messenger()
    }

    // This function returns the ID of the active tab.
    async getCurrentTabId() {
        const currentTab = await chrome.tabs.query({active: true, currentWindow: true})
        return currentTab[0].id
    }

    async getCurrentTabUrl() {
        const currentTab = await chrome.tabs.query({active: true, currentWindow: true})
        return currentTab[0].url
    }

    async executeAction(callback, args = []) {
        const tabId = await this.getCurrentTabId()

        await chrome.scripting.executeScript({
            target: { tabId },
            func: callback,
            args: [...args]
        })
    }

    async navigateToTarget(targetURL) {
        const tabId = await this.getCurrentTabId()
        const tabUrl = await this.getCurrentTabUrl()


        if (targetURL.replace(/\/$/, '') === tabUrl.replace(/\/$/, '')) return

        console.log("TAB URL:", tabUrl.replace(/\/$/, ''), "TARGET:", targetURL.replace(/\/$/, ''))

        
        return new Promise(resolve => {
            this.messenger.send({message: MESSAGE.NAVIGATE_TO_TARGET, data: {current: tabId, target: targetURL}}, (response) => {
                console.log('Response received:', response)
                resolve()
            })
        })
    }

    async play(script, from = 0, component = null) {
        // We only redirect if the script is not already playing
        if (from === 0) {
            await this.navigateToTarget(script.target) // Not awaiting (some issue with the async/await)
            // Temporary solution:
            await this.executeAction(ACTION.WAIT, [1000]) // Weird bug (it works but idk why)
        }

        // This scripts creation could be automated with user natural input, developing a kind of "script editor" UI.
        const steps = script.steps
        let index = 0
        // We're using a 'for' because forEach cannot handle 'awaits'
        for (const {action, args, delay, wait, voiceover} of steps) {
            if (this.pause) {
                this.pause = false
                break
            }
            
            //console.log("Script started:", voiceover)
            if (index >= from) {
                if (delay > 0) {
                    await this.executeAction(ACTION.WAIT, [delay])
                }
    
                //console.log("Delay finished... executing action.")
                let voiceFinished
    
                if (voiceover.length > 0) {
                    voiceFinished = this.narrator.speak(voiceover)
                }
    
                await this.executeAction(action, args)
                await voiceFinished
    
                if (wait > 0) {
                    await this.executeAction(ACTION.WAIT, [wait])
                }   
    
                //console.log("Wait finished...")
                component.setCurrentStep(index + 1)
            }
            index++
        }
    }

    stop() {
        this.pause = true
    }

}