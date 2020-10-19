export function arrayToDictionary(array, keyField, valueField) {
    return array.reduce((current, next) => (
        Object.assign(current, {[next[keyField]]: next[valueField]})
    ), {});
};