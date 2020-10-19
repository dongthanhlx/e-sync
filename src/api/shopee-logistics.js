import {http_get} from './senders/sender';

export function get_shopee_logistics() {
    const route = `/shopee/logistics`;
    return http_get(route);
}