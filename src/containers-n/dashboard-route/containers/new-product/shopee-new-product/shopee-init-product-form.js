import {SHOPEE_PRODUCT_CONDITION} from '../../../../../constants/shopee-product-condition';
import {SHOPEE_PRODUCT_STATUS} from '../../../../../constants/shopee-product-status';
import {get_shopee_logistics} from '../../../../../api/shopee-logistics';

export function make_shopee_init_product_form() {
    return {
        category_id: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        item_sku: '',

        images: [
            // {
            //     url: '',
            // }
        ],
        draft__attributes: {},
        attributes: [
            // {
            //     attributes_id: 1234,
            //     value: '',
            // }
        ],
        logistics: [
            // {
            //     logistic_id: '',
            //     enabled: true,
            // }
        ],

        weight: '',
        package_length: '',
        package_width: '',
        package_height: '',

        condition: SHOPEE_PRODUCT_CONDITION.new,
        status: SHOPEE_PRODUCT_STATUS.normal,

        wholesales: [
            // {
            //     min: 10,
            //     max: 100,
            //     unit_price: 1000,
            // }
        ],
        size_chart: '',

        is_pre_order: false,
        // days_to_ship: '',

        tier_variation: [
            {name: '', options: []},
        ],
        variation: [
            {
                tier_index: [],
                stock: '',
                price: '',
                variation_sku: ''
            }
        ]
    };
}

export function make_shopee_publish_payload(shopee_product_after_sync) {
    shopee_product_after_sync.attributes = Object.keys(shopee_product_after_sync.draft__attributes).map(attributes_id => ({
        attributes_id: parseInt(attributes_id), 
        value: shopee_product_after_sync.draft__attributes[attributes_id],
    }));

    const shopee_product_payload = JSON.parse(JSON.stringify(shopee_product_after_sync));

    delete shopee_product_payload.draft__attributes;

    return shopee_product_payload;
}

export async function from_db_make_shopee_init_product_form(from_db_shopee_product) {

    const product_form = {...from_db_shopee_product};

    product_form.draft__attributes = {};
    for (let att of from_db_shopee_product.attributes) {
        product_form.draft__attributes[att.attributes_id] = att.value;
    }

    let logistics = [];
    try {
        logistics = await get_shopee_logistics();
    } catch (err) {
        console.error(err);
        logistics = [];
    } finally {
        const product_selected_logistics = {};
        for (let noname_lg of from_db_shopee_product.logistics) {
            product_selected_logistics[noname_lg.logistic_id] = true;
        }
        product_form.logistics = logistics.filter(lg => product_selected_logistics[lg.logistic_id]);
    }

    return product_form;

}