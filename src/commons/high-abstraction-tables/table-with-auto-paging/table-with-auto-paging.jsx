import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import TableWithPaging from "../table-with-paging/table-with-paging";
import {noti} from "../../../services/noti-service";
import ObservableExecutor from '../../../utils/observable-executor';
import TableColumnsConfigService from '../../../services/table-columns-config-service';
import ColumnsConfigModal from "../columns-config-modal/columns-config-modal";
import {safeRetrieve} from "../../../utils/retrieve-value-utils";
import {t} from '../../../services/i18n-service';

class TableWithAutoPaging extends Component {

    static ProduceNewItemsActions = {
        AFTER_LOAD: 'AFTER_LOAD',
    };

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            is_loading_items: false,
            total_count: 0,
            page_size: 10,
            current_page: 0,
            show_columns_config_modal: false,
        };
        this.get_item_executor = null;
        this._handleSelectPage = this._handleSelectPage.bind(this);
        this._handleChangePageSize = this._handleChangePageSize.bind(this);
        this._handleProduceNewItems = this._handleProduceNewItems.bind(this);
    };

    componentDidMount() {
        const {shouldGetItemsOnMounted, headConfig, configRegisterName, defaultColumnsConfig} = this.props;
        if (shouldGetItemsOnMounted()) {
            this._getItems();
        }
        if (configRegisterName) {
            TableColumnsConfigService.register('TableWithAutoPaging', this.forceUpdate.bind(this));
            TableColumnsConfigService.setInitialColumnsConfig(
                configRegisterName,
                Array.isArray(defaultColumnsConfig) ? defaultColumnsConfig : headConfig.map((config, i) => i)
            );
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.reloadFromFirstPageKey && (prevProps.reloadFromFirstPageKey !== this.props.reloadFromFirstPageKey)) {
            if (this.state.current_page === 0) {
                this._getItems();
            } else {
                this.setState({current_page: 0});
            }
        } else if (
            prevState.current_page !== this.state.current_page
            || prevState.page_size !== this.state.page_size
            || prevProps.reloadItemsKey !== this.props.reloadItemsKey
        ) {
            this._getItems();
        }
    };

    componentWillUnmount() {
        if (this.get_item_executor) this.get_item_executor.unsubscribe();
        TableColumnsConfigService.unregister('TableWithAutoPaging');
    };

    _getItems() {
        const get_items_executor = async (onEmit, onDone, onError) => {
            try {
                const {itemsGen, totalCountGen} = this.props;
                const {page_size, current_page} = this.state;
                const response_data = await this.props.getItems({page_size, page_number: current_page});
                const raw_items = itemsGen(response_data);
                const total_count = totalCountGen(response_data);
                // If current page has nothing to show, load the former page
                if (Array.isArray(raw_items) && raw_items.length === 0 && current_page > 0 && (total_count / page_size <= current_page)) {
                    this.setState({current_page: current_page - 1});
                } else {
                    const items = this.props.produceNewItems(raw_items, TableWithAutoPaging.ProduceNewItemsActions.AFTER_LOAD, {});
                    onEmit({items, total_count});
                }
            } catch (err) {
                onError(err);
            } finally {
                onDone();
            }
        };
        const get_items_subscribe_data = {
            onEmit: (data) => {this.setState(data)},
            onDone: () => {this.setState({is_loading_items: false})},
            onError: (err) => {console.error(err); noti('error', t(err))},
        };
        this.setState({is_loading_items: true});
        if (this.get_item_executor) this.get_item_executor.unsubscribe();
        this.get_item_executor = (new ObservableExecutor(get_items_executor)).subscribe(get_items_subscribe_data).execute();
    };

    _handleSelectPage(current_page) {
        this.setState({current_page});
    };

    _handleChangePageSize(new_page_size) {
        const {current_page, page_size} = this.state;
        const new_selected_page = Math.floor(current_page * page_size / new_page_size);
        this.setState({page_size: new_page_size, current_page: new_selected_page});
    };

    _handleProduceNewItems(action_name, data = {}) {
        const items = this.props.produceNewItems(this.state.items, action_name, data);
        this.setState({items});
    };

    render() {
        const {
            className, headConfig: rawHeadConfig, customHead,
            itemPattern, itemKeyGen, itemProps,
            getItems, reloadItemsKey, reloadFromFirstPageKey, itemsGen, totalCountGen,
            produceNewItems, shouldGetItemsOnMounted,
            configRegisterName, defaultColumnsConfig,
            ...tableProps
        } = this.props;
        const {total_count, is_loading_items, items, page_size, current_page, show_columns_config_modal} = this.state;
        const columnsConfig = configRegisterName
            ? (TableColumnsConfigService.getColumnsConfig(configRegisterName) || []).filter(column => (column >= 0 && column < rawHeadConfig.length))
            : null;
        const headConfig = Array.isArray(columnsConfig) ? columnsConfig.map(i => rawHeadConfig[i]) : rawHeadConfig;
        return (
            <Fragment>
                <TableWithPaging
                    className={className}
                    isLoading={is_loading_items}
                    tableProps={{
                        ...tableProps,
                        configRegisterName,
                        headConfig,
                        items,
                        itemPattern,
                        itemKeyGen,
                        indexOffset: parseInt(page_size * current_page),
                        itemProps: itemProps ? itemProps({items, columnsConfig, produceNewItems: this._handleProduceNewItems}) : {},
                        customHead: customHead ? customHead({items, columnsConfig, produceNewItems: this._handleProduceNewItems}) : null,
                    }}
                    pagingProps={{
                        totalCount: total_count,
                        pageSize: page_size,
                        currentPage: current_page,
                        onChangePageSize: this._handleChangePageSize,
                        onSelectPage: this._handleSelectPage,
                    }}
                    onColumnsConfigButtonClick={() => {this.setState({show_columns_config_modal: !this.state.show_columns_config_modal})}}
                />
                {
                    configRegisterName
                        ? <ColumnsConfigModal
                            isOpen={show_columns_config_modal}
                            toggle={() => {this.setState({show_columns_config_modal: !this.state.show_columns_config_modal})}}
                            configRegisterName={configRegisterName}
                            columnTitles={rawHeadConfig.map(config => safeRetrieve(config, ['title']))}
                        />
                        : null
                }
            </Fragment>
        );
    };

}

TableWithAutoPaging.propTypes = {
    className: PropTypes.string,
    headConfig: PropTypes.array,
    itemPattern: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
    itemKeyGen: PropTypes.func,
    itemProps: PropTypes.func,
    customHead: PropTypes.func,

    getItems: PropTypes.func.isRequired,
    reloadItemsKey: PropTypes.string.isRequired,
    reloadFromFirstPageKey: PropTypes.string,
    itemsGen: PropTypes.func.isRequired,
    totalCountGen: PropTypes.func.isRequired,
    produceNewItems: PropTypes.func.isRequired,
    shouldGetItemsOnMounted: PropTypes.func,

    configRegisterName: PropTypes.string,
    defaultColumnsConfig: PropTypes.array,
};

TableWithAutoPaging.defaultProps = {
    shouldGetItemsOnMounted: () => true,
};

export default TableWithAutoPaging;