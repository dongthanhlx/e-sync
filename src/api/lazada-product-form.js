import {http_get} from './senders/sender';

export function get_lazada_product_form(category_id) {
    const route = `/lazada/product-form/${category_id}`;
    return http_get(route);
}