export class Narrator {
    constructor(audioContext = null, destination = null) {
        this.voices = window.speechSynthesis.getVoices()
        this.narrator = new SpeechSynthesisUtterance()
        this.narrator.voice = this.voices[0]
        this.narrator.lang = "es-ES"
        this.narrator.rate = 0.9
        this.narrator.pitch = 0.75
        this.audioContext = audioContext
        this.destination = destination
    }

    async speak(text) {
        return new Promise(resolve => {
            this.narrator.onend = () => {
                resolve()
            }

            // Just for recording purposes
            if (this.audioContext && this.destination) {
                const mediaStreamSource = this.audioContext.createMediaStreamSource(this.narrator.stream)
                mediaStreamSource.connect(this.destination)
            }

            this.narrator.text = text
            window.speechSynthesis.speak(this.narrator)
        })
    }
}