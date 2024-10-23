export const ACTION = {
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
        const cursor = document.createElement("div")
        cursor.setAttribute("id", "fake-cursor")
        document.querySelector("#fake-cursor") 
            ? null
            : document.body.appendChild(cursor)

        cursor.style.position = "absolute"
        cursor.style.top = "0"
        cursor.style.left = "0"
        cursor.style.width = "20px"
        cursor.style.height = "20px"
        cursor.style.borderRadius = "100%"
        cursor.style.backgroundColor = "red"
        cursor.style.boxShadow = "0px 5px 10px rgba(0, 0, 0, 0.2)"
        cursor.style.zIndex = "9999"
        cursor.style.transition = "500ms"
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
        const element = document.querySelector(selector)
        const textArray = text.split('')
        for (const char of textArray) {
            element.value += char
            await new Promise(resolve => setTimeout(resolve, writingSpeed))
        }
    }
}

