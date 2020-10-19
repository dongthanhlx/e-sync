import React, {Component} from 'react';
import {Modal, ModalBody, Button} from "reactstrap";
import {toString} from "../utils/tostring-utils";

let show_dialog = false;
let dialog_title = 'Message';
let dialog_message = '';
let update_dialog = null;

function updateDialog() {
    if (update_dialog) update_dialog();
}

function toggle() {
    show_dialog = !show_dialog;
    updateDialog();
}

function showAlertDialog(title, message) {
    dialog_title = toString(title) || 'Message';
    dialog_message = toString(message);
    show_dialog = true;
    updateDialog();
}

function closeAlertDialog() {
    show_dialog = false;
    updateDialog();
}

class AlertDialog extends Component {

    componentDidMount() {
        update_dialog = this.forceUpdate.bind(this);
    };

    render() {
        return (
            <Modal className="alert-dialog" isOpen={show_dialog} toggle={toggle}>
                <ModalBody className="dialog-body">
                    <h3 className="title text-center">{dialog_title}</h3>
                    <p className="message">{dialog_message}</p>
                    <div className="control d-flex justify-content-end">
                        <Button color="light" onClick={closeAlertDialog}>I got it!</Button>
                    </div>
                </ModalBody>
            </Modal>
        );
    };
}

export {AlertDialog, showAlertDialog};
