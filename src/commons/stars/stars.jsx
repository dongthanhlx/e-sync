import React from 'react';
import PropTypes from 'prop-types';

function Stars({className, numberStars, withEmptyStars}) {
    const yellow_stars = parseInt(numberStars) > 0 ? parseInt(numberStars) : 0;
    const gray_stars = 5 - yellow_stars >= 0 ? 5 - yellow_stars : 0;
    return (
        <span className={`stars ${className || ''}`}>
            {
                [...Array(yellow_stars).keys()].map((number) => (
                    <i key={number} className="yellow-star fa fa-star" />
                ))
            }
            {
                withEmptyStars
                    ? [...Array(gray_stars).keys()].map((number) => (
                        <i key={number} className="gray-star fa fa-star" />
                    ))
                    : null
            }
        </span>
    );
}

Stars.propTypes = {
    className: PropTypes.string,
    withEmptyStars: PropTypes.bool,
    numberStars: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Stars.defaultProps = {
    numberStars: 5,
};

export default Stars;