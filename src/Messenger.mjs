export class Messenger {
    send(data, callback) {
       chrome.runtime.sendMessage(data, (response) => {
            callback(response)
       })
    }
}