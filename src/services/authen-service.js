import storageService from "./storage-service";

let listeners = {};
let userInfo;
try {
    userInfo = JSON.parse(storageService.get('user-info'));
} catch (err) {
    userInfo = null;
}

function broadcast() {
    for (let key in listeners) {
        listeners[key]();
    }
}

export default {
    getUserInfo: () => userInfo,
    setUserInfo: (_userInfo) => {
        userInfo = _userInfo;
        storageService.set('user-info', JSON.stringify(userInfo));
        broadcast();
    },
    logOut: () => {
        storageService.clearAll();
        userInfo = null;
    },
    register: (self, callback) => {
        listeners[self] = callback;
    },
    unregister: (self) => {
        delete listeners[self];
    }
};
