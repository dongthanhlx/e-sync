import React, {Component} from 'react';
import {Switch, Redirect} from 'react-router-dom';
import SideNav from "../../commons/layout/side-nav";
import TopNav from "../../commons/layout/top-nav/top-nav";
import {DASHBOARD_ANALYTIC_ROUTES} from "./dashboard-routes";
import Footer from "../../commons/layout/footer";
import Content from "../../commons/layout/content";
import Breadcrumbs from '../../commons/breadcrumbs/breadcrumbs';
import {flattenRoutes} from '../../utils/parent-route-utils';
import WithHtmlTitleRoute from "../../commons/with-html-title-route/with-html-title-route";

export default class DashboardRoute extends Component {

    render() {
        return (
            this.props.location.pathname === "/dashboard"
                ? <Redirect to="/dashboard/my-products" />
                : <div className="dashboard">
                    {/* <TopNav /> */}
                    <div className="below-top-nav">
                        <SideNav />
                        <div className="content-wrapper flex-grow-1 d-flex flex-column justify-content-between">
                            <Content container fluid>
                                <Breadcrumbs routes={flattenRoutes(DASHBOARD_ANALYTIC_ROUTES())} />
                                <Switch>
                                    {
                                        flattenRoutes(DASHBOARD_ANALYTIC_ROUTES()).map(route => (
                                            <WithHtmlTitleRoute
                                                key={route.path}
                                                path={route.path}
                                                exact={route.exact}
                                                htmlTitle={route.htmlTitle}
                                                component={route.component}
                                            />
                                        ))
                                    }
                                    <Redirect to="/dashboard" />
                                </Switch>
                            </Content>
                        </div>
                    </div>
                    <Footer />
                </div>
        );
    };

}