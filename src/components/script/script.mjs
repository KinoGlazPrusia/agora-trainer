import { PlainComponent, PlainState } from "../../../node_modules/plain-reactive/src/index.js"
import { Player } from "../../Player.mjs"
import { ACTION } from "../../Action.mjs"

class Script extends PlainComponent {
    constructor() {
        super('script-component', '../src/components/script/script.css')

        this.player = new Player()
        this.STATUS = {
            IS_INACTIVE: -1,
            IS_PLAYING: 0,
            IS_PAUSED: 1,
            IS_RECORDING: 2
        }
        
        this.status = new PlainState(this.STATUS.IS_INACTIVE, this)
        this.currentStep = new PlainState(0, this)
        this.script = new PlainState({
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
        }, this)

    }

    template() {
        return `
            <!-- SCRIPT INFO -->
            <div class="script-info">
                <span class="script-title">Registrar curso</span>
                <span class="script-description">Brief description of what this script does.</span>
            </div>

            <!-- SCRIPT ACTIONS -->
            <div class="script-actions">
                <button class="script-play-button ${this.status.getState() === this.STATUS.IS_PLAYING ? 'active' : ''}">
                    <span class="play-icon material-symbols-outlined">play_circle</span>
                </button>
                <button class="script-stop-button ${this.status.getState() === this.STATUS.IS_PAUSED ? 'active' : ''}">
                    <span class="stop-icon material-symbols-outlined">stop_circle</span>
                </button>
                <button class="script-record-button ${this.status.getState() === this.STATUS.IS_RECORDING ? 'active' : ''}">
                    <span class="record-icon material-symbols-outlined">screen_record</span>
                </button>
            </div>

            <!-- SCRIPT PROGRESS -->
            <div class="script-progress-track">
                <div class="script-progress-thumb"></div>
            </div>
        `
    }

    listeners() {
        this.$('.script-play-button').onclick = () => this.handlePlay()
        this.$('.script-stop-button').onclick = () => this.handleStop()
        this.$('.script-record-button').onclick = () => this.handleRecord()
    }

    handlePlay() {
        this.status.setState(this.STATUS.IS_PLAYING)
        this.player.play(this.script.getState(), this.currentStep.getState(), this)
    }

    handleStop() {
        this.status.setState(this.STATUS.IS_PAUSED)
        this.player.stop()
    }

    handleRecord() {
        this.status.setState(this.STATUS.IS_RECORDING)
    }

    setCurrentStep(index) {
        this.currentStep.setState(index, false)
     
        if (this.currentStep.getState() >= this.script.getState().steps.length) {
            this.reset()
            return
        }

        this.updateProgressBar()
    }

    updateProgressBar() {
        const progress = this.currentStep.getState() / this.script.getState().steps.length * 100
        const translation = Math.round(-100 + progress)
        this.$('.script-progress-thumb').style.transform = `translateY(${translation}%)`
    }

    reset() {
        this.currentStep.setState(0, false)
        this.status.setState(this.STATUS.IS_INACTIVE)
    }
}

export default window.customElements.define("script-component", Script)
