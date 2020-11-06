import moment from 'moment';
import {v4 as uuidv4} from 'uuid';

export function make_lazada_init_product_form() {
    return {
        PrimaryCategory: '',
        Attributes: {
            name: '',
            brand: '',
            short_description: '',
            description: '',
        },
        Skus: [{
            Sku: [{
                id: uuidv4(),
                SellerSku: '',
                quantity: '',
                price: '',
                special_price: '',

                package_content: '',
                special_from_date: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
                special_to_date: moment().startOf('day').add(1, 'month').format('YYYY-MM-DD HH:mm'),

                package_weight: '',
                package_length: '',
                package_width: '',
                package_height: '',
                Images: {
                    Image: []
                }
            }]
        }]
    }
}

export function make_lazada_publish_payload(lazada_product_after_sync) {
    const lazada_product_payload = JSON.parse(JSON.stringify(lazada_product_after_sync));
    // const lazada_product_payload = lazada_product_after_sync;
    const variations = lazada_product_payload.Skus[0].Sku;
    for (let va of variations) {
        delete va.id;
    }
    return lazada_product_payload;
}

export function from_db_make_lazada_init_product_form(from_db_lazada_product, general_product) {
    const {variation_values}  = general_product;
    const variation_ids = variation_values.map(val => val.id);
    const lazada_product_form = {...from_db_lazada_product};
    lazada_product_form.Skus[0].Sku.forEach((variation, index) => {
        variation.id = variation_ids[index];
    });
    return lazada_product_form;
}