import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Input} from 'reactstrap';
import {toNaturalFormattedString, toNaturalNumberString} from "../../utils/number-format-utils";

class NaturalNumberInput extends Component {

    render() {
        const {value, onChange, ...props} = this.props;
        return (
            <Input
                {...props}
                value={toNaturalFormattedString(value)}
                onChange={(e) => {onChange(toNaturalNumberString(e.target.value))}}
            />
        );
    }

}

NaturalNumberInput.propTypes = {
    ...Input.propTypes,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default NaturalNumberInput;