import React, {Component} from 'react';
import {Input} from 'reactstrap';

class JustNumberInput extends Component {

    constructor(props) {
        super(props);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
    }
    
    _handleKeyDown(e) {
        const forbidden_keycodes = [38, 40, 187, 189, 190, 69];
        if (forbidden_keycodes.includes(e.keyCode)) {
            e.preventDefault();
        } else {
            if (typeof this.props.onKeyDown === 'function') {
                this.props.onKeyDown(e);
            }
        }
    }

    _handleInputChange(e) {
        e.target.value = String(e.target.value).replace(/\.+|\++|-+|e+/g, '');
        this.props.onChange(e);
    }

    render() {
        const {type, onChange, onKeyDown, ...props} = this.props;
        return (
            <Input type="number" onKeyDown={this._handleKeyDown} onChange={this._handleInputChange} {...props} />
        );
    }

}

JustNumberInput.propTypes = {
    ...Input.propTypes
};

export default JustNumberInput;