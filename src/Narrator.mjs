export class Narrator {
    constructor() {
        this.voices = window.speechSynthesis.getVoices()
        this.narrator = new SpeechSynthesisUtterance()
        this.narrator.voice = this.voices[0]
        this.narrator.lang = "es-ES"
        this.narrator.rate = 0.9
        this.narrator.pitch = 0.75
    }

    async speak(text) {
        return new Promise(resolve => {
            this.narrator.onend = () => {
                resolve()
            }

            this.narrator.text = text
            window.speechSynthesis.speak(this.narrator)
        })
    }
}