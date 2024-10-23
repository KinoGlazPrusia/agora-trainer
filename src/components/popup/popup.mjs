import { $ } from "../../utils/helper.mjs"
import { Player } from "../../Player.mjs"

const player = new Player()

document.addEventListener("DOMContentLoaded", () => {
    setupListeners()
})

function setupListeners() {
    const recordButton = $(".record-button")
    recordButton.onclick = () => {
        player.play("script")
    }
}