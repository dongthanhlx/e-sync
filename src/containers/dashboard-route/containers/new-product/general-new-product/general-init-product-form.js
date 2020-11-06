import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';
import {v4 as uuidv4} from 'uuid';

export function make_general_init_product_form() {
    return {
        name: '',
        brand: '',
        original_price: '',
        sell_price: '',
        images: [],
        short_description: '',
        description: '',
        html_short_description: '',
        html_description: '',
        package_width: '',
        package_length: '',
        package_height: '',
        package_weight: '',
        seller_sku: '',
        quantity: '',

        variation_attributes: [
            {name: '', options: []},
            {name: '', options: []},
        ],
        variation_values: [
            {
                id: uuidv4(), 
                seller_sku: '', 
                quantity: '', 
                original_price: '', 
                sell_price: '', 
                options_index: []
            },
        ]
    }
}

export function make_empty_variation_value() {
    return {id: uuidv4(), seller_sku: '', quantity: '', original_price: '', sell_price: '', options_index: []};
}

export function make_general_publish_payload(general_product_after_sync) {
    general_product_after_sync.description = JSON.stringify(general_product_after_sync.description);
    general_product_after_sync.short_description = general_product_after_sync.short_description;
    // const general_product_payload = JSON.parse(JSON.stringify(general_product_after_sync));
    const general_product_payload = general_product_after_sync;
    // const general_product_payload = general_product_after_sync;

    // delete general_product_payload.html_description;
    // delete general_product_payload.html_short_description;

    return general_product_payload;
}

export function from_db_make_general_init_product_form(from_db_general_product) {
    return {
        name: sr(from_db_general_product, ['name']),
        brand: sr(from_db_general_product, ['brand']),
        original_price: sr(from_db_general_product, ['original_price']),
        sell_price: sr(from_db_general_product, ['sell_price']),
        images: sr(from_db_general_product, ['images']),
        // short_description: JSON.parse(sr(from_db_general_product, ['short_description'])),
        // description: JSON.parse(sr(from_db_general_product, ['description'])),
        short_description: sr(from_db_general_product, ['short_description']),
        description: sr(from_db_general_product, ['description']) ? JSON.parse(sr(from_db_general_product, ['description'])): null,
        html_short_description: sr(from_db_general_product, ['html_short_description']),
        html_description: sr(from_db_general_product, ['html_description']),
        package_width: sr(from_db_general_product, ['package_width']),
        package_length: sr(from_db_general_product, ['package_length']),
        package_height: sr(from_db_general_product, ['package_height']),
        package_weight: sr(from_db_general_product, ['package_weight']),
        seller_sku: sr(from_db_general_product, ['seller_sku']),
        quantity: sr(from_db_general_product, ['quantity']),

        variation_attributes: sr(from_db_general_product, ['variation_attributes']),
        variation_values: sr(from_db_general_product, ['variation_values']),
    }
}