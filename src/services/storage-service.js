import store from 'store';

const NAME_SPACE = 'vn.sellpro.';

function get(key) {
    const realKey = NAME_SPACE + key;
    return store.get(realKey);
}

function set(key, data) {
    const realKey = NAME_SPACE + key;
    return store.set(realKey, data);
}

function clear(key) {
    const realKey = NAME_SPACE + key;
    return store.remove(realKey);
}

function clearAllWithException(exception) {
    if (Array.isArray(exception) && exception.length > 0) {
        const backup = exception.map(key => ({key, value: get(key)}));
        clearAll();
        backup.forEach(backup_item => {set(backup_item.key, backup_item.value)});
    } else {
        clearAll();
    }
}

function clearAll() {
    store.clearAll();
}

export default {get, set, clear, clearAllWithException, clearAll};
