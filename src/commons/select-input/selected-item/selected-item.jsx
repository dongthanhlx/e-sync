import React from 'react';
import PropTypes from 'prop-types';

function SelectedItem({item, multiple, itemLabelGen, onDelete}) {
    return (
        <span className="multiple-selected-item">
            <span className={multiple ? 'item-name' : ''}>{itemLabelGen(item)}</span>
            {multiple ? <i className="fa fa-times small" onClick={() => {onDelete(item)}}/> : null}
        </span>
    );
}

SelectedItem.propTypes = {
    item: PropTypes.any.isRequired,
    multiple: PropTypes.bool,
    itemLabelGen: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

SelectedItem.defaultProps = {
    onDelete: () => {},
};

export default SelectedItem;