import StorageService from './storage-service';
let listeners = {};

function broadcast() {
    for (let key in listeners) {
        listeners[key]();
    }
}

function register(key, callback) {
    listeners[key] = callback;
}

function unregister(key) {
    delete listeners[key];
}

function setInitialColumnsConfig(config_register_name, config) {
    if (!getColumnsConfig(config_register_name)) {
        setColumnsConfig(config_register_name, config);
    }
}

function setColumnsConfig(config_register_name, config) {
    StorageService.set(config_register_name, config);
    broadcast();
}

function getColumnsConfig(config_register_name) {
    return StorageService.get(config_register_name);
}

function deleteColumnsConfig(config_register_name) {
    StorageService.clear(config_register_name);
    broadcast();
}

export default {register, unregister, setInitialColumnsConfig, setColumnsConfig, getColumnsConfig, deleteColumnsConfig};