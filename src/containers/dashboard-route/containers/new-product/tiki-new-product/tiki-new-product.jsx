import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FormGroup, Label, Input, Row, Col, Button, Table, InputGroupAddon, InputGroup} from 'reactstrap';
import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';
import {noti} from '../../../../../services/noti-service';
import {get_tiki_category_tree} from '../../../../../api/tiki-category-tree';
import CategoryFilter from '../../../../../commons/category-filter/category-filter';
import {snake_to_title} from '../../../../../utils/snake_to_title';
import SelectInput from '../../../../../commons/select-input/select-input';
import {TIKI_INVENTORY_TYPES} from '../../../../../constants/tiki-inventory-type';
import Editor from '../../../../../commons/editor/editor';
import ListImage from '../general-new-product/ListImage';
import {v4 as uuidv4} from 'uuid';
import $ from 'jquery';
import 'slick-carousel';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/docs.css';
import heart from '../../../../../images/heart.svg';
import share from '../../../../../images/share.svg';
import star from '../../../../../images/star.webp';
import shop from '../../../../../images/shop.png';
import compensation from '../../../../../images/compensation.svg';
import guarantee from '../../../../../images/guarantee.svg';
import refund from '../../../../../images/refund.svg';
import icon_add from '../../../../../images/icons-add.svg';
import icon_remove from '../../../../../images/icons-remove.svg';
import tikicard from '../../../../../assets/images/normal-use/tikicard.png';
import question from '../../../../../assets/images/normal-use/question.svg';

export default class TikiNewProduct extends Component {

    field_brand = {
        code: "brand_origin",
        display_name: null,
        example: "Vietnam",
        id: 708,
        is_required: 1,
    }

    static make_attribute_path(field) {
        return ['attributes', field.code];
    }

    static re_align_variations_table(option_attributes) {
        const columns_fr = [1].concat(option_attributes.filter(att => att).map(() => 1)).concat([2, 2]);
        $('.tiki-variations-table .tr').css('grid-template-columns', columns_fr.map(fr => `${fr}fr`).join(' '));
    }

    constructor(props) {
        super(props);
        this.state = {
            category_tree: [],
            slider_for_key: uuidv4(),
            slider_nav_key: uuidv4(),
            renderFlag: true,
        };

        this.updateSlider = this.updateSlider.bind(this);
    }

