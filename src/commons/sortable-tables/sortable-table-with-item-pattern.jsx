import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table} from 'reactstrap';
import uuidv4 from 'uuid/v4';
import {produceHeaderClassName, sortByConfig} from "../../utils/sortable-table-utils";

class SortableTableWithItemPattern extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current_sort_config: {},
            is_ascending: true,
        };
        this._handleSortForColumn = this._handleSortForColumn.bind(this);
    };

    _handleSortForColumn(index) {
        const {sortConfig} = this.props;
        if (index === this.state.current_sort_config.column) {
            this.setState({is_ascending: !this.state.is_ascending});
        } else {
            const sort_config = sortConfig.find(config => config.column === index) || null;
            if (sort_config) {
                this.setState({current_sort_config: sort_config, is_ascending: true});
            }
        }
    };

    render() {
        const {
            className, titles, items: raw_items, itemPattern, itemKeyGen, itemProps, customHead, sortConfig,
            ...tableProps
        } = this.props;
        const {current_sort_config, is_ascending} = this.state;
        const items = sortByConfig(raw_items, current_sort_config, is_ascending);
        return (
            <Table {...tableProps} className={`sortable-table-with-item-pattern ${className || ""}`}>
                <thead>
                {
                    customHead
                        ? React.createElement(customHead, {sortConfig, current_sort_config, is_ascending, onHeaderClick: this._handleSortForColumn})
                        : <tr>
                            {
                                titles.map((title, i)=> (
                                    <th
                                        key={uuidv4()}
                                        className={produceHeaderClassName(sortConfig, current_sort_config, is_ascending, i)}
                                        onClick={() => {this._handleSortForColumn(i)}}
                                    >
                                        {title}
                                    </th>
                                ))
                            }
                        </tr>
                }
                </thead>
                <tbody>
                {
                    items.map((item, i) => React.createElement(itemPattern, {
                        key: itemKeyGen ? itemKeyGen(item) : uuidv4(),
                        index: i,
                        item: item,
                        ...itemProps
                    }))
                }
                </tbody>
            </Table>
        );
    }
    
}

SortableTableWithItemPattern.propTypes = {
    className: PropTypes.string,
    titles: PropTypes.array,
    items: PropTypes.array.isRequired,
    itemPattern: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
    itemKeyGen: PropTypes.func,
    itemProps: PropTypes.object,
    sortConfig: PropTypes.array.isRequired,
    customHead: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
};

export default SortableTableWithItemPattern;