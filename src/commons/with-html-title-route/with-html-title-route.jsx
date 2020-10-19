import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import PropTypes from 'prop-types';

class WithHtmlTitleRoute extends Component {

    constructor(props) {
        super(props);
        window.document.title = this.props.htmlTitle || 'SellPro';
    };

    render() {
        const {htmlTitle, ...props} = this.props;
        return (
            <Route {...props} />
        );
    }
}

WithHtmlTitleRoute.propTypes = {
    htmlTitle: PropTypes.string,
};

export default WithHtmlTitleRoute;
