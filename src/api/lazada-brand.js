import {stringify} from 'query-string';
import {http_get} from './senders/sender';

export function get_lazada_brands(name) {
    const route = `/lazada/brands?${stringify({name})}`;
    return http_get(route);
}