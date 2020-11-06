import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FormGroup, Label, Input, Button} from 'reactstrap';
import {Editor} from 'react-draft-wysiwyg';
import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';
import {noti} from '../../../../../services/noti-service';
import Dropify from '../../../../../commons/dropify/dropify';
import {upload_static} from '../../../../../api/upload-static';
import {get_lazada_brands} from '../../../../../api/lazada-brand';
import SelectInput from '../../../../../commons/select-input/select-input';
import TableWithItemPattern from '../../../../../commons/table-with-item-pattern/table-with-item-pattern';
import VariationValueTableItem from './variation-value-table-item';
import {make_empty_variation_value} from './general-init-product-form';

export default class GeneralNewProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            brands: [],
        };
        this.query_brand = null;
        this.handle_html_image_upload = this.handle_html_image_upload.bind(this);
        this.handle_change_form = this.handle_change_form.bind(this);
    }

    componentDidMount() {
        if (this.props.brand_name) {
            this.api_get_lazada_brands(this.props.brand_name);
        }
    }

    componentDidUpdate(prev_props) {
        if (prev_props.brand_name !== this.props.brand_name) {
            this.api_get_lazada_brands(this.props.brand_name);
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

    handle_change_form(path, value) {
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

    render() {
        const {editmode, product, images_key} = this.props;
        const {brands} = this.state;
        return (
            <div className="general-new-product">
                <FormGroup>
                    <Label for="gp_name" className="required-field">Product name</Label>
                    <Input 
                        type="text" id="gp_name" 
                        value={sr(product, ['name'])}
                        onChange={e => {this.handle_change_form(['name'], e.target.value)}} 
                    />
                </FormGroup>
                <FormGroup className="mb-5">
                    <Label for="gp_brand" className="required-field">Brand - Lazada & Tiki</Label>
                    <SelectInput
                        items={brands}
                        itemIdGen={brand => brand.brand_id}
                        itemLabelGen={brand => brand.name}
                        value={sr(product, ['brand']) ? (brands.find(b => b.name === product.brand) || {}) : {}}
                        onSearchChange={search => {this.api_get_lazada_brands(search)}}
                        onSelect={brand => {this.handle_change_form(['brand'], brand.name || '')}}
                        onCancel={() => {this.handle_change_form(['brand'], '')}}
                    />
                </FormGroup>
                <div className="attributes-group-0">
                    <FormGroup>
                        <Label for="gp_sellersku" className="required-field">Seller SKU</Label>
                        <Input 
                            type="text" id="gp_sellersku" 
                            value={sr(product, ['seller_sku'])}
                            onChange={e => {this.handle_change_form(['seller_sku'], e.target.value)}} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_quantity" className="required-field">Quantity</Label>
                        <Input 
                            type="number" id="gp_quantity" 
                            value={sr(product, ['quantity'])}
                            onChange={e => {this.handle_change_form(['quantity'], e.target.value)}} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_original_price" className="required-field">Original price</Label>
                        <Input 
                            type="number" id="gp_original_price" 
                            value={sr(product, ['original_price'])}
                            onChange={e => {this.handle_change_form(['original_price'], e.target.value)}}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_sell_price" className="required-field">Sell price (Special price)</Label>
                        <Input 
                            type="number" id="gp_sell_price" 
                            value={sr(product, ['sell_price'])}
                            onChange={e => {this.handle_change_form(['sell_price'], e.target.value)}} 
                        />
                    </FormGroup>
                </div>
                <div className="mb-5 attributes-group-1">
                    <FormGroup>
                        <Label for="gp_package_width" className="required-field">Package width (cm)</Label>
                        <Input 
                            type="number" id="gp_package_width" 
                            value={sr(product, ['package_width'])}
                            onChange={e => {this.handle_change_form(['package_width'], e.target.value)}} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_package_length" className="required-field">Package length (cm)</Label>
                        <Input 
                            type="number" id="gp_package_length" 
                            value={sr(product, ['package_length'])}
                            onChange={e => {this.handle_change_form(['package_length'], e.target.value)}} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_package_height" className="required-field">Package height (cm)</Label>
                        <Input 
                            type="number" id="gp_package_height" 
                            value={sr(product, ['package_height'])}
                            onChange={e => {this.handle_change_form(['package_height'], e.target.value)}} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_package_weight" className="required-field">Package weight (kg)</Label>
                        <Input 
                            type="number" id="gp_package_weight" 
                            value={sr(product, ['package_weight'])}
                            onChange={e => {this.handle_change_form(['package_weight'], e.target.value)}} 
                        />
                    </FormGroup>
                </div>
                <FormGroup className="mb-5">
                    <Label for="gp_images" className="required-field">Product images</Label>
                    <div className="form-images" key={images_key}>
                        {
                            ['0', '1', '2', '3', '4'].map(i => (
                                <Dropify key={i}
                                    default_url={sr(product, ['images', i])}
                                    on_change={url => {this.handle_change_form(['images', i], url)}} 
                                    on_removed={() => {this.handle_change_form(['images', i], '')}} 
                                />
                            ))
                        }
                    </div>
                </FormGroup>
                <FormGroup>
                    <Label for="gp_short_description" className="required-field">
                        Short Description
                    </Label>
                    <Editor
                        wrapperClassName="short-description-editor-wrapper"
                        editorClassName="short-description-editor-editor"
                        editorState={sr(product, ['draft__short_description'])}
                        onEditorStateChange={description => {this.handle_change_form(['draft__short_description'], description)}}
                        toolbar={{
                            image: {
                                urlEnabled: true,
                                uploadEnabled: true,
                                previewImage: true,
                                uploadCallback: this.handle_html_image_upload,
                            }
                        }}
                    />
                </FormGroup>
                <FormGroup className="mb-5">
                    <Label for="gp_description" className="required-field">
                        Description
                    </Label>
                    <Editor
                        wrapperClassName="description-editor-wrapper"
                        editorClassName="description-editor-editor"
                        editorState={sr(product, ['draft__description'])}
                        onEditorStateChange={description => {this.handle_change_form(['draft__description'], description)}}
                        toolbar={{
                            image: {
                                urlEnabled: true,
                                uploadEnabled: true,
                                previewImage: true,
                                uploadCallback: this.handle_html_image_upload,
                            }
                        }}
                    />
                </FormGroup>
                <div className="mb-5 attributes-group-2">
                    <FormGroup>
                        <Label for="gp_variation_attribute_1_name" className="required-field">Variation attribute 1 - Name</Label>
                        <Input 
                            type="text" id="gp_variation_attribute_1_name" 
                            disabled={editmode}
                            value={sr(product, ['variation_attributes', '0', 'name'])}
                            onChange={e => {this.handle_change_form(['variation_attributes', '0', 'name'], e.target.value)}} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_variation_attribute_1_options" className="required-field">
                            Variation attribute 1 - Options - separated by comma ","
                        </Label>
                        <Input 
                            type="text" id="gp_variation_attribute_1_options" 
                            disabled={editmode}
                            value={sr(product, ['variation_attributes', '0', 'options']).join(', ')}
                            onChange={e => {
                                this.handle_change_form(['variation_attributes', '0', 'options'], e.target.value.trim().split(/\s*,\s*/))
                            }} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_variation_attribute_2_name" className="required-field">Variation attribute 2 - Name</Label>
                        <Input 
                            type="text" id="gp_variation_attribute_2_name" 
                            disabled={editmode}
                            value={sr(product, ['variation_attributes', '1', 'name'])}
                            onChange={e => {this.handle_change_form(['variation_attributes', '1', 'name'], e.target.value)}} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gp_variation_attribute_2_options" className="required-field">
                            Variation attribute 2 - Options - separated by comma ","
                        </Label>
                        <Input 
                            type="text" id="gp_variation_attribute_2_options" 
                            disabled={editmode}
                            value={sr(product, ['variation_attributes', '1', 'options']).join(', ')}
                            onChange={e => {
                                this.handle_change_form(['variation_attributes', '1', 'options'], e.target.value.trim().split(/\s*,\s*/))
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
                                        this.handle_change_form(
                                            ['variation_values'], 
                                            [...sr(product, ['variation_values']), make_empty_variation_value()]
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
                            items={sr(product, ['variation_values'])}
                            itemPattern={VariationValueTableItem}
                            itemKeyGen={item => item.id}
                            itemProps={{
                                editmode,
                                variation_attributes: sr(product, ['variation_attributes']),
                                variation_values: sr(product, ['variation_values']),
                                on_change: this.handle_change_form,
                            }}
                        />
                    </div>
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