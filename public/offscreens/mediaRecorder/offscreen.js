import { Recorder } from "../../../src/Recorder.mjs";
import { Message } from "../../../src/Message.mjs";
import { Context } from "../../../src/Context.mjs";

chrome.runtime.onMessage.addListener(async (request) => {
    console.log('Received message', request)
    if (request.target === Context.OFFSCREEN_DOCUMENT) {
        switch (request.message) {

            case Message.START_RECORDING:
                await handleStartRecord(request)
                break;

            case Message.STOP_RECORDING:
                await handleStopRecord()
        }
    }
})

const recorder = new Recorder()

async function handleStartRecord(request) {
    recorder.start(request.data, request.filename)
}

async function handleStopRecord() {
    console.log('Request to stop recording')
    if (!recorder.isRecording) {
        console.error('Recording is not active')
        return 
    }

    recorder.stop()
}