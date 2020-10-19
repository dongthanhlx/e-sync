function to_ms(sec) {
    return 1e3 * parseInt(sec);
}

function to_s(millisec) {
    return Math.round(parseInt(millisec) / 1e3);
}

export {to_ms, to_s};

