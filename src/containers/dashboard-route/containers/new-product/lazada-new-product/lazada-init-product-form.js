import moment from 'moment';
import {v4 as uuidv4} from 'uuid';

export function make_lazada_init_product_form() {
    return {
        PrimaryCategory: '',    // id của danh mục ngành hàng
        Attributes: {
            name: '',           // tên sản phẩm
            brand: '',          // thương hiệu sản phẩm
            short_description: '',  // nội dung phần mô tả ngắn
            description: '',        // nội dung phần mô tả sản phẩm
        },
        Skus: [{
            Sku: [{
                id: uuidv4(),       // id của biến thể
                SellerSku: '',      // sku của biến thể
                quantity: '',       // số lượng sản phẩm còn lại của biến thể
                price: '',          // giá gốc của biến thể
                special_price: '',  // giá bán của biến thể

                package_content: '',    // nội dung chương trình khuyến mãi
                special_from_date: moment().startOf('day').format('YYYY-MM-DD HH:mm'),                  // ngày bắt đầu khuyến mãi
                special_to_date: moment().startOf('day').add(1, 'month').format('YYYY-MM-DD HH:mm'),    // ngáy kết thúc khuyến mãi

                package_weight: '',     // cân nặng của gói hàng
                package_length: '',     // chiều dài của gói hàng
                package_width: '',      // chiều rộng của gói hàng
                package_height: '',     // chiều cao của gói hàng
                Images: {               // ảnh sản phẩm
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
