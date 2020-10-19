import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'reactstrap';

function ExpandButton({isExpand, onClick}) {
    return (
        <Button color="light" onClick={onClick}>
            <i className={`fa ${isExpand ? 'fa-minus' : 'fa-plus'}`} />
        </Button>
    );
}

ExpandButton.propTypes = {
    isExpand: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};

export default ExpandButton;