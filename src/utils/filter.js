export function filter(key = '', data = [], valueGenerator) {
    if (key && key.length > 0) {
        try {
            let keyRegExp = new RegExp(key, 'i');
            return data.filter((element) => {
                if (typeof valueGenerator === 'function') {
                    return keyRegExp.test(valueGenerator(element));
                } else {
                    return keyRegExp.test(element);
                }
            });
        } catch (e) {
            return data;
        }
    } else {
        return data;
    }
};