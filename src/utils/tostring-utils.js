export function toString(value) {
    if (typeof value === 'string') {
        return value;
    } else {
        return JSON.stringify(value);
    }
};