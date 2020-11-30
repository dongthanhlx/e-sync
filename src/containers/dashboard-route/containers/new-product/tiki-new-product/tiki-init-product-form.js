import {v4 as uuidv4} from 'uuid';

export function make_tiki_init_product_form() {
    return {
        category_id: '',
        name: '',
        description: '',
        market_price: '',
        attributes: {
            bulky: 1,
            product_top_features: '',
            brand: '',
            product_width: 0,
            product_length: 0,
            product_height: 0,
            product_weight_kg: 0,
        },
        image: '',
        images: [],
        option_attributes: [],
        variants: [
            {
                id: uuidv4(),
                sku: '',
                price: '',
                quantity: '',
                market_price: '',
                option1: '',
                option2: '',
                inventory_type: '',
                supplier: '',
                brand_origin: '',
                image: '',
                images: [],
            }
        ],
    }
}

export function make_tiki_publish_payload(tiki_product_after_sync) {
    const tiki_product_payload = JSON.parse(JSON.stringify(tiki_product_after_sync));
    const {variants, attributes} = tiki_product_payload;
    for (let va of variants) {
        va.brand_origin = attributes.brand_origin;
        delete va.id;
    }
    return tiki_product_payload;
}

export function from_db_make_tiki_init_product_form(from_db_tiki_product, general_product) {
    const {variation_values}  = general_product;
    const variation_ids = variation_values.map(val => val.id);
    const tiki_product_form = {...from_db_tiki_product};
    tiki_product_form.variants.forEach((variant, index) => {
        variant.id = variation_ids[index];
    });
    return tiki_product_form;
}