import React from 'react';
import propTypes from "prop-types";
import {Spinner} from 'reactstrap';

class FallbackSpinner extends React.Component {
    mounted = false;
    state = {shown: false};

    componentDidMount() {
        this.mounted = true;
        if (!this.state.shown) {
            setTimeout(() => {
                if (this.mounted) {
                    this.setState({shown: true});
                }
            }, this.props.fallback)
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        const {shown} = this.state;
        const {type, size, color} = this.props;
        return shown ? (
            <Spinner type={type} size={size} color={color} className="fallback-spinner" />
        ) : null;
    }
}

FallbackSpinner.defaultProps = {
    type: 'border',
    color: 'primary',
    fallback: 2000,
};

FallbackSpinner.propTypes = {
    size: propTypes.oneOf(['sm']),
    type: propTypes.oneOf(['border', 'grow']),
    color: propTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
    fallback: propTypes.number,
};

export default FallbackSpinner;
