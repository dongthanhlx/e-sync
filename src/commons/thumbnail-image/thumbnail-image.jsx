import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ThumbnailImage extends Component {

    render() {
        const {src, link, className} = this.props;
        return src 
            ? link
                ? <a href={src} target="_blank" rel="noopener noreferrer">
                    <img className={`thumbnail-image ${className}`} src={src} alt="thumbnail" />
                </a>
                : <img className={`thumbnail-image ${className}`} src={src} alt="thumbnail" />
            : 'loading';
    };

};

ThumbnailImage.propTypes = {
    link: PropTypes.bool,
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default ThumbnailImage;