import { Narrator } from "./Narrator.mjs"
import { ACTION } from "./Action.mjs"

export class Player {
    constructor() {
        this.narrator = new Narrator()
    }

    // This function returns the ID of the active tab.
    async getCurrentTabId() {
        const currentTab = await chrome.tabs.query({active: true, currentWindow: true})
        return currentTab[0].id
    }

    async executeAction(callback, args = []) {
        const tabId = await this.getCurrentTabId()

        await chrome.scripting.executeScript({
            target: { tabId },
            func: callback,
            args: [...args]
        })
    }

    async play(script) {
        // This scripts creation could be automated with user natural input, developing a kind of "script editor" UI.
        const mockScript = {
            "name": "Clicking the button",
            "steps": [
                {
                    "action": ACTION.SETUP_CURSOR,
                    "args": [],
                    "delay": 0,
                    "wait": 0,
                    "voiceover": "Bienvenidos a la plataforma Ágora, hoy vamos a aprender cómo crear un curso"
                },
                {
                    "action": ACTION.MOVE_CURSOR_TO,
                    "args": ["#content-menu-button"],
                    "delay": 500,
                    "wait": 500, // Here we'll have a constant called PARAMS.WAIT_UNTIL_VOICEOVER_FINISH = -1
                    "voiceover": "Movemos el cursor a la opción Pages del menú"
                },
                {
                    "action": ACTION.CLICK_ON,
                    "args": ["#content-menu-button"],
                    "delay": 0,
                    "wait": 1500,
                    "voiceover": "Hacemos clic"
                },
                {
                    "action": ACTION.MOVE_CURSOR_TO,
                    "args": ["#content-menu .dropdown-menu:nth-child(2)"],
                    "delay": 0,
                    "wait": 1000,
                    "voiceover": "Movemos el cursor a la opción Manage Pages"
                },
                {
                    "action": ACTION.MOVE_CURSOR_TO,
                    "args": ["#content-menu-button"],
                    "delay": 0,
                    "wait": 500,
                    "voiceover": ""
                },
                {
                    "action": ACTION.CLICK_ON,
                    "args": ["#content-menu-button"],
                    "delay": 0,
                    "wait": 500,
                    "voiceover": "Volvemos a hacer clic sobre la opción Pages del menú para cerrar el desplegable" 
                },
                {
                    "action": ACTION.MOVE_CURSOR_TO,
                    "args": ["#s_list_elements-search-query"],
                    "delay": 0,
                    "wait": 500,
                    "voiceover": "Movemos el cursor a la barra de búsqueda"
                },
                {
                    "action": ACTION.WRITE_ON_TEXT_INPUT,
                    "args": ["#s_list_elements-search-query", "Esto es una breve demostración..."],
                    "delay": 500,
                    "wait": 1500,
                    "voiceover": "Escribimos en la barra de búsqueda. Es broma, esto solo era un test. Vamos a crear el curso"
                },
                {
                    "action": ACTION.MOVE_CURSOR_TO,
                    "args": [".dropdown-toggle.full"],
                    "delay": 0,
                    "wait": 500,
                    "voiceover": "Movemos de nuevo el cursor a la opción Website en la parte superior izquierda"
                },
                {
                    "action": ACTION.CLICK_ON,
                    "args": [".dropdown-toggle.full"],
                    "delay": 0,
                    "wait": 500,
                    "voiceover": "Clicamos"
                },
                {
                    "action": ACTION.MOVE_CURSOR_TO,
                    "args": ['.dropdown-item[data-action-id="288"]'],
                    "delay": 0,
                    "wait": 500,
                    "voiceover": "Seleccionamos la opción Student Catalogues y clicamos sobre ella"
                },
                {
                    "action": ACTION.CLICK_ON,
                    "args": ['.dropdown-item[data-action-id="288"]'],
                    "delay": 500,
                    "wait": 500,
                    "voiceover": "Esto nos llevará a la página de cursos"
                },
                {
                    "action": ACTION.SETUP_CURSOR,
                    "args": [],
                    "delay": 0,
                    "wait": 1500,
                    "voiceover": ""
                },
                {
                    "action": ACTION.MOVE_CURSOR_TO,
                    "args": ['.btn.btn-primary.o_list_button_add'],
                    "delay": 0,
                    "wait": 500,
                    "voiceover": "Clicamos sobre el botón de crear"
                },
                {
                    "action": ACTION.CLICK_ON,
                    "args": ['.btn.btn-primary.o_list_button_add'],
                    "delay": 0,
                    "wait": 500,
                    "voiceover": "Esto nos desplegará un formulario para crear un nuevo curso"
                },
                {
                    "action": ACTION.MOVE_CURSOR_TO,
                    "args": ['.oe_title input'],
                    "delay": 0,
                    "wait": 500,
                    "voiceover": "Escribimos el nombre del curso aquí"
                },
                {
                    "action": ACTION.WRITE_ON_TEXT_INPUT,
                    "args": ['.oe_title input', "Curs de prova"],
                    "delay": 500,
                    "wait": 1500,
                    "voiceover": ""
                },
                {
                    "action": ACTION.MOVE_CURSOR_TO,
                    "args": ['#o_field_input_15'],
                    "delay": 0,
                    "wait": 500,
                    "voiceover": "A continuación escribimos la descripción del curso"
                },
                {
                    "action": ACTION.WRITE_ON_TEXT_INPUT,
                    "args": ['#o_field_input_15', "Descripció breu del curs enregistrat..."],
                    "delay": 500,
                    "wait": 1500,
                    "voiceover": ""
                },
                {
                    "action": ACTION.MOVE_CURSOR_TO,
                    "args": ['#o_field_input_16'],
                    "delay": 0,
                    "wait": 500,
                    "voiceover": "Seleccionamos a la persona de contacto del curso"
                },
                {
                    "action": ACTION.CLICK_ON,
                    "args": ['#o_field_input_16'],
                    "delay": 0,
                    "wait": 500,
                    "voiceover": ""
                },
                {
                    "action": ACTION.MOVE_CURSOR_TO,
                    "args": ['#ui-id-9'],
                    "delay": 0,
                    "wait": 500,
                    "voiceover": ""
                },
                {
                    "action": ACTION.CLICK_ON,
                    "args": ['#ui-id-9'],
                    "delay": 500,
                    "wait": 500,
                    "voiceover": ""
                },
                {
                    "action": ACTION.MOVE_CURSOR_TO,
                    "args": ['#o_field_input_17'],
                    "delay": 0,
                    "wait": 500,
                    "voiceover": "Escribimos el campo de estudio del curso"
                },
                {
                    "action": ACTION.WRITE_ON_TEXT_INPUT,
                    "args": ['#o_field_input_17', "Enginyeria telemàtica"],
                    "delay": 500,
                    "wait": 1500,
                    "voiceover": "Ingeniería telemática"
                },
                {
                    "action": ACTION.MOVE_CURSOR_TO,
                    "args": ['.o_form_button_save'],
                    "delay": 0,
                    "wait": 500,
                    "voiceover": "Le damos al botón de Save para guardar el nuevo curso... Y de momento eso sería todo."
                }
            ]
        }

        const steps = mockScript.steps

        // We're using a 'for' because forEach cannot handle 'awaits'
        for (const {action, args, delay, wait, voiceover} of steps) {
            //console.log("Script started:", voiceover)

            if (delay > 0) {
                await this.executeAction(ACTION.WAIT, [delay])
            }

            //console.log("Delay finished... executing action.")
            let voiceFinished

            if (voiceover.length > 0) {
                voiceFinished = this.narrator.speak(voiceover)
            }

            await this.executeAction(action, args)
            await voiceFinished

            if (wait > 0) {
                await this.executeAction(ACTION.WAIT, [wait])
            }   

            //console.log("Wait finished...")
        }
    }

}