import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FormGroup, Label, Input, Row, Col, Button, InputGroup, InputGroupAddon} from 'reactstrap';
import SelectInput from '../../../../../commons/select-input/select-input';
import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';
import {noti} from '../../../../../services/noti-service';
import {get_lazada_category_tree} from '../../../../../api/lazada-category-tree';
import CategoryFilter from '../../../../../commons/category-filter/category-filter';
import {get_lazada_brands} from '../../../../../api/lazada-brand';
import LazadaInput from '../../../../../commons/lazada-input/lazada-input';
import DatePicker from '../../../../../commons/date-picker/date-picker';
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
import servenDay from '../../../../../images/7-day.png';
import shield from '../../../../../images/shield.png';
import zaloPay from '../../../../../images/zaloPay.png';
import infonote from '../../../../../images/infonote.svg';
import right_site from '../../../../../assets/images/normal-use/right.png';
import warning from '../../../../../assets/images/normal-use/warning.png';

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
        this.updateSlider = this.updateSlider.bind(this);
    }

    componentDidMount() {
        this.api_get_lazada_category_tree();
        if (this.props.brand_name) {
            this.api_get_lazada_brands(this.props.brand_name);
        }

        $('.slider-for').not('.slick-initialized').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: '.slider-nav'
        });

        $('.slider-nav').not('.slick-initialized').slick({
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

        if (prev_props.general_product.images.length !== this.props.general_product.images.length) {
            console.log(prev_props.general_product.images);
            console.log(this.props.general_product.images);
            this.updateSlider(prev_props.general_product.images, this.props.general_product.images);
        }
    }

    removeSlide(index) {
        $('.slider-for').slick('slickRemove', index);
        $('.slider-nav').slick('slickRemove', index);
    }

    removeAll(images) {
        const length = images.length;
        if (length === 0) return;
        images.map((image, index) => this.removeSlide(length - index - 1))
    }

    addSlide(url) {
        $('.slider-for').slick('slickAdd', `<div><img src='${url}' /></div>`);
        $('.slider-nav').slick('slickAdd', `<div><img src='${url}' /></div>`);
    }

    addAll(images) {
        if (images.length === 0) return;
        images.map(image => this.addSlide(image));
    }

    updateSlider(oldImages, newImages) {
        // this.removeAll(oldImages);
        this.addAll(newImages);
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

    render() {
        const {
            additional_fields, 
            editmode, 
            images_key, 
            general_product, 
            product,
            activeTab,
            editorKey,
            on_change_general,
        } = this.props;
        // console.log(general_product);
        const {category_tree, brands} = this.state;
        const normal_fields = additional_fields.filter(f => f.attribute_type === 'normal');
        const sku_fields = additional_fields.filter(f => f.attribute_type === 'sku');
        const variations = product.Skus[0].Sku;

        return (
            <div className="lazada-new-product container px-0">
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
                
                <Row className='bg-white mx-0'>
                    <Col className='left'>
                        <div className="slider-for"></div>

                        <div className="slider-nav"></div>

                        <ListImage
                            editmode={editmode}
                            general_product={general_product}
                            on_change_general={(general_product) => {on_change_general(general_product)}} 
                        />
                    </Col>

                    <Col xs='5' className='mt-3'>
                        <div className='border-bottom'>
                            <div className="md-form">
                                <textarea 
                                    id="textarea-char-counter" 
                                    className="form-control md-textarea border-bottom-0 gp_name" 
                                    length="120" 
                                    onChange={e => {this.handle_change_general_form(['name'], e.target.value)}}
                                    value={sr(general_product, ['name'])}
                                    placeholder='Tên sản phẩm'
                                ></textarea>
                            </div>

                            <div className="d-flex justify-content-between mb-2 mt-4">
                                <div className="rating">
                                    {
                                        [...Array(5)].map((e, i) => (
                                            <img src={star} height={12} width={12} alt='start' key={i} />
                                        ))
                                    }
                                    <a href="/" className='text-default font-weight-normal'>187 đánh giá</a>
                                </div>

                                <div className="share">
                                    <img src={share} height={22} width={22} className='mr-4' alt='share'/>
                                    <img src={heart} height={22} width={22} alt='hear'/>
                                </div>
                            </div>

                            <FormGroup className="row">
                                <Label for="gp_brand" className='ml-3 align-self-end'>Thương hiệu: </Label>
                                <SelectInput
                                    className='col-4 text-default border-0 pl-1 bg-white'
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
                        </div>

                        <div className="mt-4 border-bottom">
                            <div className="md-form input-with-post-icon w-50 my-0">
                                <input 
                                    type="number" 
                                    className="form-control sell_price border-bottom-0 my-0"  
                                    value={sr(general_product, ['sell_price'])}
                                    onChange={e => {this.handle_change_general_form(['sell_price'], e.target.value)}} 
                                    placeholder='Giá bán'
                                />
                            </div>

                            <div className="md-form input-with-post-icon w-25 my-0">
                                <input 
                                    type="number" 
                                    className="form-control original_price border-bottom-0 text-muted" 
                                    value={sr(general_product, ['original_price'])}
                                    onChange={e => {this.handle_change_general_form(['original_price'], e.target.value)}} 
                                    placeholder='Giá gốc'
                                />
                            </div>

                            <Row className='mt-4 mb-2'>
                                <Col xs='3'>
                                    <label>Khuyến mãi</label>
                                </Col>

                                <Col className='px-0'>
                                    <img src={zaloPay} alt="zalo pay" height='24'/>
                                </Col>
                            </Row>
                        </div>

                        <div className='mt-4'>
                            <Row>
                                <Col xs='3' className="text-muted">Số lượng</Col>
                                <Col className='px-0'>
                                    <div className="def-number-input number-input safari_only btn-light">
                                        <button onClick={(e) => {e.target.parentNode.querySelector('input[type=number]').stepDown()}} className="minus"></button>
                                        <input 
                                            className="quantity" 
                                            min="0" 
                                            name="quantity" 
                                            value={sr(general_product, ['quantity'])} 
                                            type="number" 
                                            placeholder='1'
                                            onChange={e => {this.handle_change_general_form(['quantity'], e.target.value)}} 
                                        />
                                        <button onClick={(e) => {e.target.parentNode.querySelector('input[type=number]').stepUp()}} className="plus"></button>
                                    </div>
                                </Col>
                            </Row>

                            <Row className='buy-form my-3 mx-0'>
                                <button className="btn col text-capitalize z-depth-0 py-2 mx-0 mr-2">Mua ngay</button>
                                <button className="btn col text-capitalize z-depth-0 py-2 mx-0">Thêm vào giỏ hàng</button>
                            </Row>
                        </div>
                    </Col>

                    <Col className='right pr-3'>
                        {/* <div className="delivery">
                            <div className='d-flex justify-content-between pt-3'>
                                <span>Tùy chọn giao hàng</span>
                                <img src={info} alt="info"/>
                            </div>

                            <div className='location border-bottom py-2'>
                                <Row>
                                    <Col xs='1'><img src={location} alt="location"/></Col>
                                    <Col>Bạc Liêu, Huyện Hồng Dân, Xã Lộc Ninh</Col>
                                    <Col xs='3' className='p-0'><a href="/">THAY ĐỔI</a></Col>
                                </Row>
                            </div>

                            <div className="info py-2">
                                <Row>
                                    <Col xs='1'><img src={delivery} alt="delivery"/></Col>
                                    <Col>
                                        <div>GH tiêu chuẩn</div>
                                        <div>3 - 6 ngày</div>
                                    </Col>
                                    <Col xs='3' className='p-0'><b>45.000 ₫</b></Col>
                                </Row>
                            </div>

                            <div className="pay py-2 border-bottom">
                                <Row>
                                    <Col xs='1'><img src={pay} alt="payment"/></Col>
                                    <Col>
                                        Thanh toán khi nhận hàng. (Không được đồng kiểm)
                                    </Col>
                                </Row>
                            </div>
                        </div>

                        <div className="guarantee border-bottom">
                            <div className='d-flex justify-content-between pt-3'>
                                <span>Đổi trả và Bảo hành</span>
                                <img src={info} alt="info"/>
                            </div>

                            <div className='py-2'>
                                <Row>
                                    <Col xs='1'>
                                        <img src={servenDay} alt="7-day" height='24' width='24' />
                                    </Col>

                                    <Col>
                                        <div>7 ngày trả hàng cho Nhà bán hàng</div>
                                        <div style={{'color': '#9e9e9e'}}>Không được trả hàng với lý do "Không vừa ý"</div>
                                    </Col>

                                    <Col xs='1'></Col>
                                </Row>
                            </div>

                            <div className='py-2'>
                                <Row>
                                    <Col xs='1'>
                                        <img src={shield} alt="shield" height='24' width='24'/>
                                    </Col>

                                    <Col>
                                        <div>Bắng hóa đơn mua hàng 3 tháng</div>
                                    </Col>

                                    <Col xs='1'></Col>
                                </Row>
                            </div>
                        </div> */}

                        <img src={right_site} alt="right-site"/>
                    </Col>
                </Row>

                <div className="description bg-white mt-3">
                    <div className="title py-3 px-4">
                        <h6 className='mb-0 font-weight-bold'>
                            Mô tả sản phẩm {sr(general_product, ['name'])}
                        </h6>
                    </div>

                    <div className="mx-4 border px-3 py-2 my-1">
                        <div className='float-left'>
                            <img src={infonote} alt="info note" width='20'/>
                        </div>

                        <div className='ml-4'>
                            Sản phẩm này là tài sản cá nhân được bán bởi Nhà Bán Hàng
                            Cá Nhân và không thuộc đối tượng phải chịu thuế GTGT. 
                            Do đó hóa đơn VAT không được cấp trong trường hợp này. 
                        </div>
                    </div>

                    <FormGroup>
                        <Editor
                            type='legacy'
                            design={sr(general_product, ['short_description'])}
                            on_change_general={description => {this.handle_change_general_form(['short_description'], description)}}
                            on_change_html_general={description => {this.handle_change_general_form(['html__short_description'], description)}}
                        />
                    </FormGroup>

                    <FormGroup className="mb-5">
                        <Editor
                            // key={editorKey}
                            design={sr(general_product, ['description'])}
                            on_change_general={description => {this.handle_change_general_form(['description'], description)}}
                            on_change_html_general={description => {this.handle_change_general_form(['html__description'], description)}}
                        />
                    </FormGroup>
                </div>

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