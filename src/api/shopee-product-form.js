import {http_get} from './senders/sender';

export function get_shopee_product_form(category_id) {
    const route = `/shopee/product-form/${category_id}`;
    return http_get(route);
}