    componentDidMount() {
        this.api_get_category_tree();
        TikiNewProduct.re_align_variations_table(this.props.product.option_attributes);

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

    shouldComponentUpdate(nextProps) {
        if (this.props.activeTab === nextProps.activeTab) {
            return this.state.renderFlag;
        }

        return true;
    }

    isRerender(value) {
        this.setState({
            renderFlag: value
        })
    }

    componentDidUpdate(prev_props) {
        TikiNewProduct.re_align_variations_table(this.props.product.option_attributes);
        
        let old_images = sr(prev_props.general_product, ['images']);
        let new_images = sr(this.props.general_product, ['images']);

        this.updateSlider(old_images, new_images);
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
        images.map(image => this.addSlide(image))
    }

    updateSlider(oldImages, newImages) {
        this.removeAll(oldImages);
        this.addAll(newImages);
    }

    componentWillUnmount() {
        this.setState({
            category_tree: []
        })
    }

    get_variation_table_titles() {
        const {option_attributes} = this.props.product;
        const volatile_titles = option_attributes.filter(att => att);
        return ['Seller SKU'].concat(volatile_titles).concat(['Inventory type', 'Supplier']);
    }

    async api_get_category_tree() {
        try {
            const category_tree = await get_tiki_category_tree();
            this.setState({category_tree});
        } catch (err) {
            console.error(err);
            noti('error', err);
        }
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

        this.isRerender(true);
        on_change(new_product);
    }

    handle_change_general_form(path, value, isRender = true) {
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

        this.isRerender(isRender);
        on_change_general(new_product);
    }

    render() {
        const {
            product, 
            additional_fields, 
            general_product,
            editorKey,
            editmode,
            on_change_general
        } = this.props;
        console.log('render - tikiiiiiiiiiiii')
        const {category_tree} = this.state;
        return (
            <div className="tiki-new-product container px-0">
                <FormGroup className="mb-0">
                    <CategoryFilter
                        className="tiki-category-filter"
                        categories={category_tree}
                        idGen={cat => cat.id}
                        nameGen={cat => cat.name}
                        childrenGen={cat => cat.children}
                        onChangeCategory={cat => {this.handle_change_form(['category_id'], cat.id)}}
                        onAbortCategory={() => {this.handle_change_form(['category_id'], '')}}
                    />
                </FormGroup>

                <div className="main px-2 bg-white">
                    <div className="left">
                        <div className="slider-for"></div>

                        <div className="slider-nav"></div>

                        <ListImage 
                            editmode={editmode}
                            general_product={general_product}
                            on_change_general={(new_general_product) => {on_change_general(new_general_product); this.updateSlider(sr(general_product, ['images']), sr(new_general_product, ['images']))}} 
                        />
                    </div>

                    <div className="right border-left p-3">
                        <div>{/* brand - name - review */}
                            <FormGroup key={this.field_brand.id} row>
                                <Label for={`tp_${this.field_brand.code}`} className='col-2 align-self-end'>
                                    {/* {snake_to_title(this.field_brand.code)} */}
                                    Thương hiệu:
                                </Label>

                                <Input 
                                    type="text" id={`tp_${this.field_brand.code}`} 
                                    placeholder={this.field_brand.example ? `Example: ${this.field_brand.example}` : ''}
                                    value={sr(product, TikiNewProduct.make_attribute_path(this.field_brand)) || ''}
                                    onChange={e => {this.handle_change_form(TikiNewProduct.make_attribute_path(this.field_brand), e.target.value)}} 
                                    className='col-4 text-primary border-0'
                                />
                            </FormGroup>

                            <Row>
                                <Col xs={9}>
                                    {/* <FormGroup className='m-0'>
                                        <Input 
                                            type="textarea" id="gp_name" 
                                            value={sr(general_product, ['name'])}
                                            onChange={e => {this.handle_change_general_form(['name'], e.target.value)}} 
                                            placeholder='Tên sản phẩm'
                                            className='name'
                                        />
                                    </FormGroup> */}

                                    <div className="md-form my-0">
                                        <textarea 
                                            id="textarea-char-counter" 
                                            className="form-control md-textarea border-bottom-0 gp_name" 
                                            length="120" 
                                            value={sr(general_product, ['name'])}
                                            onChange={e => {this.handle_change_general_form(['name'], e.target.value)}}
                                            placeholder='Tên sản phẩm'
                                            style={{'fontSize': '24px'}}
                                        ></textarea>
                                    </div>
                                </Col>

                                <Col xs={3} className='text-right'> {/* share */}
                                    <button className="btn p-2 rounded-circle mr-2 heart">
                                        <img src={heart} alt="heart" width='24'/>
                                    </button>

                                    <button className="btn p-2 rounded-circle share">
                                        <img src={share} alt="share" width='24'/>
                                    </button>
                                </Col>
                            </Row>

                            <div className="rating">
                                {
                                    [...Array(5)].map((e, i) => (
                                        <img src={star} height={16} width={16} alt='start' key={i} />
                                    ))
                                }
                                <a href="/" className='ml-1 text-muted'>(Xem 187 đánh giá)</a>
                            </div>
                        </div>

                        <Row>{/* price */}
                            <Col xs='8'>
                                <Row form className='bg-light p-3 my-3 price'>
                                    <Col xs={6}>
                                        {/* <InputGroup className='mr-2 mb-0'>
                                            <Input 
                                                type="number" id="gp_sell_price" 
                                                value={sr(general_product, ['sell_price'])}
                                                onChange={e => {this.handle_change_general_form(['sell_price'], e.target.value)}} 
                                                placeholder='Giá bán'
                                                className='sell_price'
                                            />
                                            <InputGroupAddon addonType="prepend">₫</InputGroupAddon>
                                        </InputGroup> */}

                                        <div className="md-form my-0">
                                            <input 
                                                type="number" 
                                                className="form-control sell_price border-bottom-0 my-0"  
                                                value={sr(general_product, ['sell_price'])}
                                                onChange={e => {this.handle_change_general_form(['sell_price'], e.target.value)}} 
                                                placeholder='Giá bán'
                                            />
                                        </div>
                                    </Col>

                                    <Col xs={3}>
                                        {/* <InputGroup className='mb-0'>
                                            <Input 
                                                type="number" id="gp_original_price" 
                                                value={sr(general_product, ['original_price'])}
                                                onChange={e => {this.handle_change_general_form(['original_price'], e.target.value)}}
                                                placeholder='Giá gốc'
                                                className='original_price'
                                            />
                                            <InputGroupAddon addonType="prepend">₫</InputGroupAddon>
                                        </InputGroup> */}
                                        <div className="md-form my-0">
                                            <input 
                                                type="number" 
                                                className="form-control original_price border-bottom-0 my-0"  
                                                value={sr(general_product, ['original_price'])}
                                                onChange={e => {this.handle_change_general_form(['original_price'], e.target.value)}} 
                                                placeholder='Giá gốc'
                                            />
                                        </div>
                                    </Col>

                                    <a href='https://tiki.vn/chuong-trinh/mo-the-tikicard?src=pdp_badge' className='d-flex mt-2'>
                                        <img src={tikicard} alt="tiki-card" height={24} />
                                        <div className='text-dark m-1'><b>Hoàn tiền tối đa 15% tối đa 600k/tháng</b></div>
                                        <img src={question} alt="question" width={11} />
                                    </a>
                                </Row>

                                <div className='delivery border-top border-bottom py-3'>
                                    <div className='mb-3'>
                                        Giao đến <a href="/" className='address'><b>Q. Nam Từ Liêm, P.Cầu Diễn, Hà Nội </b></a> - <a href="/" className='address'><b>ĐỔI ĐỊA CHỈ</b></a>
                                    </div>

                                    <form>
                                        <fieldset className='border px-3 py-2 rounded'>
                                            <legend className='mb-0'><b>GIAO TIÊU CHUẨN</b></legend>

                                            <b className='text-success font-weight-bold'>Thứ 3, ngày 03 tháng 11</b>
                                            <div><span className='text-muted'>Vận chuyển:</span> 35.000 ₫</div>
                                        </fieldset>
                                    </form>
                                </div>

                                <div className='py-3 border-bottom'>
                                    <FormGroup className='quantity'>
                                        <Label for="gp_quantity" style={{'fontSize': '15px'}}><b>Số lượng</b></Label>
                                        {/* <InputGroup>
                                            <InputGroupAddon addonType="prepend" className='border border-right-0 rounded p-1'>
                                                <img src={icon_remove} alt="remove"/>
                                            </InputGroupAddon>
                                            <Input 
                                                type="number" id="gp_quantity" 
                                                value={sr(general_product, ['quantity'])}
                                                onChange={e => {this.handle_change_general_form(['quantity'], e.target.value)}} 
                                                placeholder='0'
                                                className='col-2'
                                            />
                                            <InputGroupAddon addonType="prepend" className='border border-left-0 rounded p-1'>
                                                <img src={icon_add} alt="add"/>
                                            </InputGroupAddon>
                                        </InputGroup> */}

                                        <div className="def-number-input number-input safari_only">
                                            <button onClick={(e) => {e.target.parentNode.querySelector('input[type=number]').stepDown()}} className="minus"></button>
                                            <input 
                                                className="quantity font-weight-bold" 
                                                min="0" 
                                                name="quantity" 
                                                value={sr(general_product, ['quantity'])} 
                                                type="number" 
                                                placeholder='1'
                                                onChange={e => {this.handle_change_general_form(['quantity'], e.target.value)}} 
                                            />
                                            <button onClick={(e) => {e.target.parentNode.querySelector('input[type=number]').stepUp()}} className="plus"></button>
                                        </div>
                                    </FormGroup>

                                    <div className='buy'>
                                        <button className='btn btn-danger z-depth-0' style={{'fontSize': '15px'}}>Chọn mua</button>

                                        <div></div>
                                    </div>
                                </div>
                            </Col>

                            <Col xs='4' className='border rounded p-0 mt-3' style={{'height': 'fit-content'}}>
                                <div className='shop px-3 py-2'>
                                    <div><b>Cam kết chính hiệu bởi</b></div>

                                    <div>
                                        <img src={shop} alt="shop" width={44} style={{verticalAlign: 'bottom'}} />

                                        <a href="/" className='ml-2 font-weight-bold'>
                                            <div style={{fontSize: 15}} className='text-dark mb-1'>Shoptila</div>
                                            <div className="text-primary">Xem shop</div>
                                        </a>
                                    </div>
                                </div>

                                <div className='px-3 py-2 border-top border-bottom d-flex justify-content-between'>
                                    <b>Thời gian bảo hành</b>
                                    <b>6 tháng</b>
                                </div>

                                <Row className='px-3 py-2'>
                                    <Col className='text-center pr-0'>
                                        <img src={compensation} alt="compensation" width={20} />
                                        <div>
                                            <b>
                                                Hoàn tiền <div className="font-weight-bold">111%</div>
                                                <a href="https://drive.google.com/file/d/1po3r6qApp-q7JDB5kwGKujVtvInfO-ih/view"  className='text-dark' style={{'textDecorationLine': 'underline'}}>nếu giả</a>
                                            </b>
                                        </div>
                                    </Col>

                                    <Col className='text-center p-0'>
                                        <img src={guarantee} alt="guarantee" width={20}/>

                                        <div>
                                            <b>Mở hộp kiểm tra nhận hàng</b>
                                        </div>
                                    </Col>

                                    <Col className='text-center pl-0'>
                                        <img src={refund} alt="refund" width={20}/>

                                        <div>
                                            <b>
                                                Đổi trả trong 
                                                <div className='font-weight-bold'>
                                                    7 ngày
                                                </div>
                                                nếu sp lỗi
                                            </b>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </div>
            
                <div className="detail w-75 overflow-auto mt-5">
                    <h5>THÔNG TIN CHI TIẾT</h5>

                    <div className='overflow-auto table-wrapper'>
                        <Table striped hover className='bg-white'>
                                {
                                    Array.isArray(additional_fields) && additional_fields.length > 0
                                        // ? <div className="mb-5 additional-attributes">
                                        // ? <div className="mb-5">
                                            ? 
                                        <tbody>
                                            {
                                                additional_fields.sort((a, b) => parseInt(b.is_required) - parseInt(a.is_required)).map(field => (
                                                    <tr key={field.id}>
                                                        {/* <FormGroup key={field.id}> */}
                                                        <td className='px-3 py-2'>
                                                            <Label for={`tp_${field.code}`} className={field.is_required ? 'required-field m-0' : 'm-0'}>
                                                                {snake_to_title(field.code)}
                                                            </Label>
                                                        </td>
                                                        
                                                        <td className='px-3 py-2'>
                                                            <Input 
                                                                type="text" id={`tp_${field.code}`} 
                                                                placeholder={field.example ? `Example: ${field.example}` : ''}
                                                                value={sr(product, TikiNewProduct.make_attribute_path(field)) || ''}
                                                                onChange={e => {this.handle_change_form(TikiNewProduct.make_attribute_path(field), e.target.value)}} 
                                                            />
                                                        </td>
                                                    {/* </FormGroup> */}
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                        // </div>
                                        : null
                                }
                        </Table>
                    </div>
                </div>

                <div className="description mt-5">
                    <h5>MÔ TẢ SẢN PHẨM</h5>

                    <FormGroup className="mb-5 bg-white">
                        <Editor
                            // key={editorKey}
                            design={sr(general_product, ['description'])}
                            on_change_general={description => {this.handle_change_general_form(['description'], description, false)}}
                            on_change_html_general={description => {this.handle_change_general_form(['html__description'], description, false)}}
                        />
                    </FormGroup>
                </div>

                <div className="mb-5 tiki-variations-table">
                    <div className="tr">
                        {
                            this.get_variation_table_titles().map(title => (
                                <div key={title} className="th">{title}</div>
                            ))
                        }
                    </div>
                    {
                        product.variants.map((variant, index) => (
                            <div key={variant.id} className="tr">
                                <div className="td">
                                    {variant.sku}
                                </div>
                                {
                                    sr(product, ['option_attributes', 0])
                                        ? <div className="td">
                                            {sr(variant, ['option1'])}
                                        </div>
                                        : null
                                }
                                {
                                    sr(product, ['option_attributes', 1])
                                        ? <div className="td">
                                            {sr(variant, ['option2'])}
                                        </div>
                                        : null
                                }
                                <div className="td">
                                    <SelectInput
                                        items={TIKI_INVENTORY_TYPES}
                                        itemIdGen={o => o.value}
                                        itemLabelGen={o => o.label}
                                        value={
                                            sr(variant, ['inventory_type']) 
                                                ? TIKI_INVENTORY_TYPES.find(type => type.value === variant.inventory_type) || {}
                                                : {}
                                        }
                                        onSelect={type => {this.handle_change_form(['variants', index, 'inventory_type'], type.value)}}
                                        onCancel={() => {this.handle_change_form(['variants', index, 'inventory_type'], '')}}
                                    />
                                </div>
                                <div className="td">
                                    <Input 
                                        type="text" 
                                        value={sr(variant, ['supplier']) || ''}
                                        onChange={e => {this.handle_change_form(['variants', index, 'supplier'], e.target.value)}} 
                                    />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }

}

TikiNewProduct.propTypes = {
    product: PropTypes.object.isRequired,
    additional_fields: PropTypes.array.isRequired,
    on_change: PropTypes.func.isRequired,
};
