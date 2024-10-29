import { Recorder } from "../../../src/Recorder.mjs";
import { MESSAGE } from "../../../src/Message.mjs";
import { CONTEXT } from "../../../src/Context.mjs";

chrome.runtime.onMessage.addListener(async (request) => {
    console.log('Received message', request)
    if (request.target === CONTEXT.OFFSCREEN_DOCUMENT) {
        switch (request.message) {

            case MESSAGE.START_RECORDING:
                await handleRecord(request)
                break;
        }
    }
})

async function handleRecord(request) {
    const recorder = new Recorder()
    recorder.start(request.data, request.filename)
}