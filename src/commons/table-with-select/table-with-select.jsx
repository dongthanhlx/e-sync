import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CustomInput, Table} from 'reactstrap';
import uuidv4 from 'uuid/v4';

export default class TableWithSelect extends Component {

    table_id = uuidv4();

    _renderTableHead() {
        const {items, renderConfig, onSelectAllItem} = this.props;
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
                        renderConfig.map(config => (
                            <th key={uuidv4()}>{config.title}</th>
                        ))
                    }
                </tr>
            </thead>
        );
    };

    _renderTableBody() {
        const {items, itemKey, itemId, renderConfig, onSelectOneItem} = this.props;
        return (
            <tbody>{
                items.map((item, row) => (
                    <tr key={itemKey ? itemKey(item) : uuidv4()}>
                        <td>
                            <CustomInput
                                type="checkbox"
                                id={`select-one-${this.table_id}-${row}`}
                                checked={item.isSelected ? item.isSelected : false}
                                onChange={() => {onSelectOneItem(itemId ? itemId(item) : item.id)}}
                            />
                        </td>
                        {
                            renderConfig.map(config => (
                                <td key={uuidv4()}>{config.render(item)}</td>
                            ))
                        }
                    </tr>
                ))
            }</tbody>
        );
    };

    render() {
        const {items, itemKey, itemId, renderConfig, onSelectOneItem, onSelectAllItem, ...tableProps} = this.props;
        return (
            <Table {...tableProps}>
                {this._renderTableHead()}
                {this._renderTableBody()}
            </Table>
        );
    };

};

TableWithSelect.propTypes = {
    ...Table.propTypes,
    items: PropTypes.array.isRequired,
    itemKey: PropTypes.func,
    itemId: PropTypes.func,
    renderConfig: PropTypes.array.isRequired,
    onSelectOneItem: PropTypes.func,
    onSelectAllItem: PropTypes.func,
};