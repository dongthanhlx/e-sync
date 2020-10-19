import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FormGroup, Label, Input, Row, Col, Button} from 'reactstrap';
import SelectInput from '../../../../../commons/select-input/select-input';
import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';
import {noti} from '../../../../../services/noti-service';
import {get_lazada_category_tree} from '../../../../../api/lazada-category-tree';
import CategoryFilter from '../../../../../commons/category-filter/category-filter';
import {get_lazada_brands} from '../../../../../api/lazada-brand';
import LazadaInput from '../../../../../commons/lazada-input/lazada-input';
import DatePicker from '../../../../../commons/date-picker/date-picker';
import Dropify from '../../../../../commons/dropify/dropify';
// import {Editor} from 'react-draft-wysiwyg';
import Editor from '../../../../../commons/editor/editor';
import TableWithItemPattern from '../../../../../commons/table-with-item-pattern/table-with-item-pattern';
import VariationValueTableItem from '../general-new-product/variation-value-table-item';
import {make_empty_variation_value} from '../general-new-product/general-init-product-form';
import {upload_static} from '../../../../../api/upload-static';
import moment from 'moment';
import {v4 as uuidv4} from 'uuid';
import ListImage from '../general-new-product/ListImage';
// import $ from 'jquery';
// import 'slick-carousel';
// import 'slick-carousel/slick/slick-theme.css';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/docs.css';
// import star from '../../../../../images/star.webp';
// import heart from '../../../../../images/heart.svg';
// import share from '../../../../../images/share.svg';
// import info from '../../../../../images/info.svg';
// import location from '../../../../../images/location.svg';
// import delivery from '../../../../../images/delivery.svg';
// import pay from '../../../../../images/invoice.svg';

export default class LazadaNewProduct extends Component {

    static make_attribute_path(field, index = 0) {
        switch (field.attribute_type) {
            case "normal":
                return ['Attributes', field.name];
            case "sku":
                return ['Skus', '0', 'Sku', index, field.name];
            default:
                return [];
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            category_tree: [],
            brands: [],
        };

        this.query_brand = null;
        this.handle_html_image_upload = this.handle_html_image_upload.bind(this);
        this.handle_change_form = this.handle_change_form.bind(this);
        this.handle_change_general_form = this.handle_change_general_form.bind(this);
    }

    componentDidMount() {
        this.api_get_lazada_category_tree();
        if (this.props.brand_name) {
            this.api_get_lazada_brands(this.props.brand_name);
        }

        // $('.slider-for').slick({
        //     slidesToShow: 1,
        //     slidesToScroll: 1,
        //     arrows: false,
        //     fade: true,
        //     asNavFor: '.slider-nav'
        // });
        // $('.slider-nav').slick({
        //     slidesToShow: 3,
        //     slidesToScroll: 1,
        //     asNavFor: '.slider-for',
        //     arrows: false,
        //     centerMode: true,
        //     focusOnSelect: true
        // });
    }

    componentDidUpdate(prev_props) {
        if (prev_props.brand_name !== this.props.brand_name) {
            this.api_get_lazada_brands(this.props.brand_name);
        }
    }

    get_variation_table_titles() {
        const {general_product} = this.props;
        const fixed_titles_1 = ['Seller SKU', 'Quantity', 'Original price', 'Sell price']
        const fixed_titles_2 = ['Delete']
        const volatile_titles = [];
        if (sr(general_product, ['variation_attributes', '0', 'name'])) {
            volatile_titles.push(general_product.variation_attributes[0].name);
        }
        if (sr(general_product, ['variation_attributes', '1', 'name'])) {
            volatile_titles.push(general_product.variation_attributes[1].name);
        }
        return fixed_titles_1.concat(volatile_titles).concat(fixed_titles_2);
    }

    async api_get_lazada_category_tree() {
        try {
            const category_tree = await get_lazada_category_tree();
            this.setState({category_tree})
        } catch (err) {
            console.error(err);
            noti('error', err);
        }
    }


    api_get_lazada_brands(brand_name) {
        if (this.query_brand) window.clearTimeout(this.query_brand);
        this.query_brand = window.setTimeout(async () => {
            try {
                const brands = await get_lazada_brands(brand_name);
                this.setState({brands})
                window.clearTimeout(this.query_brand);
            } catch (err) {
                console.error(err);
                noti('error', err);
            }
        }, 500);
    }

    handle_html_image_upload(file) {
        return upload_static(file)
            .then(url => ({data: {link: url}}))
            .catch(err => ({data: {link: '#'}}));
    }

