import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Dropdown, DropdownItem, DropdownToggle, DropdownMenu} from "reactstrap";
import {
    EVENT_TYPES,
    register,
    unregister,
    loadShops,
    changeCurrentShop,
    getShops,
    getCurrentShop
} from '../../services/shops-service';
import {safeRetrieve} from "../../utils/retrieve-value-utils";

class ShopSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {is_open: false};
    };

    componentDidMount() {
        register(EVENT_TYPES.CHANGE_SHOPS, 'ShopSelect', this.forceUpdate.bind(this));
        register(EVENT_TYPES.CHANGE_CURRENT_SHOP, 'ShopSelect', this.forceUpdate.bind(this));
        loadShops();
    };

    componentWillUnmount() {
        unregister(EVENT_TYPES.CHANGE_SHOPS, 'ShopSelect');
        unregister(EVENT_TYPES.CHANGE_CURRENT_SHOP, 'ShopSelect');
    };

    render() {
        const {is_open} = this.state;
        const {className} = this.props;
        const shops = getShops();
        return (
            Array.isArray(shops) && shops.length > 0
                ? <Dropdown nav inNavbar className={className} isOpen={is_open} toggle={() => {this.setState({is_open: !is_open})}}>
                    <DropdownToggle nav caret>
                        {safeRetrieve(getCurrentShop(), ['name'])}
                    </DropdownToggle>
                    <DropdownMenu>
                        {
                            shops.map(shop => (
                                <DropdownItem key={shop.id} onClick={() => {changeCurrentShop(shop.id)}}>
                                    {shop.name}
                                </DropdownItem>
                            ))
                        }
                    </DropdownMenu>
                </Dropdown>
                : null
        );
    };

}

ShopSelect.propTypes = {
    className: PropTypes.string,
};

ShopSelect.defaultProps = {
    className: '',
};

export default ShopSelect;