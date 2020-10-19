import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Input} from 'reactstrap';
import DatePicker from '../date-picker/date-picker';
import SelectInput from '../select-input/select-input';
import moment from 'moment';

export default class ShopeeInput extends Component {

    render() {
        const {type, options, value, on_change} = this.props;
        const [input_type, attribute_type] = type.split(':');
        switch (input_type) {
            case "TEXT_FILED":
                switch (attribute_type) {
                    case "INT_TYPE": case "FLOAT_TYPE":
                        return <Input type="number" value={value} onChange={e => {on_change(e.target.value)}} />
                    case "STRING_TYPE": case "ENUM_TYPE":
                        return <Input type="text" value={value} onChange={e => {on_change(e.target.value)}} />
                    case "DATE_TYPE":
                        return <DatePicker 
                            withTime 
                            value={moment(value).valueOf()}
                            onChange={timestamp => {on_change(moment(timestamp).format('YYYY-MM-DD HH:mm'))}}
                        />
                    case "TIMESTAMP_TYPE":
                        return <DatePicker 
                            withTime 
                            value={parseInt(value)}
                            onChange={timestamp => {on_change(timestamp)}}
                        />
                    default:
                        return <Input type="text" value={value} onChange={e => {on_change(e.target.value)}} />
                }
            case "DROP_DOWN": case "COMBO_BOX":
                return <SelectInput
                    items={options}
                    itemIdGen={o => o.original_value}
                    itemLabelGen={o => o.original_value}
                    value={{original_value: value}}
                    onSelect={value => {on_change(value.original_value || '')}}
                    onCancel={() => {on_change('')}}
                />
            default:
                return <Input type="text" value={value} onChange={e => {on_change(e.target.value)}} />
        }
    }

}

ShopeeInput.propTypes = {
    type: PropTypes.oneOf([
        "DROP_DOWN:INT_TYPE",
        "DROP_DOWN:STRING_TYPE",
        "DROP_DOWN:ENUM_TYPE",
        "DROP_DOWN:FLOAT_TYPE",
        "DROP_DOWN:DATE_TYPE",
        "DROP_DOWN:TIMESTAMP_TYPE",
        "TEXT_FILED:INT_TYPE",
        "TEXT_FILED:STRING_TYPE",
        "TEXT_FILED:ENUM_TYPE",
        "TEXT_FILED:FLOAT_TYPE",
        "TEXT_FILED:DATE_TYPE",
        "TEXT_FILED:TIMESTAMP_TYPE",
        "COMBO_BOX:INT_TYPE",
        "COMBO_BOX:STRING_TYPE",
        "COMBO_BOX:ENUM_TYPE",
        "COMBO_BOX:FLOAT_TYPE",
        "COMBO_BOX:DATE_TYPE",
        "COMBO_BOX:TIMESTAMP_TYPE"
    ]),
    options: PropTypes.array.isRequired,
    value: PropTypes.any.isRequired,
    on_change: PropTypes.func.isRequired,
};

ShopeeInput.defaultProps = {
    options: [],
};