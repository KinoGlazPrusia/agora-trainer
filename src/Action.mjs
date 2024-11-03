export const Action = {
    WAIT_DOM_CONTENT_LOADED: async () => {
        return new Promise(resolve => {
            if (document.readyState === "complete") {
                console.log("DOMContentLoaded")
                resolve()
            } else {
                document.addEventListener("DOMContentLoaded", () => {
                    console.log("DOMContentLoaded")
                    resolve()
                })
            }
        })
    },

    SETUP_CURSOR: async () => {
        console.log("Setting up cursor...")
        const cursor = document.createElement("div")
        cursor.setAttribute("id", "fake-cursor")
        cursor.innerHTML = `
            <style>
                @keyframes fadein {
                    0% { opacity: 0 }
                    100% {  opacity: 1}
                }

                @keyframes fadeout {
                    0% { opacity: 1 }
                    100% { opacity: 0 }
                }

                @keyframes glow {
                    0% { background-color: yellowgreen }
                    100% { background-color: cyan }
                }
            </style>
            <div class="center">
            </div>
        `

        const center = cursor.querySelector('.center')

        document.querySelector("#fake-cursor") 
            ? null
            : document.body.appendChild(cursor)

        cursor.style.position = "absolute"
        cursor.style.top = "0"
        cursor.style.left = "0"
        cursor.style.width = "50px"
        cursor.style.height = "50px"
        cursor.style.display = 'grid'
        cursor.style.placeContent = 'center'
        cursor.style.borderRadius = "100%"
        cursor.style.backgroundColor = "rgba(71, 128, 214, 0.2)"
        cursor.style.backdropFilter = 'blur(0.5px)'
        cursor.style.zIndex = "9999"
        cursor.style.transition = "500ms"
        cursor.style.animation = 'fadein 1s normal ease-in'

        center.style.width = '10px'
        center.style.height = '10px'
        center.style.borderRadius = "100%"
        center.style.backgroundColor = 'yellowgreen'
        center.style.zIndex = "99999"
        center.style.transition = "500ms"
        center.style.boxShadow = '0px 5px 10px rgba(0, 0, 0, 0.2)'
        center.style.animation = 'glow 4s ease-in-out infinite alternate'
    },

    REMOVE_CURSOR: async () => {
        console.log("Removing cursor...")
        const cursor = document.querySelector("#fake-cursor")
        // Insert a fadeout animation (500ms) 
        cursor.style.animation = 'fadeout 1s normal ease-in'
        setTimeout(() => cursor.remove(), 1000)
    },

    WAIT: async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    },

    MOVE_CURSOR_TO: async (selector) => {
        // It could use another param called speed, which will modify the cursor.style.transition
        const cursor = document.querySelector("#fake-cursor")
        const element = document.querySelector(selector)

        console.log("Moving the cursor to:", element)


        const cursorRect = cursor.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()
        
        const targetPos = {
            x: elementRect.top + (elementRect.height / 2),
            y: elementRect.left + (elementRect.width / 2)
        }

        cursor.style.transform = `translate(calc(${targetPos.y}px - 50%), calc(${targetPos.x}px - 50%))`
    },

    CLICK_ON: async (selector) => {
        const element = document.querySelector(selector)
        console.log("Clicking on:", element)
        element.click()
    },

    FOCUS_INPUT: async (selector) => {
        const element = document.querySelector(selector)
        console.log("Focusing on:", element)
        element.focus()
    },

    WRITE_ON_TEXT_INPUT: async (selector, text, writingSpeed = 100) => {
        /* return new Promise(async resolve => {
            const element = document.querySelector(selector)
            console.log("Writing on:", element)
            const textArray = text.split('')
            for (const char of textArray) {
                element.value += char
                await new Promise(resolve => setTimeout(resolve, writingSpeed))
            }
            resolve()
        }) */
        const element = document.querySelector(selector)
        const textArray = text.split('')
        console.log("Writing on:", element)
        for (const char of textArray) {
            element.value += char
            await new Promise(resolve => setTimeout(resolve, writingSpeed))
        }
    },

    OPEN_POPUP: '',
    CLOSE_POPUP: '',
}

