import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export default class MainContent extends Component {

    render() {
        return (
            <Fragment>
                {this.props.title ? <h2 className="animated fadeIn faster">{this.props.title}</h2> : null}
                <div className={`main-content ${this.props.className || ''} animated fadeIn faster`}>
                    {this.props.children}
                </div>
            </Fragment>
        );
    };

}

MainContent.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string
};