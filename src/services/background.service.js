// SERVICES INITIALIZATION
/* We'll create an instance for each service within this background service */

import { PlayService } from "./play.service.js";
import { RecordService } from "./record.service.js";
import { UIService } from "./ui.service.js";

let playService
let recordService
let uiService

chrome.runtime.onInstalled.addListener(async () => {
    playService = new PlayService()
    recordService = new RecordService()
    uiService = new UIService()
})