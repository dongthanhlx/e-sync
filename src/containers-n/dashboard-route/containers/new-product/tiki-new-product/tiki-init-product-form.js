import {v4 as uuidv4} from 'uuid';

export function make_tiki_init_product_form() {
    return {
        category_id: '',
        name: '',
        market_price: '',
        description: '',
        image: '',
        images: [],
        attributes: {
            brand: '',
            product_top_features: '',
            product_width: 0,
            product_length: 0,
            product_height: 0,
            product_weight: 0,
            bulky: 1,
        },
        option_attributes: [],
        variants: [
            {
                id: uuidv4(),
                sku: '',
                quantity: '',
                market_price: '',
                price: '',
                option1: '',
                option2: '',
                inventory_type: '',
                supplier: '',
            }
        ],
    }
}

export function make_tiki_publish_payload(tiki_product_after_sync) {
    const tiki_product_payload = JSON.parse(JSON.stringify(tiki_product_after_sync));
    const {variants} = tiki_product_payload;
    for (let va of variants) {
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