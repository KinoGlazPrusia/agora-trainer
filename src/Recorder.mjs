import { Messenger } from "./Messenger.mjs"
import { Message } from "./Message.mjs"
import { Context } from "./Context.mjs"
import { getCurrentTabId } from "./utils/tabs.utils.js"

export class Recorder {
    constructor() {
        this.messenger = new Messenger()
        this.recording = null
        this.recorder = null
        this.data = []
    }

    async setup(filename) {
        // Initialize offscreen document
        const contexts = await chrome.runtime.getContexts({})
        const offscreen = contexts.find(c => {
            c.contextType === 'OFFSCREEN_DOCUMENT'
        })

        if (!offscreen) await this.initializeOffscreen()
        else this.recording = offscreen.documentUrl.endsWith('#recording')

        // Initialize recording
        const tabId = await getCurrentTabId()
        const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tabId })

        // Send message to offscreen document 
        // We have to execute this in another context to avoid cancelling the recording
        // if the popup is closed
        this.messenger.send({
            message: Message.START_RECORDING, 
            target: Context.OFFSCREEN_DOCUMENT, 
            data: streamId,
            filename: filename
        }, () => null)

        return streamId
    }

    async start(streamId, filename) {
        let resolution = {height: 1080, width: 1920}
        let format = 'mp4';

        if (this.recorder?.state === 'recording') {
            throw new Error('Recording already in progress');
        }
    
        const media = await navigator.mediaDevices.getUserMedia({
            audio: {
                mandatory: {
                    chromeMediaSource: 'tab',
                    chromeMediaSourceId: streamId
                }
            },
            video: {
                mandatory: {
                    chromeMediaSource: 'tab',
                    chromeMediaSourceId: streamId,
                    minWidth: resolution.width,
                    maxWidth: resolution.width,
                    minHeight: resolution.height,
                    maxHeight: resolution.height,
                    frameRate: 60
                }
            }
        })
    
        // Audio Setup (esto funciona)
        const output = new AudioContext()
        const source = output.createMediaStreamSource(media)
        source.connect(output.destination)
    
        // Start recording
        this.recorder = new MediaRecorder(media, {mimeType: `video/${format}`})
        this.recorder.ondataavailable = (event) => this.data.push(event.data)
        this.recorder.onstop = () => {
            const blob = new Blob(this.data, {type: `video/${format}`})
            const url = URL.createObjectURL(blob)
    
            // Download the recorded video
            this.downloadVideo(url, filename, format)
    
            // Open a new tab with the recorded video
            this.previewVideo(url)
    
            // Reset the recorder and data array
            this.recorder = undefined
            this.data = []
        }
    
        this.recorder.start()
        window.location.hash = 'recording'
    
        setTimeout(() => this.stop(), 10000)
    }

    async stop() {
        this.recorder.stop()
        this.recorder.stream.getTracks().forEach(track => track.stop())
        window.location.hash = ''
    }

    async initializeOffscreen() {
        await chrome.offscreen.createDocument({
            url: 'public/offscreens/mediaRecorder/offscreen.html',
            reasons: ['USER_MEDIA'],
            justification: 'Recording from chrome.tabCapture API'
        })
    }

    downloadVideo(url, filename, format) {
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }
    
    previewVideo(url) {
        window.open(url, '_blank')
    }
}