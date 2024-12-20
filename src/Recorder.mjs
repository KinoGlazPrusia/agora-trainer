import { Narrator } from "./Narrator.mjs"
import { Messenger } from "./Messenger.mjs"
import { Message } from "./Message.mjs"
import { Context } from "./Context.mjs"

import { getCurrentTabId } from "./utils/tabs.utils.js"
import { initializeOffscreen } from "./utils/offscreen.utils.js"

export class Recorder {
    constructor(controller) {
        this.controller = controller

        this.isRecording = false

        this.recorder = null
        this.config = {}
        this.data = []

        this.narrator = new Narrator()
    }

    async start(streamId, filename) {
        console.log("RECORDER: Starting recording...")

        const combinedMedia = await this.setupCombinedMediaStream(streamId)
        this.recorder = new MediaRecorder(combinedMedia, {mimeType: `video/${this.config.format}`})
        
        this.recorder.ondataavailable = (event) => {
            this.data.push(event.data)
            this.controller.syncState()
        }

        this.recorder.onstop = () => {
            const blob = new Blob(this.data, {type: `video/${this.config.format}`})
            const url = URL.createObjectURL(blob)
    
            // Download the recorded video
            this.downloadVideo(url, filename, this.config.format)
    
            // Open a new tab with the recorded video
            this.previewVideo(url)

            this.recorder.stop()
    
            // Reset the recorder and data array
            this.recorder = undefined
            this.data = []
            this.controller.syncState()
        }

        this.recorder.start()
    }

    async stop() {
        this.recorder.stop()
        this.recorder.stream.getTracks().forEach(track => track.stop())
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

    async setupCombinedMediaStream(streamId) {
        // Video
        const mediaStream = await navigator.mediaDevices.getUserMedia({
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
                    minWidth: this.config.resolution.width,
                    maxWidth: this.config.resolution.width,
                    minHeight: this.config.resolution.height,
                    maxHeight: this.config.resolution.height,
                    frameRate: this.config.fps
                }
            }
        })

        // Audio (Speech)
        const speechContext = new AudioContext()
        const speechDestination = speechContext.createMediaStreamDestination()
        /* const speechSource = speechContext.createMediaElementSource(this.narrator.narrator)
        speechSource.connect(speechDestination) */

        const oscillator = speechContext.createOscillator()
        oscillator.connect(speechDestination)
        oscillator.start()

        //speechDestination.connect(speechContext.destination)

        // Combined stream
        const combinedStream = new MediaStream()

        // Add video track
        mediaStream.getVideoTracks().forEach(track => {
            combinedStream.addTrack(track)
        })

        // Add audio track
        /* mediaStream.getAudioTracks().forEach(track => {
            combinedStream.addTrack(track)
        }) */

        // Add audio track
        speechDestination.stream.getAudioTracks().forEach(track => {
            combinedStream.addTrack(track)
        })

        return mediaStream
    }
}