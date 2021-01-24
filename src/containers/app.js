import React, {Component, Fragment} from 'react';
import {BrowserRouter, Switch, Redirect} from 'react-router-dom';
import {APP_ROUTES} from "./app-routes";
import {ToastContainer} from "react-toastr";
import {setToast} from '../services/noti-service';
import WithHtmlTitleRoute from "../commons/with-html-title-route/with-html-title-route";
import {ConfirmDialog} from "../services/confirm-dialog-service";
import {AlertDialog} from "../services/alert-dialog-service";
import '../services/noti-service';

class App extends Component {

    componentDidMount() {
        setToast(this.toast);
    };

    componentWillUnmount() {
        // AuthenService.unregister('App');
    };

    render() {
        return (
            <Fragment>
                <Switch>
                    {
                        APP_ROUTES().map(route => (
                            <WithHtmlTitleRoute
                                key={route.exact + route.path}
                                exact={route.exact}
                                path={route.path}
                                htmlTitle={route.htmlTitle}
                                component={route.component}
                            />
                        ))
                    }
                    <Redirect to="/" />
                </Switch>
                <ToastContainer className="toast-bottom-right" ref={el => {this.toast = el}} />
                <ConfirmDialog />
                <AlertDialog />
            </Fragment>
        );
    }

};

// function requireAuthen(component) {
//     return AuthenService.getUserInfo() ? component : () => <Redirect to='/login' />;
// };

// function requireUnAuthen(component) {
//     return AuthenService.getUserInfo() ? () => <Redirect to={popLastPath() || '/dashboard'} /> : component;
// };


export default App;
