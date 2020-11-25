import React, {Component} from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './my-products.scss';
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

    async api_get_list_products(name) {
        try {
            const products = await get_list_products(name);
            this.setState({products});
        } catch (err) {
            console.error(err);
            noti('error', err);
        }
    }

    // async api_get_list_products(product_name) {
    //     try {
    //         const products = await get_list_products();
    //         this.setState({products});
    //     } catch (err) {
    //         console.error(err);
    //         noti('error', err);
    //     }
    // }

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
                <form class="form-inline d-flex justify-content-center md-form form-sm">
                    <input 
                        class="form-control form-control-sm mr-3 w-50" 
                        type="text" 
                        placeholder="Tìm kiếm với tên sản phẩm"
                        aria-label="Search" 
                        onChange={e => this.api_get_list_products(e.target.value)}
                    />
                    <i class="fas fa-search" aria-hidden="true"></i>
                </form>      

                <SortableTableWithItemPattern
                    className="table-striped my-products-table"
                    titles={['Stt', 'Ảnh', 'Tên sản phẩm', 'Lock content', 'Trạng Thái', '']}
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
            <th scope='row'>{index + 1}</th>
            <td><ThumbnailImage src={item.image}/></td>
            <td><button className="btn z-depth-0 my-0" onClick={e => {on_show_detail(item)}}>{item.name}</button></td>
            <td>
                {
                    item.lock_content
                        ? <span className='badge badge-danger'>Locked</span>
                        : <span className='badge badge-default'>Open</span>
                }
            </td>
            <td>
                {
                    item.statuses.map(status => <ProductStatus key={status.status_on} status={status} name={item.name}/>)
                }
            </td>
            <td>
                <div className="d-flex">
                    <Link to={`/dashboard/my-products/edit-product?${stringify({product_id: item._id})}`}>
                        {/* <Button size="sm" className="ml-1">
                            <i className="fa fa-edit" />
                        </Button> */}

                        <button className="btn btn-default btn-rounded btn-sm px-2">
                            <i class="fas fa-pencil-alt mt-0"></i>
                        </button>
                    </Link>
                    
                    <button className="btn btn-danger btn-rounded btn-sm px-2">
                        <i class="far fa-trash-alt mt-0"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
}

function renderLink(status, name) {
    const page = status.status_on;
    const name_to_slug = string_to_slug(name);
    if (page === 'Lazada') {
        const item_id = status.item_id;
        return `https://www.lazada.vn/products/${name_to_slug}-i${item_id}.html`;
    }

    if (page === 'Tiki') {
        const product_id = status.product_id;
        return `https://tiki.vn/${name_to_slug}-p${product_id}.html`
    }
}

function ProductStatus({status, name}) {
    const border_color = status.error ? 'border-danger': 'border-info';
    const a_class = `rounded border px-1 text-center mr-1 ${border_color}`

    return {
        'Lazada': <div className="product-status my-1">
            <a target='_blank' rel='external' href={renderLink(status, name)} className={a_class}><span className="status-on">{status.status_on}</span></a>
            {status.error ? <Badge color="danger" className="error">Error</Badge> : <Badge color="light" className="error">No error</Badge>}
            {status.sync_status ? <Badge color={SYNC_STATUS_COLOR[status.sync_status]}>{status.sync_status}</Badge> : null}
            {status.qc_status ? <Badge color={LAZADA_QC_STATUS_COLOR[status.qc_status]}>{status.qc_status}</Badge> : null}
            {status.product_status ? <Badge color={LAZADA_PRODUCT_STATUS_COLOR[status.product_status]}>{status.product_status}</Badge> : null}
        </div>,
        'Tiki': <div className="product-status my-1">
            <a target='_blank' rel='external' href={renderLink(status, name)} className={a_class}><span className="status-on">{status.status_on}</span></a>
            {status.error ? <Badge color="danger" className="error">Error</Badge> : <Badge color="light" className="error">No error</Badge>}
            {status.sync_status ? <Badge color={SYNC_STATUS_COLOR[status.sync_status]}>{status.sync_status}</Badge> : null}
            {status.request_status ? <Badge color={TIKI_PRODUCT_REQUEST_STATUS_COLOR[status.request_status]}>{status.request_status}</Badge> : null}
            {status.product_status ? <Badge color="light">{status.product_status}</Badge> : null}
        </div>,
        'Shopee': <div className="product-status my-1">
            <span className="status-on">{status.status_on}</span>
            {status.error ? <Badge color="danger" className="error">Error</Badge> : <Badge color="light" className="error">No error</Badge>}
            {status.sync_status ? <Badge color={SYNC_STATUS_COLOR[status.sync_status]}>{status.sync_status}</Badge> : null}
            {status.product_status ? <Badge color={SHOPEE_PRODUCT_STATUS_COLOR[status.product_status]}>{status.product_status}</Badge> : null}
        </div>,
    }[status.status_on] || null;
}

function string_to_slug (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}