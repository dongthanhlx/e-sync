import React from 'react';
import PropTypes from 'prop-types';
import {PulseLoader} from 'react-spinners';
import DelayedLoader from "./delayed-loader";

export default function SelPulseLoader({loading, delayTime, className, ...props}) {

    return (
        <DelayedLoader loading={loading} delayTime={delayTime} className={className}>
            <PulseLoader loading {...props} />
        </DelayedLoader>
    );

};

SelPulseLoader.propTypes = {
    ...PulseLoader.propTypes,
    loading: PropTypes.bool,
    delayTime: PropTypes.number,
    className: PropTypes.string,
};
