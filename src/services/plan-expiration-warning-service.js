import storage_service from './storage-service';
import {getBillingInformation} from '../api/billing-settings-api';
import AuthenService from '../services/authen-service';
import {MS_PER_DAY} from '../utils/datetime-utils';

const listeners = {};
let expired_date = Infinity;

function register(key, callback) {
    if (typeof callback === 'function') {
        listeners[key] = callback;
    } else {
        console.error('Callback must be a function');
    }
}

function unregister(key) {
    delete listeners[key];
}

function broadcast() {
    for (let key in listeners) {
        listeners[key]();
    }
}

function is_show_warning() {
    const expire_time = parseInt(expired_date);
    const now = Date.now();
    const _7DAYS = 7 * MS_PER_DAY;
    const dismissed = storage_service.get('plan_expiration_warning_dismissed');
    return (expire_time - now > 0 && expire_time - now < _7DAYS) && !dismissed;
}

function remaining_days() {
    const expire_time = parseInt(expired_date);
    const now = Date.now();
    return Math.ceil((expire_time - now) / MS_PER_DAY);
}

function dismiss() {
    storage_service.set('plan_expiration_warning_dismissed', true);
    broadcast();
}

function load_plan_data() {
    if (AuthenService.getUserInfo()) {
        getBillingInformation().then(data => {
            expired_date = data.user.expired_date;
            broadcast();
        }, err => {
            console.error(err);
        });
    } else {
        expired_date = Infinity;
        broadcast();
    }
}

export default {register, unregister, is_show_warning, dismiss, load_plan_data, remaining_days};