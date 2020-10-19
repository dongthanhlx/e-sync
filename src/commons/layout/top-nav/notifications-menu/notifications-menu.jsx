import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import NotificationCounterService from "../../../../services/notification-counter-service";
import {noti} from "../../../../services/noti-service";
import {getAllNotifications, markNotificationAsRead} from "../../../../api/notifications-api";
import {getNotificationTimeString} from "../../../../utils/datetime-utils";
import {t} from '../../../../services/i18n-service';
import {parse_and_pump as pp} from '../../../../utils/real-translator';

class NotificationsMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        };
        this._getAllNotifications = this._getAllNotifications.bind(this);
        this._gotoNotificationsPage = this._gotoNotificationsPage.bind(this);
        this._handleMarkAllAsRead = this._handleMarkAllAsRead.bind(this);

    };

    componentDidMount() {
        NotificationCounterService.register('NotificationsMenu', () => {
            if (this.get_all_notifications_ticker) window.clearTimeout(this.get_all_notifications_ticker);
            this.get_all_notifications_ticker = window.setTimeout(this._getAllNotifications, 500);
        });
        this._getAllNotifications();
    };

    componentWillUnmount() {
        NotificationCounterService.unregister('NotificationsMenu');
    };

    async _getAllNotifications() {
        try {
            const {notificationList} = await getAllNotifications();
            this.setState({notifications: notificationList});
        } catch (err) {
            console.error(err);
            noti('error', t(err));
        }
    };

    _getNotificationClickHandler(notification_type) {
        return {
            'product_research': () => {
                this.props.history.push('/dashboard/product-research');
            }
        }[notification_type] || this._gotoNotificationsPage;
    };

    _gotoNotificationsPage() {
        this.props.history.push('/notifications');
    };

    async _handleNotificationClick(notification) {
        try {
            const {id, type} = notification;
            await markNotificationAsRead(id, true);
            this._getNotificationClickHandler(type)(notification);
        } catch (err) {
            console.error(err);
            noti('error', t(err));
        }
    };

    async _handleMarkAllAsRead() {
        try {
            const unread_notifications = this.state.notifications.filter(notification => !notification.read);
            const promises = unread_notifications.map(notification => markNotificationAsRead(notification.id, true));
            await Promise.all(promises);
        } catch (err) {
            console.error(err);
            noti('error', t(err));
        }
    };

    render() {
        const {notifications: all_notifications} = this.state;
        const notifications = all_notifications.slice(0, 6);
        const notification_count = NotificationCounterService.getNotificationCount();
        return (
            <UncontrolledDropdown nav inNavbar className="notifications-menu">
                <DropdownToggle nav title={t('Notifications')}>
                    <i className="fa fa-bell" />
                    {
                        notification_count ? (
                            <Badge className="count-info" color="danger">
                                {NotificationCounterService.getNotificationCount()}
                            </Badge>
                        ) : null
                    }
                </DropdownToggle>
                <DropdownMenu right className="menu">
                    <div className="menu-header d-flex justify-content-between">
                        <span className="font-weight-bold">{t('Notifications')}</span>
                        <Link to="#!" onClick={this._handleMarkAllAsRead}>{t('Mark all as read')}</Link>
                    </div>
                    <DropdownItem divider />
                    {
                        notifications.length > 0
                            ? notifications.map(notification => (
                                <DropdownItem
                                    key={notification.id}
                                    className={`notification ${notification.read ? '' : 'unread'}`}
                                    onClick={() => {this._handleNotificationClick(notification)}}
                                >
                                    <div className="title d-flex align-items-center justify-content-between">
                                        <span className={`title-text flex-grow-1 ${notification.read ? '' : 'font-weight-bold'}`}>
                                            {pp(notification.title, JSON.parse(notification.options).title_var) || t('Sellpro notification')}
                                        </span>
                                        <span className="timestamp small">
                                            {getNotificationTimeString(notification.create_time)}
                                        </span>
                                    </div>
                                    <div className="content small">
                                        {pp(notification.content, JSON.parse(notification.options).content_var).replace(/\\n/g, ' ')}
                                    </div>
                                </DropdownItem>
                            ))
                            : <div className="no-notifications text-center text-secondary">{t('No notifications')}</div>
                    }
                    <DropdownItem divider />
                    <div className="menu-footer text-center">
                        <Link to="/notifications"><span className="font-weight-bold">{t('Show all notifications')}</span></Link>
                    </div>
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }
}

NotificationsMenu.propTypes = {};

export default withRouter(NotificationsMenu);