    handle_change_form(path, value) {
        const {product, on_change} = this.props;
        const new_product = Object.assign({}, product);
        let setter = new_product;
        for (let i = 0; i < path.length; i += 1) {
            if (i === path.length - 1) {
                setter[path[i]] = value;
            } else {
                setter[path[i]] = setter[path[i]] || {};
            }
            setter = setter[path[i]]
        }
        on_change(new_product);
    }

    handle_change_general_form(path, value) {
        const {general_product, on_change_general} = this.props;
        const new_product = Object.assign({}, general_product);
        let setter = new_product;
        for (let i = 0; i < path.length; i += 1) {
            if (i === path.length - 1) {
                setter[path[i]] = value;
            } else {
                setter[path[i]] = setter[path[i]] || {};
            }
            setter = setter[path[i]]
        }
        on_change_general(new_product);
    }

    // addSlide(url) {
    //     $('.slider-for').slick('slickAdd', `<div><img src=${url} /></div>`);
    //     $('.slider-nav').slick('slickAdd', `<div><img src=${url} /></div>`);
    // }

    render() {
        const {
            product, additional_fields, editmode, images_key, general_product, 
            editor_remount_key_1, 
            editor_remount_key_2,
        } = this.props;
        const {category_tree, brands} = this.state;
        const normal_fields = additional_fields.filter(f => f.attribute_type === 'normal');
        const sku_fields = additional_fields.filter(f => f.attribute_type === 'sku');
        const variations = product.Skus[0].Sku;
        return (
            
            <div className="lazada-new-product">
            <FormGroup className="mb-5">
                <Label for="lp_category" className="required-field">Category</Label>
                <CategoryFilter
                    className="lazada-category-filter"
                    categories={category_tree}
                    idGen={cat => cat.category_id}
                    nameGen={cat => cat.name}
                    childrenGen={cat => cat.children}
                    onChangeCategory={cat => {this.handle_change_form(['PrimaryCategory'], cat.category_id)}}
                    onAbortCategory={() => {this.handle_change_form(['PrimaryCategory'], '')}}
                />
            </FormGroup>
            {
                Array.isArray(normal_fields) && normal_fields.length > 0
                    ? <div className="mb-5 additional-normal-attributes">
                        {
                            normal_fields.sort((a, b) => parseInt(b.is_mandatory) - parseInt(a.is_mandatory)).map(field => (
                                <FormGroup key={field.name}>
                                    <Label for={`lp_${field.name}`} className={field.is_mandatory ? 'required-field' : ''}>
                                        {field.label}
                                    </Label>
                                    <LazadaInput 
                                        type={field.input_type} 
                                        value={sr(product, LazadaNewProduct.make_attribute_path(field)) || ''} 
                                        on_change={value => {this.handle_change_form(LazadaNewProduct.make_attribute_path(field), value)}} 
                                        options={field.options} 
                                    />
                                </FormGroup>
                            ))
                        }
                    </div>
                    : null
            }
            <div className="mb-5 lazada-variations-table">
                <div className="tr">
                    <div className="th">Seller SKU</div>
                    <div className="th">Variation fields</div>
                </div>
                {
                    variations.map((variation, index) => (
                        <div key={variation.id} className="tr">
                            <div className="td sku-cell">{variation.SellerSku}</div>
                            <div className="td variation-fields-cell">
                                <FormGroup>
                                    <Label for="lp_special_from_date" className="required-field">Special price from date</Label>
                                    <DatePicker 
                                        withTime
                                        value={moment(sr(variation, ['special_from_date'])).valueOf()}
                                        onChange={value => {
                                            this.handle_change_form(
                                                ['Skus', '0', 'Sku', index, 'special_from_date'], 
                                                moment(value).format('YYYY-MM-DD HH:mm')
                                            )
                                        }}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="lp_special_to_date" className="required-field">Special price to date</Label>
                                    <DatePicker 
                                        withTime
                                        value={moment(sr(variation, ['special_to_date'])).valueOf()}
                                        onChange={value => {
                                            this.handle_change_form(
                                                ['Skus', '0', 'Sku', index, 'special_to_date'],
                                                moment(value).format('YYYY-MM-DD HH:mm'))
                                        }}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="lp_package_content" className="required-field">Package content</Label>
                                    <Input 
                                        type="text"
                                        value={sr(variation, ['package_content'])}
                                        onChange={e => {this.handle_change_form(['Skus', '0', 'Sku', index, 'package_content'], e.target.value)}} 
                                    />
                                </FormGroup>
                                {
                                    Array.isArray(sku_fields) && sku_fields.length > 0
                                        ? <>
                                            {
                                                sku_fields.sort((a, b) => parseInt(b.is_mandatory) - parseInt(a.is_mandatory)).map(field => (
                                                    <FormGroup key={field.name}>
                                                        <Label for={`lp_${field.name}`} className={field.is_mandatory ? 'required-field' : ''}>
                                                            {field.label}
                                                        </Label>
                                                        <LazadaInput
                                                            type={field.input_type}
                                                            value={sr(product, LazadaNewProduct.make_attribute_path(field, index)) || ''} 
                                                            on_change={value => {
                                                                this.handle_change_form(LazadaNewProduct.make_attribute_path(field, index), value)
                                                            }} 
                                                            options={field.options} 
                                                        />
                                                    </FormGroup>
                                                ))
                                            }
                                        </>
                                        : null
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            
            <div className="general-new-product">
                <FormGroup>
                    <Label for="gp_name" className="required-field">Product name</Label>
                    <Input 
                        type="text" id="gp_name" 
                        value={sr(general_product, ['name'])}
                        onChange={e => {this.handle_change_general_form(['name'], e.target.value)}} 
                    />
                </FormGroup>
                <FormGroup className="mb-5">
                    <Label for="gp_brand" className="required-field">Brand - Lazada & Tiki</Label>
                    <SelectInput
                        items={brands}
                        itemIdGen={brand => brand.brand_id}
                        itemLabelGen={brand => brand.name}
                        value={sr(general_product, ['brand']) ? (brands.find(b => b.name === general_product.brand) || {}) : {}}
                        onSearchChange={search => {this.api_get_lazada_brands(search)}}
                        onSelect={brand => {this.handle_change_general_form(['brand'], brand.name || '')}}
                        onCancel={() => {this.handle_change_general_form(['brand'], '')}}
                    />
                </FormGroup>
                <div className="attributes-group-0">
                    <FormGroup>
                        <Label for="gp_sellersku" className="required-field">Seller SKU</Label>
                        <Input 
                            type="text" id="gp_sellersku" 
                            value={sr(general_product, ['seller_sku'])}
                            onChange={e => {this.handle_change_general_form(['seller_sku'], e.target.value)}} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_quantity" className="required-field">Quantity</Label>
                        <Input 
                            type="number" id="gp_quantity" 
                            value={sr(general_product, ['quantity'])}
                            onChange={e => {this.handle_change_general_form(['quantity'], e.target.value)}} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_original_price" className="required-field">Original price</Label>
                        <Input 
                            type="number" id="gp_original_price" 
                            value={sr(general_product, ['original_price'])}
                            onChange={e => {this.handle_change_general_form(['original_price'], e.target.value)}}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_sell_price" className="required-field">Sell price (Special price)</Label>
                        <Input 
                            type="number" id="gp_sell_price" 
                            value={sr(general_product, ['sell_price'])}
                            onChange={e => {this.handle_change_general_form(['sell_price'], e.target.value)}} 
                        />
                    </FormGroup>
                </div>
                <div className="mb-5 attributes-group-1">
                    <FormGroup>
                        <Label for="gp_package_width" className="required-field">Package width (cm)</Label>
                        <Input 
                            type="number" id="gp_package_width" 
                            value={sr(general_product, ['package_width'])}
                            onChange={e => {this.handle_change_general_form(['package_width'], e.target.value)}} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_package_length" className="required-field">Package length (cm)</Label>
                        <Input 
                            type="number" id="gp_package_length" 
                            value={sr(general_product, ['package_length'])}
                            onChange={e => {this.handle_change_general_form(['package_length'], e.target.value)}} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_package_height" className="required-field">Package height (cm)</Label>
                        <Input 
                            type="number" id="gp_package_height" 
                            value={sr(general_product, ['package_height'])}
                            onChange={e => {this.handle_change_general_form(['package_height'], e.target.value)}} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_package_weight" className="required-field">Package weight (kg)</Label>
                        <Input 
                            type="number" id="gp_package_weight" 
                            value={sr(general_product, ['package_weight'])}
                            onChange={e => {this.handle_change_general_form(['package_weight'], e.target.value)}} 
                        />
                    </FormGroup>
                </div>
                <FormGroup className="mb-5">
                    <Label for="gp_images" className="required-field">Product images</Label>
                    <div className="form-images" key={images_key}>
                        {
                            ['0', '1', '2', '3', '4'].map(i => (
                                <Dropify key={i}
                                    default_url={sr(general_product, ['images', i])}
                                    on_change_general={url => {this.handle_change_general_form(['images', i], url)}} 
                                    on_removed={() => {this.handle_change_general_form(['images', i], '')}} 
                                />
                            ))
                        }
                    </div>
                </FormGroup>
                <FormGroup id='test'>
                    <Label for="gp_short_description" className="required-field">
                        Short Description
                    </Label>
                    <Editor
                        key={editor_remount_key_1}
                        design={sr(general_product, ['draft__short_description'])}
                        on_change_general={description => {this.handle_change_general_form(['draft__short_description'], description)}}
                    />
                </FormGroup>
                <FormGroup className="mb-5">
                    <Label for="gp_description" className="required-field">
                        Description
                    </Label>
                    <Editor
                        key={editor_remount_key_2}
                        design={sr(general_product, ['draft__description'])}
                        on_change_general={description => {this.handle_change_general_form(['draft__description'], description)}}
                    />
                </FormGroup>
                <div className="mb-5 attributes-group-2">
                    <FormGroup>
                        <Label for="gp_variation_attribute_1_name" className="required-field">Variation attribute 1 - Name</Label>
                        <Input 
                            type="text" id="gp_variation_attribute_1_name" 
                            disabled={editmode}
                            value={sr(general_product, ['variation_attributes', '0', 'name'])}
                            onChange={e => {this.handle_change_general_form(['variation_attributes', '0', 'name'], e.target.value)}} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_variation_attribute_1_options" className="required-field">
                            Variation attribute 1 - Options - separated by comma ","
                        </Label>
                        <Input 
                            type="text" id="gp_variation_attribute_1_options" 
                            disabled={editmode}
                            value={sr(general_product, ['variation_attributes', '0', 'options']).join(', ')}
                            onChange={e => {
                                this.handle_change_general_form(['variation_attributes', '0', 'options'], e.target.value.trim().split(/\s*,\s*/))
                            }} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_variation_attribute_2_name" className="required-field">Variation attribute 2 - Name</Label>
                        <Input 
                            type="text" id="gp_variation_attribute_2_name" 
                            disabled={editmode}
                            value={sr(general_product, ['variation_attributes', '1', 'name'])}
                            onChange={e => {this.handle_change_general_form(['variation_attributes', '1', 'name'], e.target.value)}} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_variation_attribute_2_options" className="required-field">
                            Variation attribute 2 - Options - separated by comma ","
                        </Label>
                        <Input 
                            type="text" id="gp_variation_attribute_2_options" 
                            disabled={editmode}
                            value={sr(general_product, ['variation_attributes', '1', 'options']).join(', ')}
                            onChange={e => {
                                this.handle_change_general_form(['variation_attributes', '1', 'options'], e.target.value.trim().split(/\s*,\s*/))
                            }} 
                        />
                    </FormGroup>
                </div>
                <div className="mb-5">
                    {
                        editmode
                            ? null
                            : <FormGroup>
                                <Button 
                                    color="primary" 
                                    onClick={e => {
                                        this.handle_change_general_form(
                                            ['variation_values'], 
                                            [...sr(general_product, ['variation_values']), make_empty_variation_value()]
                                        )
                                    }}
                                >
                                    <i className="fa fa-plus" /> Add more variation
                                </Button>
                            </FormGroup>
                    }
                    <div className="table-responsive">
                        <TableWithItemPattern
                            bordered striped
                            className="variation-values-table"
                            titles={this.get_variation_table_titles()}
                            items={sr(general_product, ['variation_values'])}
                            itemPattern={VariationValueTableItem}
                            itemKeyGen={item => item.id}
                            itemProps={{
                                editmode,
                                variation_attributes: sr(general_product, ['variation_attributes']),
                                variation_values: sr(general_product, ['variation_values']),
                                on_change_general: this.handle_change_general_form,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
        )
    }

}

LazadaNewProduct.propTypes = {
    general_product: PropTypes.object.isRequired,
    product: PropTypes.object.isRequired,
    additional_fields: PropTypes.array.isRequired,
    on_change: PropTypes.func.isRequired,
    on_change_general: PropTypes.func.isRequired,
    editor_remount_key_1: PropTypes.string.isRequired,
    editor_remount_key_2: PropTypes.string.isRequired,
};

LazadaNewProduct.defaultProps = {
    editor_remount_key_1: '1',
    editor_remount_key_2: '2',
};