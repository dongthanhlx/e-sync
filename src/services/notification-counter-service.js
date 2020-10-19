import io from "socket.io-client";
import AuthenService from './authen-service';

const NOTI_BASE_URL = process.env.REACT_APP_NOTI_API_BASE_URL;
const socket = io(NOTI_BASE_URL);
const listeners = {};
let notification_count = 0;

function broadcast() {
    for (let key in listeners) {
        listeners[key]();
    }
};

function connectUserToNotiServerSocket() {
    const userInfo = AuthenService.getUserInfo();
    if (userInfo && userInfo.token) {
        socket.emit('USER_CONNECT', userInfo.token);
    }
};

AuthenService.register('NotificationCounterService', connectUserToNotiServerSocket);

connectUserToNotiServerSocket();

socket.on('PUT_NOTIFICATION_COUNT', (noti_count) => {
    notification_count = noti_count;
    broadcast();
});

export default {
    getNotificationCount() {
        return notification_count;
    },
    register: (key, callback) => {
        listeners[key] = callback;
    },
    unregister: (key) => {
        delete listeners[key];
    }
};
