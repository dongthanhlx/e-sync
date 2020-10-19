import React from 'react';
import PropTypes from 'prop-types';
import {Table} from 'reactstrap';
import uuidv4 from 'uuid/v4';

export default function TableWithItemPattern(props) {
    const {
        className, titles, items, itemPattern, itemKeyGen, itemProps, customHead, indexOffset,
        ...tableProps
    } = props;
    return (
        <Table {...tableProps} className={`table ${props.className || ""}`}>
            <thead>
                {
                    props.customHead
                        ? React.createElement(props.customHead)
                        : <tr>
                            {
                                props.titles.map((title) => (
                                    <th key={uuidv4()}>{title}</th>
                                ))
                            }
                        </tr>
                }
            </thead>
            <tbody>
                {
                    props.items.map((item, i) => (
                        <props.itemPattern
                            key={itemKeyGen ? itemKeyGen(item) : uuidv4()}
                            {...props.itemProps}
                            index={indexOffset + i}
                            item={item}
                        />
                    ))
                }
            </tbody>
        </Table>
    );
};

TableWithItemPattern.propTypes = {
    className: PropTypes.string,
    titles: PropTypes.array,
    items: PropTypes.array.isRequired,
    itemPattern: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
    itemKeyGen: PropTypes.func,
    itemProps: PropTypes.object,
    customHead: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    indexOffset: PropTypes.number,
};

TableWithItemPattern.defaultProps = {
    indexOffset: 0,
};