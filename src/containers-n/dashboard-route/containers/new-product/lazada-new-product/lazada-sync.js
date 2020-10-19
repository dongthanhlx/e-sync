import {convertToRaw} from 'draft-js';
import d2html from 'draftjs-to-html';
import {set_value_by_path} from '../../../../../utils/set-object-value-by-path';
import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';
import moment from 'moment';

const lazada_sync_map = [
    {
        lazada: ['Attributes', 'name'], 
        general: ['name'], 
        transformer: gval => gval
    }, {
        lazada: ['Attributes', 'brand'], 
        general: ['brand'], 
        transformer: gval => gval
    }, {
        lazada: ['Attributes', 'short_description'], 
        general: ['draft__short_description'],
        transformer: editorstate_to_html,
    }, {
        lazada: ['Attributes', 'description'], 
        general: ['draft__description'], 
        transformer: editorstate_to_html,
    }, {
        lazada: ['Skus', '0', 'Sku'], 
        general: [], 
        transformer: (gval, old_lval) => general_product_to_lazada_variations(old_lval, gval),
    },
]

function editorstate_to_html(general_editorstate) {
    return d2html(convertToRaw(general_editorstate.getCurrentContent()));
}

export function general_product_to_lazada_variations(lazada_variations, general_product) {
    const {
        variation_values: general_variation_values,
        images,
        package_width,
        package_length,
        package_height,
        package_weight
    } = general_product;

    const lazada_variations_dict = {};
    const lazada_variations_result = [];

    for (let va of lazada_variations) {
        lazada_variations_dict[va.id] = va;
    }

    for (let variation_value of general_variation_values) {
        const lazada_variation_from_general_product = {
            id: variation_value.id,
            SellerSku: variation_value.seller_sku,
            quantity: variation_value.quantity,
            price: variation_value.original_price,
            special_price: variation_value.sell_price,

            package_width,
            package_length,
            package_height,
            package_weight,
            Images: {
                Image: images.filter(url => url)
            }
        };
        const lazada_original_variation = lazada_variations_dict[variation_value.id] || {
            package_content: '',
            special_from_date: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
            special_to_date: moment().startOf('day').add(1, 'month').format('YYYY-MM-DD HH:mm'),
        };
        lazada_variations_result.push({...lazada_original_variation, ...lazada_variation_from_general_product});
    }

    return lazada_variations_result;
}

export function lazada_sync(lazada_product, general_product) {
    let result = Object.assign({}, lazada_product);
    for (let attribute of lazada_sync_map) {
        const old_lval = sr(lazada_product, attribute.lazada);
        result = set_value_by_path(
            result, 
            attribute.lazada,
            attribute.transformer(sr(general_product, attribute.general), old_lval)
        );
    }
    return result;
}