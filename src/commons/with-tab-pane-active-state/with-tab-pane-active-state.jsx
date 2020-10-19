import React from 'react';
import PropTypes from 'prop-types';

export default function  withTabPaneActiveState(component) {

    function TabPaneRenderWhenActive({tabId, tabIdToCompare, ...props}) {
        return tabId === tabIdToCompare
            ? React.createElement(component, props)
            : null;
    }

    TabPaneRenderWhenActive.propTypes = {
        tabId: PropTypes.string.isRequired,
        tabIdToCompare: PropTypes.string.isRequired,
    };

    return TabPaneRenderWhenActive;

};