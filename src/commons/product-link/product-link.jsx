import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ProductLink extends Component {
    render() {
        const {href, className} = this.props;
        return (
            <a className={`product-link ${className}`} href={href} target="_blank" rel="noopener noreferrer">
                <i className="fa fa-external-link-alt" />
            </a>
        );
    }
}

ProductLink.propTypes = {
    href: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default ProductLink;