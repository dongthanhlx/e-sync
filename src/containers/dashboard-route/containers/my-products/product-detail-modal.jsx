import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Badge} from 'reactstrap';
import Image from '../../../../commons/image/image';
import {safeRetrieve as sr} from '../../../../utils/retrieve-value-utils';
import TableWithItemPattern from '../../../../commons/table-with-item-pattern/table-with-item-pattern';
import {
    SYNC_STATUS_COLOR, 
    LAZADA_QC_STATUS_COLOR, LAZADA_PRODUCT_STATUS_COLOR, 
    TIKI_PRODUCT_REQUEST_STATUS_COLOR,
    SHOPEE_PRODUCT_STATUS_COLOR
} from '../../../../constants/status-colors';

export default class ProductDetailModal extends Component {

    render() {
        const {is_open, toggle, product} = this.props;
        return (
            <Modal isOpen={is_open} toggle={toggle} size="xl" backdrop="static" className="product-detail-modal">
                <ModalHeader toggle={toggle}>Chi tiết trạng thái sản phẩm</ModalHeader>
                <ModalBody>
                    <div className="mb-3 product-information">
                        <Image src={sr(product, ['image']) || '#'} width="150px" height="150px" />
                        <h5>{sr(product, ['name'])}</h5>
                    </div>
                    <TableWithItemPattern
                        responsive striped
                        className="product-detail-table"
                        titles={['Nền tảng', 'Trạng thái', 'Chi tiết lỗi', 'Trạng thái QC']}
                        items={sr(product, ['statuses']) || []}
                        itemPattern={ProductDetailTableItem}
                        itemKeyGen={item => item.status_on}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="light" onClick={toggle} className='btn-sm'>Close</Button>
                </ModalFooter>
            </Modal>
        )
    }

}

function ProductDetailTableItem({item}) {
    return (
        <tr>
            <td>{item.status_on}</td>
            <td>
                <ProductDetailStatusCell status={item} />
            </td>
            <td className={item.error_detail ? 'text-danger' : 'text-default'}>{item.error_detail || 'No error'}</td>
            <td className={item.qc_reason ? 'text-danger' : 'text-default'}>{item.qc_reason || 'None'}</td>
        </tr>
    );
}

function ProductDetailStatusCell({status}) {
    return {
        'Lazada': <div className="product-detail-status-cell">
            <span>Sync status</span>
            {
                status.sync_status 
                    ? <Badge color={SYNC_STATUS_COLOR[status.sync_status]}>{status.sync_status}</Badge> 
                    : <span className="text-default">None</span>
            }
            <span>QC status</span>
            {
                status.qc_status ? 
                    <Badge color={LAZADA_QC_STATUS_COLOR[status.qc_status]}>{status.qc_status}</Badge> 
                    : <span className="text-default">None</span>
            }
            <span>Product status</span>
            {
                status.product_status 
                    ? <Badge color={LAZADA_PRODUCT_STATUS_COLOR[status.product_status]}>{status.product_status}</Badge> 
                    : <span className="text-default">None</span>
            }
        </div>,
        'Tiki': <div className="product-detail-status-cell">
            <span>Sync status</span>
            {
                status.sync_status 
                    ? <Badge color={SYNC_STATUS_COLOR[status.sync_status]}>{status.sync_status}</Badge> 
                    : <span className="text-default">None</span>
            }
            <span>Request status</span>
            {
                status.request_status 
                    ? <Badge color={TIKI_PRODUCT_REQUEST_STATUS_COLOR[status.request_status]}>{status.request_status}</Badge> 
                    : <span className="text-default">None</span>
            }
            <span>Product status</span>
            {
                status.product_status 
                    ? <Badge color="light">{status.product_status}</Badge> 
                    : <span className="text-default">None</span>
            }
        </div>,
        'Shopee': <div className="product-detail-status-cell">
            <span>Sync status</span>
            {
                status.sync_status 
                    ? <Badge color={SYNC_STATUS_COLOR[status.sync_status]}>{status.sync_status}</Badge> 
                    : <span className="text-default">None</span>
            }
            <span>Product status</span>
            {
                status.product_status 
                    ? <Badge color={SHOPEE_PRODUCT_STATUS_COLOR[status.product_status]}>{status.product_status}</Badge> 
                    : <span className="text-default">None</span>
            }
        </div>,
    }[status.status_on] || null;
}

ProductDetailModal.propTypes = {
    is_open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    product: PropTypes.object.isRequired,
};
