import React, {Component} from 'react';
import {Modal} from 'reactstrap';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable';

class DraggableModal extends Component {

    constructor(props) {
        super(props);
        this._handleOpened = this._handleOpened.bind(this);
        this._handleClosed = this._handleClosed.bind(this);
    }

    _handleOpened() {
        $(this.modal).draggable({handle: '.modal-header'});
        if (this.props.onOpened) this.props.onOpened();
    };

    _handleClosed() {
        $(this.modal).draggable('destroy');
        if (this.props.onClosed) this.props.onClosed();
    };

    render() {
        const {children, onOpened, onClosed, className, ...props} = this.props;
        return (
            <Modal
                className={`draggable-modal ${className}`}
                onOpened={this._handleOpened}
                onClosed={this._handleClosed}
                innerRef={(el) => {this.modal = el}}
                {...props}
            >
                {children}
            </Modal>
        );
    };

}

DraggableModal.propTypes = {
    ...Modal.propTypes,
};

DraggableModal.defaultProps = {
    className: '',
};

export default DraggableModal;