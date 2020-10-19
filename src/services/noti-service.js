import {toString} from "../utils/tostring-utils";

let toast = null;
let sleep = false;
let awake_noti = null;

const toast_config = {
    closeButton: true,
    showAnimation: 'animated fadeIn',
    hideAnimation: 'animated fadeOut',
};

export function setToast(toastElement) {
    toast = toastElement;
}

export function noti(type, message) {
    const _type = {success: 'success', info: 'info', warning: 'warning', error: 'error'}[type] || 'success';
    const msg = toString(message);
    if (toast && !sleep) {
        toast[_type](msg, null, toast_config);
    }
}

export function sleepNoti(sleep_time = 1000) {
    sleep = true;
    if (awake_noti) clearTimeout(awake_noti);
    awake_noti = setTimeout(() => {
        sleep = false;
        awake_noti = null;
    }, sleep_time);
}
