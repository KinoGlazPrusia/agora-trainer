import { Recorder } from "../../../src/Recorder.mjs";
import { Message } from "../../../src/Message.mjs";
import { Context } from "../../../src/Context.mjs";

chrome.runtime.onMessage.addListener(async (request) => {
    console.log('Received message', request)
    if (request.target === Context.OFFSCREEN_DOCUMENT) {
        switch (request.message) {

            case Message.START_RECORDING:
                await handleRecord(request)
                break;
        }
    }
})

async function handleRecord(request) {
    const recorder = new Recorder()
    recorder.start(request.data, request.filename)
}