import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ThumbnailImage extends Component {

    render() {
        const {src, link, className} = this.props;
        return src 
            ? link
                ? <a href={src} target="_blank" rel="noopener noreferrer">
                    <img className={`img-thumbnail ${className}`} src={src} alt="thumbnail" style={{minWidth: '50px', maxWidth: '50px'}}/>
                </a>
                : <img className={`img-thumbnail ${className}`} src={src} alt="thumbnail" style={{minWidth: '50px', maxWidth: '50px'}}/>
            : 'loading';
    };

};

ThumbnailImage.propTypes = {
    link: PropTypes.bool,
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default ThumbnailImage;