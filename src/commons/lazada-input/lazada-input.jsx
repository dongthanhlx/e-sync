import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Input} from 'reactstrap';
import DatePicker from '../date-picker/date-picker';
import SelectInput from '../select-input/select-input';
import moment from 'moment';

export default class LazadaInput extends Component {

    render() {
        const {type, options, value, on_change} = this.props;
        switch (type) {
            case "numeric":
                return <Input type="number" value={value} onChange={e => {on_change(e.target.value)}} />
            case "date":
                return <DatePicker 
                    withTime 
                    value={moment(value).valueOf()}
                    onChange={timestamp => {on_change(moment(timestamp).format('YYYY-MM-DD HH:mm'))}}
                />
            case "singleSelect": case "enumInput":
                return <SelectInput
                    items={options}
                    itemIdGen={o => o.name}
                    itemLabelGen={o => o.name}
                    value={value ? {name: value} : {}}
                    onSelect={value => {on_change(value.name)}}
                    onCancel={() => {on_change('')}}
                />
            case "multiSelect": case "multiEnumInput":
                return <SelectInput
                    multiple
                    items={options}
                    itemIdGen={o => o.name}
                    itemLabelGen={o => o.name}
                    value={value ? value.map(v => ({name: v})) : []}
                    onSelect={value => {on_change(value.map(v => v.name))}}
                    onCancel={() => {on_change([])}}
                />
            default:
                return <Input type="text" value={value} onChange={e => {on_change(e.target.value)}} />
        }
    }

}

LazadaInput.propTypes = {
    type: PropTypes.oneOf(["numeric", "text", "richText", "date", "img", "singleSelect", "multiSelect", "enumInput", "multiEnumInput"]),
    options: PropTypes.array.isRequired,
    value: PropTypes.any.isRequired,
    on_change: PropTypes.func.isRequired,
};

LazadaInput.defaultProps = {
    options: [],
};