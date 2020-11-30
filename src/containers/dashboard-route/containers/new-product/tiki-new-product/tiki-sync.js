import {set_value_by_path} from '../../../../../utils/set-object-value-by-path';
import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';

const tiki_sync_map = [
    {
        tiki: ['name'], 
        general: ['name'],
        transformer: gval => gval
    }, {
        tiki: ['attributes', 'brand'], 
        general: ['brand'],
        transformer: gval => gval
    }, {
        tiki: ['market_price'], 
        general: ['original_price'],
        transformer: gval => gval
    }, {
        tiki: ['images'], 
        general: ['images'],
        transformer: gval => gval.filter(url => url).slice(1)
    }, {
        tiki: ['image'], 
        general: ['images'],
        transformer: gval => gval.filter(url => url)[0]
    }, {
        tiki: ['attributes', 'product_top_features'], 
        general: ['html__short_description'],
        transformer: gval => gval,
    }, {
        tiki: ['description'], 
        general: ['html__description'],
        transformer: gval => gval,
    }, {
        tiki: ['attributes', 'product_width'], 
        general: ['package_width'], 
        transformer: gval => parseInt(gval)
    }, {
        tiki: ['attributes', 'product_length'], 
        general: ['package_length'], 
        transformer: gval => parseInt(gval)
    }, {
        tiki: ['attributes', 'product_height'], 
        general: ['package_height'], 
        transformer: gval => parseInt(gval)
    }, {
        tiki: ['attributes', 'product_weight_kg'], 
        general: ['package_weight'], 
        transformer: gval => parseFloat(gval)
    }, {
        tiki: ['option_attributes'],
        general: ['variation_attributes'],
        transformer: gval => gval.map(attribute => attribute.name)
    }, {
        tiki: ['variants'],
        general: [],
        transformer: (gval, old_tval) => general_variations_to_tiki_variants(old_tval, gval['variation_values'], gval['variation_attributes'], gval['images'])
    }
]

export function general_variations_to_tiki_variants(tiki_variants, general_variation_values, general_variation_attributes, images) {
    console.log('------- variants ---------')
    console.log(tiki_variants);
    console.log(general_variation_values);
    console.log(general_variation_attributes);
    console.log(images);
    console.log('------- variants ---------')
    const tiki_variants_dict = {};
    const tiki_variants_result = [];
    // let image = images.shift();
    for (let variant of tiki_variants) {
        tiki_variants_dict[variant.id] = variant;
    }
    for (let variation_value of general_variation_values) {
        const tiki_variant_from_general_variation = {
            id: variation_value.id,
            sku: variation_value.seller_sku,
            price: variation_value.sell_price,
            quantity: variation_value.quantity,
            market_price: variation_value.original_price,
            option1: sr(general_variation_attributes, ['0', 'options', sr(variation_value, ['options_index', '0'])]),
            option2: sr(general_variation_attributes, ['1', 'options', sr(variation_value, ['options_index', '1'])]),
            image: images[0],
            images: images.slice(1),
        };
        const tiki_original_variant = tiki_variants_dict[variation_value.id] || {inventory_type: '', supplier: '', brand_origin: ''};
        tiki_variants_result.push({...tiki_original_variant, ...tiki_variant_from_general_variation});
    }
    return tiki_variants_result;
}

export function tiki_sync(tiki_product, general_product) {
    console.log(tiki_product);
    let result = Object.assign({}, tiki_product);
    for (let attribute of tiki_sync_map) {
        const old_tval = sr(tiki_product, attribute.tiki);
        result = set_value_by_path(
            result, 
            attribute.tiki,
            attribute.transformer(sr(general_product, attribute.general), old_tval)
        );
    }
    return result;
}