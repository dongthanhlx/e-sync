import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';
import {Button, Input} from 'reactstrap';

export default class VariationValueTableItem extends Component {

    render() {
        const {item, index, editmode, variation_attributes, variation_values, on_change_general} = this.props;
        return (
            <tr>
                <td>
                    <Input 
                        disabled={editmode}
                        type="text"
                        value={item.seller_sku} 
                        onChange={e => {on_change_general(['variation_values', `${index}`, 'seller_sku'], e.target.value)}} 
                    />
                </td>
                <td>
                    <Input 
                        type="number"
                        value={item.quantity} 
                        onChange={e => {on_change_general(['variation_values', `${index}`, 'quantity'], e.target.value)}} 
                    />
                </td>
                <td>
                    <Input 
                        type="number" 
                        value={item.original_price} 
                        onChange={e => {on_change_general(['variation_values', `${index}`, 'original_price'], e.target.value)}} 
                    />
                </td>
                <td>
                    <Input 
                        type="number" 
                        value={item.sell_price} 
                        onChange={e => {on_change_general(['variation_values', `${index}`, 'sell_price'], e.target.value)}} 
                    />
                </td>
                {
                    sr(variation_attributes, ['0', 'name'])
                        ? <td className="volatile-cell">
                            <div>
                                {
                                    variation_attributes[0].options.map((op, i) => (
                                        <Button 
                                            key={op}
                                            disabled={editmode}
                                            outline={item.options_index[0] !== i}
                                            onClick={e => {on_change_general(['variation_values', `${index}`, 'options_index', '0'], i)}}
                                        >
                                            {op}
                                        </Button>
                                    ))
                                }
                            </div>
                        </td>
                        : null
                }
                {
                    sr(variation_attributes, ['1', 'name'])
                        ? <td className="volatile-cell">
                            <div>
                                {
                                    variation_attributes[1].options.map((op, i) => (
                                        <Button
                                            key={op}
                                            disabled={editmode}
                                            outline={item.options_index[1] !== i}
                                            onClick={e => {on_change_general(['variation_values', `${index}`, 'options_index', '1'], i)}}
                                        >
                                            {op}
                                        </Button>
                                    ))
                                }
                            </div>
                        </td>
                        : null
                }
                <td>
                    <Button 
                        color="danger" 
                        disabled={editmode} 
                        onClick={e => {on_change_general(['variation_values'], variation_values.filter(v => v.id !== item.id))}}
                    >
                        <i className="fa fa-trash-alt" />
                    </Button>
                </td>
            </tr>
        )
    }

}

VariationValueTableItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    editmode: PropTypes.bool.isRequired,
    variation_attributes: PropTypes.array.isRequired,
    variation_values: PropTypes.array.isRequired,
    on_change_general: PropTypes.func.isRequired,
};

VariationValueTableItem.defaultProps = {
    editmode: false,
};