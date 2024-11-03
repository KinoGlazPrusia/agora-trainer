export class Messenger {
    send(data, callback = () => null) {
       chrome.runtime.sendMessage(data, (response) => {
            callback(response)
       })
    }
}