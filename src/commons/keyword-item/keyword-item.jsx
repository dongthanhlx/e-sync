import React from 'react';
import PropTypes from 'prop-types';

function KeywordItem({keyword, labelGen, onDeleteClick}) {
    return (
        <span className="keyword-item">
            {labelGen(keyword)}
            {onDeleteClick ? <i className="fa fa-times text-secondary small" onClick={() => {onDeleteClick(keyword)}} /> : null}
        </span>
    );
}

KeywordItem.propTypes = {
    keyword: PropTypes.object.isRequired,
    labelGen: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func,
};

export default KeywordItem;