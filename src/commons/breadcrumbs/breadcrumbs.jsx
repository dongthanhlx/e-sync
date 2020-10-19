import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import PropTypes from 'prop-types';

const getRoutesInPath = (routes, pathname) => {
    const routesInPathname = routes.filter((e) => {
        return pathname.includes(e.path);
    });
    return routesInPathname.sort((a, b) => {
        return a.path.length - b.path.length;
    })
};

class Breadcrumbs extends React.Component {

    componentDidMount() {
        // this.props.history.listen(() => {this.forceUpdate()});
        this.unregisterHistoryListener = this.props.history.listen(() => {this.forceUpdate()});
    }

    componentWillUnmount() {
        this.unregisterHistoryListener();
    }

    render() {
        const pathname = this.props.history.location.pathname;
        const routes = getRoutesInPath(this.props.routes, pathname);
        return (
            routes.length > 0 ? (
                <Breadcrumb className="breadcrumbs">{
                    routes.map(({ title, path, exact }) => {
                        return (
                            <BreadcrumbItem key={path} active={!exact}>
                                {
                                    (!exact) ? title : ((path !== pathname)) ? <Link to={path}>{title}</Link> : title
                                }
                            </BreadcrumbItem>
                        )
                    }
                    )
                }</Breadcrumb>
            ) : null
        );
    };

};

Breadcrumbs.propTypes = {
    routes: PropTypes.array
}

export default withRouter(Breadcrumbs);

