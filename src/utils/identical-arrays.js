export function isIdenticalArrays(arr1, arr2, conditionCallback = null) {
    if (!conditionCallback || typeof conditionCallback !== 'function') {
        console.error('Condition callback must be provided as a function');
        return false;
    } else {
        return arr1.length === arr2.length
            ? arr1.every((arr1_el, i) => conditionCallback(arr1_el, arr2[i]))
            : false;
    }
};