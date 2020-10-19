// Sometimes, logout button does not work. Even the codes in finally block would not execute
// Seems like due to stupid OneSignal, cannot get the f*cking browser id
// To prevent that issue, this service has given birth
let browserid = null;

export function set_browserid(id) {
    if (typeof id === 'string') {
        browserid = id;
    }
}

export function get_browserid() {
    return browserid;
}

window.get_browserid = get_browserid;