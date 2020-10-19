import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FormGroup, Label, Input} from 'reactstrap';
import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';
import {noti} from '../../../../../services/noti-service';
import {get_shopee_category_tree} from '../../../../../api/shopee-category-tree';
import CategoryFilter from '../../../../../commons/category-filter/category-filter';
import ShopeeInput from '../../../../../commons/shopee-input/shopee-input';
import {SHOPEE_PRODUCT_STATUS} from '../../../../../constants/shopee-product-status';
import {SHOPEE_PRODUCT_CONDITION} from '../../../../../constants/shopee-product-condition';
import {get_shopee_logistics} from '../../../../../api/shopee-logistics';
import SelectInput from '../../../../../commons/select-input/select-input';

export default class ShopeeNewProduct extends Component {

    static make_attribute_path(field) {
        return ['draft__attributes', field.attribute_id];
    }

    constructor(props) {
        super(props);
        this.state = {
            category_tree: [],
            logistics: [],
        };
    }

    componentDidMount() {
        this.api_get_category_tree();
        this.api_get_logistics();
    }

    componentWillUnmount() {
        this.setState({
            category_tree: [],
            logistics: [],
        })
    }

    async api_get_category_tree() {
        try {
            const category_tree = await get_shopee_category_tree();
            this.setState({category_tree});
        } catch (err) {
            console.error(err);
            noti('error', err);
        }
    }

    async api_get_logistics() {
        try {
            const logistics = await get_shopee_logistics();
            this.setState({logistics});
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
        const {category_tree, logistics} = this.state;
        return (
            <div className="shopee-new-product">
                <FormGroup className="mb-5">
                    <Label for="sp_category" className="required-field">Category</Label>
                    <CategoryFilter
                        className="shopee-category-filter"
                        categories={category_tree}
                        idGen={cat => cat.category_id}
                        nameGen={cat => cat.category_name}
                        childrenGen={cat => cat.children}
                        onChangeCategory={cat => {this.handle_change_form(['category_id'], cat.category_id)}}
                        onAbortCategory={() => {this.handle_change_form(['category_id'], '')}}
                    />
                </FormGroup>
                {
                    Array.isArray(additional_fields) && additional_fields.length > 0
                        ? <div className="mb-5 additional-attributes">
                            {
                                additional_fields.sort((a, b) => b.is_mandatory - a.is_mandatory).map(field => (
                                    <FormGroup key={field.attribute_id}>
                                        <Label className={field.is_mandatory ? 'required-field' : ''}>
                                            {field.attribute_name}
                                        </Label>
                                        <ShopeeInput
                                            type={`${field.input_type}:${field.attribute_type}`}
                                            options={field.values}
                                            value={sr(product, ShopeeNewProduct.make_attribute_path(field)) || ''}
                                            on_change={value => {this.handle_change_form(ShopeeNewProduct.make_attribute_path(field), value)}} 
                                        />
                                    </FormGroup>
                                ))
                            }
                        </div>
                        : null
                }
                <div className="mb-5 attributes-group-0">
                    <FormGroup>
                        <Label for="sp_condition" className="required-field">Product condition</Label>
                        <Input 
                            type="select" id="sp_condition" 
                            value={sr(product, ['condition'])}
                            onChange={e => {this.handle_change_form(['condition'], e.target.value)}}
                        >
                            <option value={SHOPEE_PRODUCT_CONDITION.new}>New</option>
                            <option value={SHOPEE_PRODUCT_CONDITION.used}>Used</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="sp_status" className="required-field">Product status</Label>
                        <Input 
                            type="select" id="sp_condition" 
                            value={sr(product, ['status'])}
                            onChange={e => {this.handle_change_form(['status'], e.target.value)}}
                        >
                            <option value={SHOPEE_PRODUCT_STATUS.normal}>Show</option>
                            <option value={SHOPEE_PRODUCT_STATUS.unlist}>Hidden</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="sp_logistics" className="required-field">Logistics</Label>
                        <SelectInput 
                            multiple
                            items={logistics}
                            itemIdGen={l => l.logistic_id}
                            itemLabelGen={l => l.logistic_name}
                            value={sr(product, ['logistics'])}
                            onSelect={logistics => {this.handle_change_form(['logistics'], logistics)}}
                            onCancel={() => {this.handle_change_form(['logistics'], [])}}
                        />
                    </FormGroup>
                </div>
            </div>
        )
    }

}

ShopeeNewProduct.propTypes = {
    product: PropTypes.object.isRequired,
    additional_fields: PropTypes.array.isRequired,
    on_change: PropTypes.func.isRequired,
};
