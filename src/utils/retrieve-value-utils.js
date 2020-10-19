export function isNumber(number) {
    return !isNaN(parseInt(number));
};

export function safeRetrieve(object, attribute_path) {
    try {
        if (Array.isArray(attribute_path)) {
            if (attribute_path.length > 0) {
                return attribute_path.reduce((current, next) => current[next], object);
            } else {
                return object;
            }
        } else {
            console.error("Invalid attribute path");
            return '';
        }
    } catch (err) {
        if (process.env.REACT_APP_ENVIRONMENT === 'local') {
            console.error("DON'T WORRY:", err.message);
        }
        return '';
    }
};