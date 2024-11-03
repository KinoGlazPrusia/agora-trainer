import { Action } from "../Action.mjs"

export function parseScript(script) {
    if (!script) return
    const jsonScript = JSON.parse(script)
    
    jsonScript.steps.forEach(step => {
        step.action = Action[step.action]
    })

    return jsonScript
}