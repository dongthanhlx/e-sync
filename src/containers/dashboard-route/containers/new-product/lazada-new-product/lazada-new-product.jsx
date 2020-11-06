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
            slider_for_key: uuidv4(),
            slider_nav_key: uuidv4(),
            numOfImage: 0,
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

    shouldComponentUpdate(nextProps, nextState) {
        console.log(nextProps);
        console.log(this.props);
        return true;
    }

    componentDidUpdate(prev_props) {
        if (prev_props.brand_name !== this.props.brand_name) {
            this.api_get_lazada_brands(this.props.brand_name);
        }
        
        if (this.props.images && (prev_props.images.length !== this.props.images.length)) {
            this.setState({
                slider_for_key: uuidv4(),
                slider_nav_key: uuidv4(),
            })
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

    initSlider() {
        $('.slider-for').empty();
        $('.slider-nav').empty();
    }

    addSlide(url) {
        $('.slider-for').slick('slickAdd', `<div><img src=${url} key='${url}-for'/></div>`);
        $('.slider-nav').slick('slickAdd', `<div><img src=${url} key='${url}-nav'/></div>`);
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
        console.log(general_product);
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
                        <div className="slider-for">
                            {
                                sr(general_product, ['images']).map(image => (
                                    this.addSlide(image)
                                ))
                            }
                        </div>

                        <div className="slider-nav"></div>

                        <ListImage 
                            // key={images_key}
                            buttonLabel='Edit Image'
                            product={general_product}
                            on_change_general={(index, url) => {this.handle_change_general_form(['images', index], url)}} 
                            on_removed={(index) => {this.handle_change_general_form(['images', index], '')}} 
                        />
                    </Col>

                    <Col xs='5' className='mt-3'>
                        <div className='border-bottom'>
                            <FormGroup>
                                <Input 
                                    type="textarea" id="gp_name" 
                                    value={sr(general_product, ['name'])}
                                    onChange={e => {this.handle_change_general_form(['name'], e.target.value)}} 
                                    placeholder='Tên sản phẩm'
                                />
                            </FormGroup>

                            <div className="d-flex justify-content-between mb-3 mt-4">
                                <div className="rating">
                                    {
                                        [...Array(5)].map((e, i) => (
                                            <img src={star} height={12} width={12} alt='start' key={i} />
                                        ))
                                    }
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
                        </div>

                        <div className="mt-4 border-bottom">
                            <FormGroup className='col-6 sell_price pl-0 mb-0'>
                                <InputGroup>
                                    <Input 
                                        type="number" id="gp_sell_price" 
                                        value={sr(general_product, ['sell_price'])}
                                        onChange={e => {this.handle_change_general_form(['sell_price'], e.target.value)}} 
                                        placeholder='Giá bán'
                                    />

                                    <InputGroupAddon addonType="prepend">₫</InputGroupAddon>
                                </InputGroup>
                            </FormGroup>

                            <FormGroup className='col-5 original_price pl-0'>
                                <InputGroup>
                                    <Input 
                                        type="number" id="gp_original_price" 
                                        value={sr(general_product, ['original_price'])}
                                        onChange={e => {this.handle_change_general_form(['original_price'], e.target.value)}}
                                        placeholder='Giá gốc'
                                        className='original_price'
                                    />

                                    <InputGroupAddon addonType="prepend">₫</InputGroupAddon>
                                </InputGroup>
                            </FormGroup>

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

                            <Row className='buy-form my-3 mx-0'>
                                <button className="btn col mr-2 py-2">Mua ngay</button>
                                <button className="btn col py-2">Thêm vào giỏ hàng</button>
                            </Row>
                        </div>
                    </Col>

                    <Col className='right pr-3'>
                        <div className="delivery">
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
                        </div>
                    </Col>
                </Row>

                <div className="description bg-white mt-3">
                    <div className="title py-3 px-4">
                        <h6 className='mb-0'>
                            Mô tả sản phẩm {sr(general_product, ['name'])}
                        </h6>
                    </div>

                    <div className="mx-4 border px-3 py-2 my-1">
                        <div className='float-left'>
                            <img src={infonote} alt="info note" width='20'/>
                        </div>

                        <div className='ml-4 note'>
                            Sản phẩm này là tài sản cá nhân được bán bởi Nhà Bán Hàng
                            Cá Nhân và không thuộc đối tượng phải chịu thuế GTGT. 
                            Do đó hóa đơn VAT không được cấp trong trường hợp này. 
                        </div>
                    </div>

                    <FormGroup>
                        <Editor
                            key={editor_remount_key_1}
                            // key='1'
                            type='legacy'
                            design={sr(general_product, ['short_description'])}
                            on_change_general={description => {this.handle_change_general_form(['short_description'], description)}}
                            on_change_html_general={description => {this.handle_change_general_form(['html_short_description'], description)}}
                        />
                    </FormGroup>

                    <FormGroup className="mb-5">
                        <Editor
                            key={editor_remount_key_2}
                            // key='2'
                            design={sr(general_product, ['description'])}
                            on_change_general={description => {this.handle_change_general_form(['description'], description)}}
                            on_change_html_general={description => {this.handle_change_general_form(['html_description'], description)}}
                        />
                    </FormGroup>
                </div>

                <div>
                    <FormGroup>
                        <Label for="gp_sellersku" className="required-field">Seller SKU</Label>
                        <Input 
                            type="text" id="gp_sellersku" 
                            value={sr(general_product, ['seller_sku'])}
                            onChange={e => {this.handle_change_general_form(['seller_sku'], e.target.value)}} 
                        />
                    </FormGroup>

                    <div className='mb-5 attributes-group-1'>
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
                                value={sr(product, ['package_length'])}
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