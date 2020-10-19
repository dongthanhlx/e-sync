import {http_get} from './senders/sender';

export function get_tiki_product_form(category_id) {
    const route = `/tiki/product-form/${category_id}`;
    return http_get(route);
}