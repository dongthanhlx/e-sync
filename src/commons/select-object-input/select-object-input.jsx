import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Input} from 'reactstrap';
import {toString} from "../../utils/tostring-utils";

class SelectObjectInput extends Component {

    _handleSelectItem(value) {
        const {items, valueGen, onSelectItem} = this.props;
        onSelectItem(items.find(item => toString(valueGen(item)) === toString(value)));
    };

    render() {
        const {
            items, value, hasEmptyValue,
            keyGen, valueGen, labelGen,
            onSelectItem, className,
            ...props
        } = this.props;
        return (
            <Input
                type="select"
                className={className}
                value={valueGen(value)}
                onChange={(e) => {this._handleSelectItem(e.target.value)}}
                {...props}
            >
                {
                    hasEmptyValue ? <option disabled value="" /> : null
                }
                {
                    items.map(item => ( <option key={keyGen(item)} value={valueGen(item)}>{labelGen(item)}</option> ))
                }
            </Input>
        );
    }

}

SelectObjectInput.propTypes = {
    items: PropTypes.array.isRequired,
    value: PropTypes.object,
    hasEmptyValue: PropTypes.bool,
    keyGen: PropTypes.func.isRequired,
    valueGen: PropTypes.func.isRequired,
    labelGen: PropTypes.func.isRequired,
    onSelectItem: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default SelectObjectInput;