export class Message {
    // STATE MESSAGES
    static SET_STATE = 'SET_STATE'
    static GET_STATE = 'GET_STATE'

    // MISC MESSAGES
    static NAVIGATE_TO_TARGET = 0

    // STORAGE MESSAGES
    static SCRIPT_LOADED = 'SCRIPT_LOADED'

    // PLAYER MESSAGES
    static PLAY = 'PLAY'
    static PAUSE = 'PAUSE'
    static STOP = 'STOP'

    // RECORDER MESSAGES
    static RECORD = 'RECORD'
    static STOP_RECORDING = 'STOP_RECORDING'

    constructor(code, target, data) {
        this.message = {
            code: code,
            target: target,
            data: data
        }
    }

    get() {
        return this.message
    }
}