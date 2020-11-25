import {http_post, http_get, http_put, http_delete} from './senders/sender';
import {stringify} from 'query-string';

export function get_list_products(name) {
    const route = `/products?${stringify({name})}`;
    return http_get(route);
}

export function get_one_product(product_id) {
    const route = `/products/${product_id}`;
    return http_get(route);
}

export function create_product(payload) {
    const route = `/products`;
    return http_post(route, payload);
}

export function update_product(product_id, payload) {
    const route = `/products/${product_id}`;
    return http_put(route, payload);
}

export function delete_product(product_id) {
    const route = `/products/${product_id}`;
    return http_delete(route);
}