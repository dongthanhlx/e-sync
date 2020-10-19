import React, { Component } from 'react';
import propTypes from 'prop-types';
import { PaginationItem as PaginationIT, PaginationLink } from 'reactstrap';

class PaginationItem extends Component {

    render() {
        const { value, isSelected } = this.props;

        return (
            <PaginationIT active={isSelected}>
                <PaginationLink
                    onClick={() => {
                        if (!isSelected)
                            this.props.onSelect(value - 1);
                    }}
                    disabled={isSelected}
                >
                    {value}
                </PaginationLink>
            </PaginationIT>
        )
    }
}

PaginationItem.propTypes = {
    value: propTypes.number,
    isSelected: propTypes.bool,
    onSelect: propTypes.func
};

export default PaginationItem;
