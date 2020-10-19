import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FormGroup, Label, Input} from 'reactstrap';
import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';
import {noti} from '../../../../../services/noti-service';
import {get_lazada_category_tree} from '../../../../../api/lazada-category-tree';
import CategoryFilter from '../../../../../commons/category-filter/category-filter';
import LazadaInput from '../../../../../commons/lazada-input/lazada-input';
import DatePicker from '../../../../../commons/date-picker/date-picker';
import moment from 'moment';

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
        };
    }

    componentDidMount() {
        this.api_get_lazada_category_tree();
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

    render() {
        const {product, additional_fields} = this.props;
        const {category_tree} = this.state;
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
            </div>
        )
    }

}

LazadaNewProduct.propTypes = {
    product: PropTypes.object.isRequired,
    additional_fields: PropTypes.array.isRequired,
    on_change: PropTypes.func.isRequired,
};