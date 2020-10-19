import React from 'react';
import PropTypes from 'prop-types';

export default function Content(props) {
    return (
        <div
            className={
                `sel-content ${
                    props.container ? (
                        props.fluid
                        ? "container-fluid"
                        : "container"
                    ) : "normal"
                } ${
                    props.nopadding ? 'no-padding' : ''
                } ${props.className || ''}`
            }
        >
            {props.children}
        </div>
    );
};

Content.propTypes = {
    className: PropTypes.string,
    container: PropTypes.bool,
    fluid: PropTypes.bool,
    nopadding: PropTypes.bool,
};