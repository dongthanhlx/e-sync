import moment from 'moment';

export const MONTH_NAME = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const MS_PER_DAY = 86400000;

export function getMidnightStamp(date = new Date()) {
    return moment(date.getTime()).startOf('day').valueOf();
}

export function getDayMonthString(timestamp, separator = '/') {
    const date = new Date(parseInt(timestamp));
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}${separator}${month}`;
}

export function getDayMonthYearString(timestamp, separator = '/') {
    const momentTime = moment(parseInt(timestamp));
    return momentTime.isValid()
        ? momentTime.format(`DD${separator}MM${separator}YYYY`)
        : '';
}

export function getYearMonthDayString(timestamp, separator = '/') {
    const date = new Date(parseInt(timestamp));
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}${separator}${(month < 10) ? `0${month}` : month}${separator}${(day < 10) ? `0${day}` : day}`;
}

export function getNotificationTimeString(timestamp) {
    const momentTime = moment(parseInt(timestamp));
    return momentTime.isValid()
        ? momentTime.format('DD/MM/YYYY, h:mm a')
        : '';
}

export function getDMYHMString(timestamp, separator = '/') {
    const momentTime = moment(parseInt(timestamp));
    return momentTime.isValid()
        ? momentTime.format(`DD${separator}MM${separator}YYYY HH:mm`)
        : '';
}

