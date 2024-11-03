import { Narrator } from "./Narrator.mjs"
import { Action } from "./Action.mjs"
import { getCurrentTabId } from "./utils/tabs.utils.js" 

export class Player {
    constructor(controller) {
        this.controller = controller

        this.isPlaying = false
        this.isPaused = false
        this.isStopped = true

        this.step = 0
        this.script = null

        this.narrator = new Narrator()
    }

    async executeAction(callback, args = []) {
        await callback(...args)
    }

    async play(script, from = 0, component = null) {
        // We only redirect if the script is not already playing
        /* if (from === 0) {
            await this.navigateToTarget(script.target) // Not awaiting (some issue with the async/await)
            // Temporary solution:
            await this.executeAction(ACTION.WAIT, [1000]) // Weird bug (it works but idk why)
        } */

        // This scripts creation could be automated with user natural input, developing a kind of "script editor" UI.
        const steps = script.steps
        let index = 0
        // We're using a 'for' because forEach cannot handle 'awaits'
        for (const {action, args, delay, wait, voiceover} of steps) {
            if (this.isPaused) {
                console.log("Script paused...")
                break
            }
            
            //console.log("Script started:", voiceover)
            if (index >= from) {
                if (delay > 0) {
                    console.log("Delaying for: ", delay)
                    await this.executeAction(Action.WAIT, [delay])
                    console.log("Delay finished...")
                }
    
                //console.log("Delay finished... executing action.")
                let voiceFinished
    
                if (voiceover.length > 0) {
                    voiceFinished = this.narrator.speak(voiceover)
                }
    
                await this.executeAction(action, args)
                await voiceFinished
    
                if (wait > 0) {
                    console.log("Waiting for: ", wait)
                    await this.executeAction(Action.WAIT, [wait])
                    console.log("Wait finished...")
                }   
    
                //console.log("Wait finished...")
                this.step = index + 1
                this.controller.syncState()
            }
            index++

            if (index >= steps.length) {
                this.controller.handleStop()
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