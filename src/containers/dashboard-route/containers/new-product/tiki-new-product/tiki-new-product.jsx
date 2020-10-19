import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FormGroup, Label, Input} from 'reactstrap';
import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';
import {noti} from '../../../../../services/noti-service';
import {get_tiki_category_tree} from '../../../../../api/tiki-category-tree';
import CategoryFilter from '../../../../../commons/category-filter/category-filter';
import {snake_to_title} from '../../../../../utils/snake_to_title';
import SelectInput from '../../../../../commons/select-input/select-input';
import {TIKI_INVENTORY_TYPES} from '../../../../../constants/tiki-inventory-type';
import $ from 'jquery';

export default class TikiNewProduct extends Component {

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
            category_tree: []
        };
    }

    componentDidMount() {
        this.api_get_category_tree();
        TikiNewProduct.re_align_variations_table(this.props.product.option_attributes);
    }

    componentWillUnmount() {
        this.setState({
            category_tree: []
        })
    }

    componentDidUpdate() {
        TikiNewProduct.re_align_variations_table(this.props.product.option_attributes);
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
        on_change(new_product);
    }

    render() {
        const {product, additional_fields} = this.props;
        const {category_tree} = this.state;
        return (
            <div className="tiki-new-product">
                <FormGroup className="mb-5">
                    <Label for="tp_category" className="required-field">Category</Label>
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
                {
                    Array.isArray(additional_fields) && additional_fields.length > 0
                        ? <div className="mb-5 additional-attributes">
                            {
                                additional_fields.sort((a, b) => parseInt(b.is_required) - parseInt(a.is_required)).map(field => (
                                    <FormGroup key={field.id}>
                                        <Label for={`tp_${field.code}`} className={field.is_required ? 'required-field' : ''}>
                                            {snake_to_title(field.code)}
                                        </Label>
                                        <Input 
                                            type="text" id={`tp_${field.code}`} 
                                            placeholder={field.example ? `Example: ${field.example}` : ''}
                                            value={sr(product, TikiNewProduct.make_attribute_path(field)) || ''}
                                            onChange={e => {this.handle_change_form(TikiNewProduct.make_attribute_path(field), e.target.value)}} 
                                        />
                                    </FormGroup>
                                ))
                            }
                        </div>
                        : null
                }
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
