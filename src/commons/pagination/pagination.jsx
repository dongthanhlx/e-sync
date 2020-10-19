import React, { Component } from 'react';
import propTypes from 'prop-types';
import { PaginationItem as PanginationIT, PaginationLink, Pagination as PaginationReactstrap } from 'reactstrap';
import PaginationItem from "./pagination-item";

class Pagination extends Component {

    _handlePagination = (c, m) => {
        let current = c,
            last = m,
            delta = 2,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            l;

        for (let i = 1; i <= last; i++) {
            if (i === 1 || i === last || (i >= left && i < right)) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }
        return rangeWithDots;
    }

    _renderPaginationItems() {
        const { selectedPage, pageCount } = this.props;

        const items = this
            ._handlePagination(selectedPage + 1, pageCount)
            .map((item, index) => {
                return (item === '...')
                    ? (
                        <PanginationIT key={index}>
                            <PaginationLink>
                                ...
                            </PaginationLink>
                        </PanginationIT>
                    )
                    : (<PaginationItem
                        key={index}
                        isSelected={selectedPage + 1 === item}
                        onSelect={(value) => {
                            this
                                .props
                                .onSelectPage(value);
                        }}
                        value={item} />)
            })
        return items;
    }

    render() {
        const {className} = this.props;
        const disable_pervious = this.props.selectedPage === 0;
        const disable_next = this.props.selectedPage === this.props.pageCount - 1;
        return (
            <PaginationReactstrap className={className}>
                <PanginationIT
                    disabled={disable_pervious}
                    onClick={() => {
                        if (!disable_pervious) {
                            this.props.onSelectPage(this.props.selectedPage - 1);
                        }
                    }}>
                    <PaginationLink previous />
                </PanginationIT>
                {this._renderPaginationItems()}
                <PanginationIT
                    disabled={disable_next}
                    onClick={() => {
                        if (!disable_next) {
                            this.props.onSelectPage(this.props.selectedPage + 1);
                        }
                    }}>
                    <PaginationLink next />
                </PanginationIT>
            </PaginationReactstrap>
        )
    }
}

Pagination.propTypes = {
    className: propTypes.string,
    selectedPage: propTypes.number,
    pageCount: propTypes.number,
    onSelectPage: propTypes.func
};

Pagination.defaultProps = {
    className: '',
};

export default Pagination;
