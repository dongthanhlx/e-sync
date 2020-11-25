import React, {Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import {
    Navbar,
    NavbarBrand,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';

class TopNav extends React.Component {

    constructor(props) {
        super(props);
        this._logOut = this._logOut.bind(this);
    };

    _logOut() {
        // AuthenService.logOut(true);
    };

    render() {
        return (
            <Fragment>
                <Navbar className="top-nav" color="light" light expand="md">
                    <NavbarBrand href="/">
                        <h4 className="ml-4 text-primary"><i>E-Sync</i></h4>
                    </NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret className="user-btn">
                                Wolfgang
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem onClick={this._logOut}>
                                    Log out
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Navbar>
            </Fragment>
        );
    };
}

export default withRouter(TopNav);