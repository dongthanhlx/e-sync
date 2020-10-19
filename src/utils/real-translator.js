import {t} from '../services/i18n-service';

function merge(strs, vars) {
    const length = strs.length + vars.length;
    let str_i = 0;
    let var_i = 0;
    let is_str = true;
    const result = [];
    for (let i = 0; i < length; ++i) {
        if (is_str) {
            result.push(strs[str_i]);
            ++str_i;
        } else {
            result.push(vars[var_i]);
            ++var_i;
        }
        is_str = !is_str;
    }
    return result;
}

function parse_and_pump(description, datapool) {
    if (typeof description === 'string') {
        const var_regex = /\{[^{}]+\}/g;
        const vars = (description.match(var_regex) || []).map(vr => datapool[vr.slice(1, -1)]);
        const strs = (description.split(var_regex) || []).map(str => t(str));
        return merge(strs, vars).join('');
    } else {
        return '';
    }
}

function realt(real) {
    return parse_and_pump(real.description, real);
}

export {realt, parse_and_pump};