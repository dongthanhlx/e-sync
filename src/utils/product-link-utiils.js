export function produceLazadaProductLink(product_link) {
    return product_link
        ? product_link.replace(/^(\/\/w)/, 'https://w')
        : '#!';
}