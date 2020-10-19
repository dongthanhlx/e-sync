import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Form, FormGroup} from 'reactstrap';
import AuthenService from '../../services/authen-service';

import * as userAPI from '../../api/user-api';
import {noti} from "../../services/noti-service";
import ForgetPasswordModal from './forget-password-modal';
import LoadingButton from "../../commons/loading-button/loading-button";
import {t} from '../../services/i18n-service';
import {show_customer_chat, hide_customer_chat} from '../../utils/customer-chat';

class LoginRoute extends Component {

    state = {
        isOpenForgetModal: false,
        isLoading: false
    };

    componentDidMount() {
        show_customer_chat();
    }

    componentWillUnmount() {
        hide_customer_chat();
    }

    _handleLogin = (e) => {
        e.preventDefault();
        const username = this.refs.emailInput.value;
        const password = this.refs.passwordInput.value;
        const tmp = document.cookie.split(';').reduce((current, next) => {
            const key_val = next.trim().split('=');
            return Object.assign(current, {
                [key_val[0]]: key_val[1]
            })
        }, {});
        const ati = tmp._ati;
        if (!!username && !!password) {
            this.setState({
                isLoading: true
            });
            const payload = {
                username,
                password,
                ati
            };
            userAPI.login(payload)
                .then(data => {
                    this.setState({
                        isLoading: false
                    });
                    AuthenService.setUserInfo(data);
                })
                .catch(error => {
                    this.setState({
                        isLoading: false
                    });
                    noti('error', error);
                })
        } else {
            noti('warning', t('We need both your email and password to let you in.'));
        }
    };

    _toggleForgetPasswordModal = () => {
        this.setState({
            isOpenForgetModal: !this.state.isOpenForgetModal
        })
    };

    render() {
        return (
            <div className="login-page full-height">
                <div className="login-card">
                    <div className="login-card-header">
                        <div className="authen-nav active">
                            <Link to="#!">{t('Log in')}</Link>
                        </div>
                        <div className="authen-nav">
                            <Link to="/register">{t('Register')}</Link>
                        </div>
                    </div>
                    <div className="login-card-body">
                        <Form>
                            <FormGroup>
                                <input className='authen-input' type="email" ref='emailInput' placeholder={t('Email')} />
                            </FormGroup>
                            <FormGroup>
                                <input className='authen-input' type="password" ref='passwordInput' placeholder={t('Password')} />
                            </FormGroup>
                            <FormGroup>
                                <LoadingButton type="submit" block color="primary" loading={this.state.isLoading} onClick={this._handleLogin}>
                                    {t('Log in')}
                                </LoadingButton>
                            </FormGroup>
                            <a href="#!" onClick={this._toggleForgetPasswordModal} className="forget-password-link">{t('Forget password')}?</a>
                        </Form>
                    </div>
                </div>
                <ForgetPasswordModal modal={this.state.isOpenForgetModal} toggle={this._toggleForgetPasswordModal} />
            </div>
        );
    };

}


export default LoginRoute;