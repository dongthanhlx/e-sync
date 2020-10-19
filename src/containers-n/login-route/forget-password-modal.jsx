import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Label } from "reactstrap";
import * as userAPI from '../../api/user-api';
import ReCAPTCHA from 'react-google-recaptcha';
import { noti } from '../../services/noti-service';
import PropTypes from 'prop-types';
import {t} from '../../services/i18n-service';

class ForgetPasswordModal extends Component {

    state = {
        reCaptchaToken: null
    };

    _handleSendEmail = () => {
        const email = this.refs.emailInput.value;
        const patt = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!!email && patt.test(email)) {
            const response = this.state.reCaptchaToken;
            const payload = {
                email,
                response
            };
            userAPI.submitEmailToChangePassword(payload)
                .then(() => {
                    noti('success', t('We\'ve sent you an email. Check it out!'));
                    this.props.toggle();
                })
                .catch(err => {
                    console.error(err);
                    noti('error', t(err));
                })

        } else {
            noti('error', t('Invalid email!'))
        }
    };

    _onChange(value) {
        this.setState({ reCaptchaToken: value });
    }
    render() {
        return (
            <div className='forget-password-modal'>
                <Modal isOpen={this.props.modal} toggle={this.props.toggle} >
                    <ModalHeader toggle={this.props.toggle}>{t('Forget password')}</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label>{t('Let us know your account email')}:</Label>
                                <input className='form-control' ref='emailInput' />
                            </FormGroup>
                            <FormGroup>
                                <ReCAPTCHA
                                    sitekey="6Lf6G4YUAAAAAE4cJtnxmW-Xy4QltgOIyzxX3VKK"
                                    onChange={this._onChange.bind(this)}
                                >
                                </ReCAPTCHA>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="light" onClick={this.props.toggle}>{t('Close')}</Button>
                        <Button color="primary" onClick={this._handleSendEmail}>{t('Confirm')}</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

ForgetPasswordModal.propTypes = {
    modal: PropTypes.bool,
    toogle: PropTypes.func
}

export default ForgetPasswordModal;

