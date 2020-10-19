import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Collapse} from 'reactstrap';

class DelayedLoader extends Component {

    pending_load = null;
    state = {is_loading: false};

    componentDidMount() {
        if (this.props.loading) {
            this._showDelayedLoader();
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.loading && this.props.loading) {
            this._showDelayedLoader();
        } else if (prevProps.loading && !this.props.loading) {
            this._hideLoader();
        }
    };

    componentWillUnmount() {
        if (this.pending_load) clearTimeout(this.pending_load);
    };

    _showDelayedLoader() {
        if (this.pending_load) clearTimeout(this.pending_load);
        this.pending_load = setTimeout(() => {
            this.setState({is_loading: true});
        }, this.props.delayTime);
    };

    _hideLoader() {
        if (this.pending_load) clearTimeout(this.pending_load);
        this.setState({is_loading: false});
    };

    render() {
        return (
            <Collapse isOpen={this.state.is_loading}>
                <div className={`delayed-loader ${this.props.className}`}>
                    {this.props.children}
                </div>
            </Collapse>
        );
    };

}

DelayedLoader.propTypes = {
    loading: PropTypes.bool.isRequired,
    delayTime: PropTypes.number.isRequired,
    className: PropTypes.string,
};

DelayedLoader.defaultProps = {
    loading: false,
    delayTime: 1000,
};

export default DelayedLoader;