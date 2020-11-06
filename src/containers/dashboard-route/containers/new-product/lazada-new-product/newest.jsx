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
import Editor from '../../../../../commons/editor/editor';
import TableWithItemPattern from '../../../../../commons/table-with-item-pattern/table-with-item-pattern';
import VariationValueTableItem from '../general-new-product/variation-value-table-item';
import {make_empty_variation_value} from '../general-new-product/general-init-product-form';
import {upload_static} from '../../../../../api/upload-static';
import moment from 'moment';
import {v4 as uuidv4} from 'uuid';
import ListImage from '../general-new-product/ListImage';
import $ from 'jquery';
import 'slick-carousel';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/docs.css';
import star from '../../../../../images/star.webp';
import heart from '../../../../../images/heart.svg';
import share from '../../../../../images/share.svg';
import info from '../../../../../images/info.svg';
import location from '../../../../../images/location.svg';
import delivery from '../../../../../images/delivery.svg';
import pay from '../../../../../images/invoice.svg';

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

        $('.slider-for').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: '.slider-nav'
        });
        $('.slider-nav').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: '.slider-for',
            arrows: false,
            centerMode: true,
            focusOnSelect: true
        });
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

    addSlide(url) {
        $('.slider-for').slick('slickAdd', `<div><img src=${url} /></div>`);
        $('.slider-nav').slick('slickAdd', `<div><img src=${url} /></div>`);
    }

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
            <div className="lazada-new-product container px-0 bg-white">
                <FormGroup className="mb-0">
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
                <Row>
                    <Col>
                        <div className="slider-for"></div>

                        <div className="slider-nav"></div>

                        <ListImage 
                            buttonLabel='Edit Image'
                            product={general_product}
                            add_image={url => this.addSlide(url)}
                            on_change_general={product => {this.props.on_change_general(product)}} 
                            on_removed={product => {this.props.on_removed(product)}} 
                            on_variations_change={product => {this.props.on_variations_change(product)}} 
                        />
                    </Col>

                    <Col xs='5'>
                        <FormGroup>
                            <Input 
                                type="text" id="gp_name" 
                                value={sr(general_product, ['name'])}
                                onChange={e => {this.handle_change_general_form(['name'], e.target.value)}} 
                                placeholder='Tên sản phẩm'
                            />
                        </FormGroup>

                        <div className="d-flex justify-content-between mb-3 mt-4">
                            <div className="rating">
                                {
                                    [...Array(5)].map(() => (
                                        <img src={star} height={12} width={12} alt='start'/>
                                    ))
                                }{' '}
                                <a href="/">187 đánh giá</a>
                            </div>

                            <div className="share">
                                <img src={share} height={22} width={22} className='mr-4' alt='share'/>
                                <img src={heart} height={22} width={22} alt='hear'/>
                            </div>
                        </div>

                        <FormGroup className="row">
                            <Label for="gp_brand" className='col-3 align-self-end'>Thương hiệu: </Label>
                            <SelectInput
                                className='col-4'
                                items={brands}
                                itemIdGen={brand => brand.brand_id}
                                itemLabelGen={brand => brand.name}
                                value={sr(general_product, ['brand']) ? (brands.find(b => b.name === general_product.brand) || {}) : {}}
                                onSearchChange={search => {this.api_get_lazada_brands(search)}}
                                onSelect={brand => {this.handle_change_general_form(['brand'], brand.name || '')}}
                                onCancel={() => {this.handle_change_general_form(['brand'], '')}}
                                placeholder='Thương hiệu'
                            />
                        </FormGroup>

                        <FormGroup className='w-25'>
                            <Input 
                                type="number" id="gp_sell_price" 
                                value={sr(general_product, ['sell_price'])}
                                onChange={e => {this.handle_change_general_form(['sell_price'], e.target.value)}} 
                                placeholder='Giá bán'
                            />
                        </FormGroup>

                        <FormGroup className='w-25'>
                            <Input 
                                type="number" id="gp_original_price" 
                                value={sr(general_product, ['original_price'])}
                                onChange={e => {this.handle_change_general_form(['original_price'], e.target.value)}}
                                placeholder='Giá gốc'
                            />
                        </FormGroup>

                        <FormGroup className='row'>
                            <Label for="gp_quantity" className="col-3 align-self-end">Số lượng</Label>
                            <Input 
                                type="number" id="gp_quantity" 
                                value={sr(general_product, ['quantity'])}
                                onChange={e => {this.handle_change_general_form(['quantity'], e.target.value)}} 
                                className='col-4'
                                placeholder='0'
                            />
                        </FormGroup>

                    </Col>

                    <Col>
                        <div className="delivery">
                            <div className='d-flex justify-content-between px-3 pt-3'>
                                <span>Tùy chọn giao hàng</span>
                                <img src={info} alt="info"/>
                            </div>

                            <div className='location border-bottom px-3 py-2'>
                                <Row>
                                    <Col xs='1'><img src={location} alt="location"/></Col>
                                    <Col>Bạc Liêu, Huyện Hồng Dân, Xã Lộc Ninh</Col>
                                    <Col xs='3' className='p-0'><a href="/">THAY ĐỔI</a></Col>
                                </Row>
                            </div>

                            <div className="info px-3 py-2">
                                <Row>
                                    <Col xs='1'><img src={delivery} alt="delivery"/></Col>
                                    <Col>
                                        <div>GH tiêu chuẩn</div>
                                        <div>3 - 6 ngày</div>
                                    </Col>
                                    <Col xs='3' className='p-0'><b>45.000 ₫</b></Col>
                                </Row>
                            </div>

                            <div className="pay px-3 py-2 border-bottom">
                                <Row>
                                    <Col xs='1'><img src={pay} alt="payment"/></Col>
                                    <Col>
                                        Thanh toán khi nhận hàng. (Không được đồng kiểm)
                                    </Col>
                                </Row>
                            </div>

                            {/* <FormGroup key={field.name}>
                                <Label for={`lp_${field.name}`} className={field.is_mandatory ? 'required-field' : ''}>
                                    {field.label}
                                </Label>
                                <LazadaInput 
                                    type={field.input_type} 
                                    value={sr(product, LazadaNewProduct.make_attribute_path(field)) || ''} 
                                    on_change={value => {this.handle_change_form(LazadaNewProduct.make_attribute_path(field), value)}} 
                                    options={field.options} 
                                />
                            </FormGroup> */}
                            
                        </div>
                    </Col>
                </Row>


                <FormGroup id='test'>
                    <Label for="gp_short_description" className="required-field">
                        Short Description
                    </Label>
                    <Editor
                        key={editor_remount_key_1}
                        design={sr(general_product, ['short_description'])}
                        on_change_general={description => {this.handle_change_general_form(['short_description'], description)}}
                    />
                </FormGroup>
                <FormGroup className="mb-5">
                    <Label for="gp_description" className="required-field">
                        Description
                    </Label>
                    <Editor
                        key={editor_remount_key_2}
                        design={sr(general_product, ['description'])}
                        on_change_general={description => {this.handle_change_general_form(['description'], description)}}
                    />
                </FormGroup>
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