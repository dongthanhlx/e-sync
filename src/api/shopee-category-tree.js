import {http_get} from './senders/sender';

export function get_shopee_category_tree() {
    const route = `/shopee/category-tree`;
    return http_get(route);
}