import React from 'react';
import PropTypes from 'prop-types';

export default function Image({src, link, className, alt, width, height}) {

    const style = {width, height};

    return link
        ? <a href={src} target="_blank" rel="noopener noreferrer">
            <img style={style} className={className} src={src} alt={alt} />
        </a>
        : <img style={style} className={className} src={src} alt={alt} /> ;

};

Image.propTypes = {
    link: PropTypes.bool,
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
    alt: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Image.defaultProps = {
    alt: "broken"
};
