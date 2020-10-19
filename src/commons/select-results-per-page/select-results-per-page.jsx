import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Input} from "reactstrap";

class SelectResultsPerPage extends Component {

    render() {
        const {className, value, onChange} = this.props;
        return (
            <Input
                type="select"
                className={`select-results-per-page ${className}`}
                value={value}
                onChange={(e) => {onChange(e.target.value)}}
            >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
            </Input>
        );
    };

}

SelectResultsPerPage.propTypes = {
    className: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
};

export default SelectResultsPerPage;