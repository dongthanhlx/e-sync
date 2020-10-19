import {toString} from "./tostring-utils";
import {isNumber} from "./retrieve-value-utils";

export function toLocaleFormattedString(any_number) {
    const number_string = toString(any_number).replace(/[^0-9e.-]/g, '');
    const number = parseFloat(number_string);
    return isNumber(number) ? number.toLocaleString("vi-VN") : '';
}

export function toNaturalFormattedString(natural_number) {
    return toString(natural_number)
        .replace(/\D+/g, '')
        .replace(/([0-9]{3})*$/g, (match) => (
            match.replace(/[0-9]{3}/g, (three_digits) => `.${three_digits}`)
        ))
        .replace(/^\./, '');
}

export function toNaturalNumberString(natural_formatted) {
    const number_string = natural_formatted.replace(/\./g, '').replace(/,/, '.');
    return number_string || '';
}