import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TableWithItemPattern from "../table-with-item-pattern/table-with-item-pattern";
import uuidv4 from "uuid/v4";

class TableWithItemPatternAndHeadConfig extends Component {

    _tableHead() {
        const {customHead, headConfig} = this.props;
        return (
            customHead
                ? React.createElement(customHead)
                : <tr>
                    {
                        headConfig.map(({title, className, onClick}) => (
                            <th key={uuidv4()} {...{className, onClick}}>{title}</th>
                        ))
                    }
                </tr>
        );
    };

    render() {
        const {
            className, headConfig, items, itemPattern, itemKeyGen, itemProps, customHead, indexOffset,
            ...tableProps
        } = this.props;
        return (
            <TableWithItemPattern
                {...tableProps}
                className={className}
                customHead={this._tableHead.bind(this)}
                items={items}
                itemKeyGen={itemKeyGen}
                itemPattern={itemPattern}
                itemProps={itemProps}
                indexOffset={indexOffset}
            />
        );
    };
}

TableWithItemPatternAndHeadConfig.propTypes = {
    className: PropTypes.string,
    headConfig: PropTypes.array,
    items: PropTypes.array.isRequired,
    itemPattern: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
    itemKeyGen: PropTypes.func,
    itemProps: PropTypes.object,
    customHead: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    indexOffset: PropTypes.number,
};

export default TableWithItemPatternAndHeadConfig;