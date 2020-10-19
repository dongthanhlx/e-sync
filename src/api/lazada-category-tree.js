import {http_get} from './senders/sender';

export function get_lazada_category_tree() {
    const route = `/lazada/category-tree`;
    return http_get(route);
}