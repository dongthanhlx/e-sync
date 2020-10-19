import {http_get} from './senders/sender';

export function get_tiki_category_tree() {
    const route = `/tiki/category-tree`;
    return http_get(route);
}