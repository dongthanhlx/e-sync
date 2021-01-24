import React, { Component } from 'react';
import { NavLink as RouterNavLink, withRouter } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { Nav, NavItem, NavLink, UncontrolledCollapse} from 'reactstrap';
import { DASHBOARD_ANALYTIC_ROUTES } from "../../containers/dashboard-route/dashboard-routes";
import {isActiveParent, isParent} from '../../utils/parent-route-utils';
import uuidv4 from 'uuid/v4';

class SideNav extends Component {

    _renderParentItem(route) {
        const active_parent = isActiveParent(this.props.location.pathname, route);
        const collapseOpen = active_parent ? {isOpen: true} : {};
        const route_id = uuidv4();
        return (
            <NavItem key={route_id}>
                <div 
                    id={`toggler-${route_id}`}
                    className={`nav-link ${active_parent ? 'active' : ''} parent d-flex align-items-center justify-content-between`}
                >
                    <span>{route.icon ? <i className={`nav-item-icon fa ${route.icon}`} /> : null}{route.title}</span>
                    {active_parent ? null : <span>&#9660;</span>}
                </div>
                <UncontrolledCollapse {...collapseOpen} toggler={`#toggler-${route_id}`}>{
                    route.children.map(sub_route => (
                        <NavLink 
                            key={sub_route.path} 
                            className="child-nav-link"
                            replace to={sub_route.path} 
                            activeClassName="active" 
                            tag={RouterNavLink}
                        >
                            {sub_route.title}
                        </NavLink>
                    ))
                }</UncontrolledCollapse>
            </NavItem>
        );
    };

    _renderChildItem(route) {
        return (
            <NavItem key={route.path}>
                <NavLink replace to={route.path} activeClassName="active" tag={RouterNavLink}>
                    {route.icon ? <i className={`nav-item-icon fa ${route.icon}`} /> : null}{route.title}
                </NavLink>
            </NavItem>
        );
    };

    render() {
        return (
            <div className="side-nav" style={{backgroundColor: '#4fc3f7'}}>
                <a href="/"><h4 className="ml-5 font-weight-bold mb-3 mt-2 text-dark"><i>E-Sync</i></h4></a>
                <Nav vertical>{
                    DASHBOARD_ANALYTIC_ROUTES().map(route => (
                        route.isNavItem ? (isParent(route) ? this._renderParentItem(route) : this._renderChildItem(route)) : null
                    ))
                }</Nav>
            </div>
        );
    };

};

export default withRouter(SideNav);