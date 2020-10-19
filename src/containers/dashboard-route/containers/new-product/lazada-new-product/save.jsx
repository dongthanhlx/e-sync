import React, {Component} from 'react';
import PropTypes, { object, string } from 'prop-types';
import {FormGroup, Label, Input, Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
// import {Editor} from 'react-draft-wysiwyg';
// import {EditorState, convertToRaw} from 'draft-js';
// import d2html from 'draftjs-to-html';
import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';
import {noti} from '../../../../../services/noti-service';
import Dropify from '../../../../../commons/dropify/dropify';
import {upload_static} from '../../../../../api/upload-static';
import {get_lazada_brands} from '../../../../../api/lazada-brand';
import SelectInput from '../../../../../commons/select-input/select-input';
import TableWithItemPattern from '../../../../../commons/table-with-item-pattern/table-with-item-pattern';
import VariationValueTableItem from './variation-value-table-item';
import {make_empty_variation_value} from './general-init-product-form';
import {get_lazada_category_tree} from '../../../../../api/lazada-category-tree';
import CategoryFilter from '../../../../../commons/category-filter/category-filter';
import $ from 'jquery';
import 'slick-carousel';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/docs.css';
import iconEdit from '../../../../../images/crop.svg';
import ListImage from './ListImage';
import Editor from '../../../../../commons/editor/editor';

export default class GeneralNewProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            brands: [],
            category_tree: []
        };
        this.query_brand = null;
        this.handle_html_image_upload = this.handle_html_image_upload.bind(this);
        this.handle_change_form = this.handle_change_form.bind(this);
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

    async api_get_lazada_category_tree() {
        try {
            const category_tree = await get_lazada_category_tree();
            this.setState({category_tree})
        } catch (err) {
            console.error(err);
            noti('error', err);
        }
    }

    get_variation_table_titles() {
        const {product} = this.props;
        const fixed_titles_1 = ['Seller SKU', 'Quantity', 'Original price', 'Sell price']
        const fixed_titles_2 = ['Delete']
        const volatile_titles = [];
        if (sr(product, ['variation_attributes', '0', 'name'])) {
            volatile_titles.push(product.variation_attributes[0].name);
        }
        if (sr(product, ['variation_attributes', '1', 'name'])) {
            volatile_titles.push(product.variation_attributes[1].name);
        }
        return fixed_titles_1.concat(volatile_titles).concat(fixed_titles_2);
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

    handle_change_form = (path, value) => {
        const {product, on_change, on_variations_change} = this.props;
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
    
        if (path[0] === 'variation_attributes' || path[0] === 'variation_values') {
            on_variations_change(new_product);
        }
    }

    addSlide(url) {
        $('.slider-for').slick('slickAdd', `<div><img src=${url} /></div>`);
        $('.slider-nav').slick('slickAdd', `<div><img src=${url} /></div>`);
    }

    render() {
        const {editmode, product, images_key} = this.props;
        const {category_tree, brands} = this.state;
        const images = product.images;
        console.log(images);
        return (
            <div className="general-new-product">
                <FormGroup>
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

                <Row>
                    <Col className='gallery'>
                        <div className="slider-for">
                            
                        </div>

                        <div className="slider-nav">
                            
                        </div>

                        <ListImage 
                            buttonLabel='Edit Image'
                            product={product}
                            add_image={url => this.addSlide(url)}
                            on_change={product => {this.props.on_change(product)}} 
                            on_removed={product => {this.props.on_removed(product)}} 
                            on_variations_change={product => {this.props.on_variations_change(product)}} 
                        />
                    </Col>

                    <Col xs={5}>
                        <div className='border-bottom pb-1'>
                            <FormGroup>
                                <Input 
                                    type="text" id="gp_name" 
                                    value={sr(product, ['name'])}
                                    onChange={e => {this.handle_change_form(['name'], e.target.value)}} 
                                    placeholder='Tên sản phẩm'
                                />
                            </FormGroup>

                            <FormGroup style={{display: '-webkit-inline-box', '-webkit-box-align': 'end'}}>
                                <Label for="gp_original_price" className="required-field">Thương hiệu: </Label>
                                <SelectInput
                                    items={brands}
                                    itemIdGen={brand => brand.brand_id}
                                    itemLabelGen={brand => brand.name}
                                    value={sr(product, ['brand']) ? (brands.find(b => b.name === product.brand) || {}) : {}}
                                    onSearchChange={search => {this.api_get_lazada_brands(search)}}
                                    onSelect={brand => {this.handle_change_form(['brand'], brand.name || '')}}
                                    onCancel={() => {this.handle_change_form(['brand'], '')}}
                                    placeholder='Thương hiệu'
                                />
                            </FormGroup>
                        </div>

                        <div className='border-bottom pt-4'>
                            <FormGroup className='w-25'>
                                <Input 
                                    type="number" id="gp_sell_price" 
                                    value={sr(product, ['sell_price'])}
                                    onChange={e => {this.handle_change_form(['sell_price'], e.target.value)}} 
                                    placeholder='Giá bán'
                                />
                            </FormGroup>

                            <FormGroup className='w-25'>
                                <Input 
                                    type="number" id="gp_original_price" 
                                    value={sr(product, ['original_price'])}
                                    onChange={e => {this.handle_change_form(['original_price'], e.target.value)}}
                                    placeholder='Giá gốc'
                                />
                            </FormGroup>
                        </div>

                        <div className='py-4'>
                            <FormGroup className='w-25' style={{display: '-webkit-inline-box', '-webkit-box-align': 'end'}}>
                                <Label for="gp_original_price" className="required-field">Số lượng </Label>
                                <Input 
                                    type="number" id="gp_quantity" 
                                    value={sr(product, ['quantity'])}
                                    onChange={e => {this.handle_change_form(['quantity'], e.target.value)}} 
                                    placeholder='Số lượng'
                                />
                            </FormGroup>
                        </div>
                    </Col>

                    <Col></Col>
                </Row>

                <div>
                    <Editor
                        design={product.draft__short_description_json}
                        on_change={description => {this.handle_change_form(['draft__short_description'], description)}}
                    />
                </div>
            </div>
        )
    }

}

GeneralNewProduct.propTypes = {
    editmode: PropTypes.bool.isRequired,
    images_key: PropTypes.string.isRequired,
    product: PropTypes.object.isRequired,
    on_change: PropTypes.func.isRequired,
    on_variations_change: PropTypes.func.isRequired,
    brand_name: PropTypes.string,
};

GeneralNewProduct.defaultProps = {
    editmode: false,
};