import React, {Component} from 'react';
import {Modal, ModalBody, Button} from "reactstrap";
import {toString} from "../utils/tostring-utils";

let show_dialog = false;
let dialog_message = '';
let update_dialog = null;
let handleGranted = () => {};
let handleDenied = () => {};

function updateDialog() {
    if (update_dialog) update_dialog();
}

function toggle() {
    show_dialog = !show_dialog;
    updateDialog();
}

function showConfirmDialog(message, onGranted, onDenied) {
    dialog_message = toString(message);
    handleGranted = onGranted || handleGranted;
    handleDenied = onDenied || handleDenied;
    show_dialog = true;
    updateDialog();
}

function handleGrantedClick() {
    handleGranted();
    handleGranted = () => {};
    toggle();
}

function handleDeniedClick() {
    handleDenied();
    handleDenied = () => {};
    toggle();
}

class ConfirmDialog extends Component {

    componentDidMount() {
        update_dialog = this.forceUpdate.bind(this);
    };

    render() {
        return (
            <Modal className="confirm-dialog" isOpen={show_dialog} toggle={toggle}>
                <ModalBody className="dialog-body">
                    <h3 className="title text-center">Are you sure?</h3>
                    <p className="message text-center">{dialog_message}</p>
                    <div className="control d-flex justify-content-center">
                        <Button color="light" onClick={handleDeniedClick}>Cancel</Button>&nbsp;
                        <Button color="primary" onClick={handleGrantedClick}>Yes, do it!</Button>
                    </div>
                </ModalBody>
            </Modal>
        );
    };
}

export {ConfirmDialog, showConfirmDialog};