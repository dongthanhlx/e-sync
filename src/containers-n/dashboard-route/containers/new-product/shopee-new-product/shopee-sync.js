import {set_value_by_path} from '../../../../../utils/set-object-value-by-path';
import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';

const shopee_sync_map = [
    {
        shopee: ['name'], 
        general: ['name'],
        transformer: gval => gval
    }, {
        shopee: ['price'], 
        general: ['sell_price'],
        transformer: gval => parseFloat(gval),
    }, {
        shopee: ['images'], 
        general: ['images'],
        transformer: images_to_shopee_images,
    }, {
        shopee: ['description'], 
        general: ['draft__description'],
        transformer: editorstate_to_text,
    }, {
        shopee: ['package_width'], 
        general: ['package_width'], 
        transformer: gval => parseInt(gval),
    }, {
        shopee: ['package_length'], 
        general: ['package_length'], 
        transformer: gval => parseInt(gval),
    }, {
        shopee: ['package_height'], 
        general: ['package_height'], 
        transformer: gval => parseInt(gval),
    }, {
        shopee: ['weight'], 
        general: ['package_weight'], 
        transformer: gval => parseFloat(gval),
    }, {
        shopee: ['item_sku'], 
        general: ['seller_sku'], 
        transformer: gval => gval,
    }, {
        shopee: ['stock'], 
        general: ['quantity'], 
        transformer: gval => parseInt(gval),
    }, {
        shopee: ['tier_variation'],
        general: ['variation_attributes'],
        transformer: variation_attributes_to_shopee_tier_variation,
    }, {
        shopee: ['variation'],
        general: ['variation_values'],
        transformer: variation_values_to_shopee_variation,
    }
]

function images_to_shopee_images(general_images) {
    return general_images.filter(url => url).map(url => ({url}));
}

function editorstate_to_text(general_editorstate) {
    return general_editorstate.getCurrentContent().getPlainText('\u000A');
}

function variation_attributes_to_shopee_tier_variation(general_variation_attributes) {
    return general_variation_attributes.map(attribute => ({
        name: attribute.name,
        options: attribute.options,
    }));
}

function variation_values_to_shopee_variation(general_variation_values) {
    return general_variation_values.map(value => ({
        variation_sku: value.seller_sku,
        stock: value.quantity,
        price: value.sell_price,
        tier_index: [...value.options_index],
    }));
}

export function shopee_sync(shopee_product, general_product) {
    let result = Object.assign({}, shopee_product);
    for (let attribute of shopee_sync_map) {
        result = set_value_by_path(
            result, 
            attribute.shopee,
            attribute.transformer(sr(general_product, attribute.general))
        );
    }
    return result;
}