import {toString} from "./tostring-utils";

export function getDateStringOfOrder(created_at) {
    return toString(created_at).split(' ').slice(0, 2).join(' ');
}