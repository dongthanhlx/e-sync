const NAME_SPACE = 'REACT_APP_';

export default {
    get: (key) => {
        const realKey = NAME_SPACE + key;
        return process.env[realKey];
    }
};
