export async function initializeOffscreen(url, reasons, justification) {
    await chrome.offscreen.createDocument({
        url: url,
        reasons: reasons,
        justification: justification
    })
}

export async function destroyOffscreen() {
    await chrome.offscreen.closeDocument()
}