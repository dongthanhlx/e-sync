import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import MainContent from '../../../../commons/layout/main-content';
import {Button, Badge} from 'reactstrap';
import SortableTableWithItemPattern from '../../../../commons/sortable-tables/sortable-table-with-item-pattern';
import ThumbnailImage from '../../../../commons/thumbnail-image/thumbnail-image';
import {noti} from '../../../../services/noti-service';
import {get_list_products, delete_product} from '../../../../api/products';
import {stringify} from 'query-string';
import ProductDetailModal from './product-detail-modal';
import {
    SYNC_STATUS_COLOR, 
    LAZADA_QC_STATUS_COLOR, LAZADA_PRODUCT_STATUS_COLOR,
    TIKI_PRODUCT_REQUEST_STATUS_COLOR,
    SHOPEE_PRODUCT_STATUS_COLOR
} from '../../../../constants/status-colors'
import {showConfirmDialog} from '../../../../services/confirm-dialog-service';

export default class MyProducts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            selected_product: {},
            is_open_detail_modal: false,
        };
        this.handle_show_detail_product = this.handle_show_detail_product.bind(this);
        this.handle_delete_product = this.handle_delete_product.bind(this);
    }

    componentDidMount() {
        this.api_get_list_products();
    }

    async api_get_list_products() {
        try {
            const products = await get_list_products();
            this.setState({products});
        } catch (err) {
            console.error(err);
            noti('error', err);
        }
    }

    async api_delete_product(product_id) {
        try {
            await delete_product(product_id);
        } catch (err) {
            console.error(err);
            noti('error', err);
        }
    }

    handle_show_detail_product(product) {
        this.setState({
            selected_product: product,
            is_open_detail_modal: true,
        });
    }

    handle_delete_product(product) {
        showConfirmDialog('Deleted product cannot be recovered. Do you still want to delete this product?', async () => {
            const {_id: product_id} = product;
            await this.api_delete_product(product_id);
            await this.api_get_list_products();
        }, () => {});
    }

    render() {
        const {products, selected_product, is_open_detail_modal} = this.state;
        return (
            <MainContent className="my-products">
                <Link to="/dashboard/new-product">
                    <Button color="primary" className="mb-3">
                        <i className="fa fa-plus" /> Publish new product
                    </Button>
                </Link>
                <SortableTableWithItemPattern
                    className="table-striped my-products-table"
                    titles={['No', 'Image', 'Product name', 'Lock content', 'Status', 'Action']}
                    items={products}
                    itemPattern={MyProductsTableItem}
                    itemKeyGen={item => item._id}
                    itemProps={{
                        on_show_detail: this.handle_show_detail_product,
                        on_delete: this.handle_delete_product,
                    }}
                    sortConfig={[]}
                />
                <ProductDetailModal
                    is_open={is_open_detail_modal}
                    toggle={() => {this.setState({is_open_detail_modal: !this.state.is_open_detail_modal})}}
                    product={selected_product}
                />
            </MainContent>
        )
    }

}

function MyProductsTableItem({item, index, on_show_detail, on_delete}) {
    return (
        <tr>
            <td>{index + 1}</td>
            <td><ThumbnailImage src={item.image} /></td>
            <td>{item.name}</td>
            <td>
                {
                    item.lock_content
                        ? <Badge color="danger">Locked</Badge>
                        : <Badge color="light">Open</Badge>
                }
            </td>
            <td>
                {
                    item.statuses.map(status => <ProductStatus key={status.status_on} status={status} />)
                }
            </td>
            <td>
                <Button outline size="sm" onClick={e => {on_show_detail(item)}}>
                    <i className="fa fa-eye" />
                </Button>
                <Link to={`/dashboard/my-products/edit-product?${stringify({product_id: item._id})}`}>
                    <Button size="sm" className="ml-1">
                        <i className="fa fa-edit" />
                    </Button>
                </Link>
                <Button outline color="danger" size="sm" className="ml-3" onClick={e => {on_delete(item)}}>
                    <i className="fa fa-trash-alt" />
                </Button>
            </td>
        </tr>
    );
}

function ProductStatus({status}) {
    return {
        'Lazada': <div className="product-status">
            <span className="status-on">{status.status_on}</span>
            {status.error ? <Badge color="danger" className="error">Error</Badge> : <Badge color="light" className="error">No error</Badge>}
            {status.sync_status ? <Badge color={SYNC_STATUS_COLOR[status.sync_status]}>{status.sync_status}</Badge> : null}
            {status.qc_status ? <Badge color={LAZADA_QC_STATUS_COLOR[status.qc_status]}>{status.qc_status}</Badge> : null}
            {status.product_status ? <Badge color={LAZADA_PRODUCT_STATUS_COLOR[status.product_status]}>{status.product_status}</Badge> : null}
        </div>,
        'Tiki': <div className="product-status">
            <span className="status-on">{status.status_on}</span>
            {status.error ? <Badge color="danger" className="error">Error</Badge> : <Badge color="light" className="error">No error</Badge>}
            {status.sync_status ? <Badge color={SYNC_STATUS_COLOR[status.sync_status]}>{status.sync_status}</Badge> : null}
            {status.request_status ? <Badge color={TIKI_PRODUCT_REQUEST_STATUS_COLOR[status.request_status]}>{status.request_status}</Badge> : null}
            {status.product_status ? <Badge color="light">{status.product_status}</Badge> : null}
        </div>,
        'Shopee': <div className="product-status">
            <span className="status-on">{status.status_on}</span>
            {status.error ? <Badge color="danger" className="error">Error</Badge> : <Badge color="light" className="error">No error</Badge>}
            {status.sync_status ? <Badge color={SYNC_STATUS_COLOR[status.sync_status]}>{status.sync_status}</Badge> : null}
            {status.product_status ? <Badge color={SHOPEE_PRODUCT_STATUS_COLOR[status.product_status]}>{status.product_status}</Badge> : null}
        </div>,
    }[status.status_on] || null;
}
