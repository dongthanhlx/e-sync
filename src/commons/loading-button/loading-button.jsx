import React from 'react';
import {Button, Spinner} from 'reactstrap';
import PropTypes from 'prop-types';

export default function LoadingButton({loading, disableWhileLoading, className, children, ...props}) {
    return (
        <Button className={`loading-button font-weight-bold blue-gradient ${className}`} disabled={disableWhileLoading ? loading : false} {...props}>
            <span className={loading ? 'button-label' : ''} size='lg'>{children}</span>
            {loading ? <Spinner size="lg" className="button-spinner" /> : null}
        </Button>
    );
};

LoadingButton.propTypes = {
    ...Button.propTypes,
    className: PropTypes.string,
    loading: PropTypes.bool,
    disableWhileLoading: PropTypes.bool,
};

LoadingButton.defaultProps = {
    className: '',
    disableWhileLoading: true,
};
