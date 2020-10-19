import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CustomInput, Table} from 'reactstrap';
import uuidv4 from 'uuid/v4';
import {produceHeaderClassName, sortByConfig} from "../../utils/sortable-table-utils";

export default class SortableTableWithSelect extends Component {

    constructor(props) {
        super(props);
        this.table_id = uuidv4();
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

    _renderTableHead() {
        const {items, renderConfig, onSelectAllItem, sortConfig} = this.props;
        const {current_sort_config, is_ascending} = this.state;
        return (
            <thead>
            <tr>
                <th>
                    <CustomInput
                        type="checkbox"
                        id={`select-all-${this.table_id}`}
                        checked={
                            items.length > 0 ? (
                                items.every(item => item.isSelected)
                            ) : false
                        }
                        onChange={(e) => {onSelectAllItem(e.target.checked)}}
                    />
                </th>
                {
                    renderConfig.map((config, i) => (
                        <th
                            key={uuidv4()}
                            className={produceHeaderClassName(sortConfig, current_sort_config, is_ascending, i)}
                            onClick={() => {this._handleSortForColumn(i)}}
                        >
                            {config.title}
                        </th>
                    ))
                }
            </tr>
            </thead>
        );
    };

    _renderTableBody() {
        const {items: raw_items, itemKeyGen, renderConfig, onSelectOneItem} = this.props;
        const {current_sort_config, is_ascending} = this.state;
        const items = sortByConfig(raw_items, current_sort_config, is_ascending);
        return (
            <tbody>{
                items.map((item, row) => (
                    <tr key={itemKeyGen ? itemKeyGen(item) : uuidv4()}>
                        <td>
                            <CustomInput
                                type="checkbox"
                                id={`select-one-${this.table_id}-${row}`}
                                checked={item.isSelected ? item.isSelected : false}
                                onChange={() => {onSelectOneItem(item)}}
                            />
                        </td>
                        {
                            renderConfig.map(config => (
                                <td key={uuidv4()}>{config.render(item, row)}</td>
                            ))
                        }
                    </tr>
                ))
            }</tbody>
        );
    };

    render() {
        const {className, items, itemKeyGen, renderConfig, onSelectOneItem, onSelectAllItem, sortConfig, ...tableProps} = this.props;
        return (
            <Table className={`sortable-table-with-select ${className || ''}`} {...tableProps}>
                {this._renderTableHead()}
                {this._renderTableBody()}
            </Table>
        );
    };

};

SortableTableWithSelect.propTypes = {
    ...Table.propTypes,
    className: PropTypes.string,
    items: PropTypes.array.isRequired,
    itemKeyGen: PropTypes.func,
    renderConfig: PropTypes.array.isRequired,
    onSelectOneItem: PropTypes.func,
    onSelectAllItem: PropTypes.func,
    sortConfig: PropTypes.array.isRequired,
};