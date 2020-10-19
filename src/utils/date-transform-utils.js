import moment from 'moment';

export const VI_DATE_FORMAT = 'DD/MM/YYYY';
export const VI_DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';

export function isValidDate(time_sign, format) {
    return moment(time_sign, format).isValid();
}

export function ISOtoDateValue(ISOString) {
    return moment(ISOString).format(VI_DATE_FORMAT);
}

export function dateValueToISO(value) {
    return moment(value, VI_DATE_FORMAT).toISOString();
}

export function stampToDateValue(timeStamp) {
    return moment(parseInt(timeStamp)).isValid() ? moment(parseInt(timeStamp)).format(VI_DATE_FORMAT) : '';
}

export function dateValueToStamp(value) {
    return moment(value, VI_DATE_FORMAT).valueOf();
}

export function anyTimeStringToDateValue(time_string) {
    return moment(time_string).isValid() ? moment(time_string).format(VI_DATE_FORMAT) : '';
}

export function stampToDateTimeValue(timeStamp) {
    return moment(parseInt(timeStamp)).isValid() ? moment(parseInt(timeStamp)).format(VI_DATE_TIME_FORMAT) : '';
}

export function dateTimeValueToStamp(value) {
    return moment(value, VI_DATE_TIME_FORMAT).valueOf();
}

export function anyTimeStringToDateTimeValue(time_string) {
    return moment(time_string).isValid() ? moment(time_string).format(VI_DATE_TIME_FORMAT) : '';
}