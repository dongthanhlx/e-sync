import {PRODUCT_STATUS} from './product-status';
import {LAZADA_PRODUCT_REQUEST_STATUS} from './lazada-product-request-status';
import {LAZADA_PRODUCT_STATUS} from './lazada-product-status';
import {TIKI_PRODUCT_REQUEST_STATUS} from './tiki-product-request-status';
import {SHOPEE_PRODUCT_STATUS} from './shopee-product-status';

export const SYNC_STATUS_COLOR = {
    [PRODUCT_STATUS.synced]: 'success',
    [PRODUCT_STATUS.not_synced]: 'warning',
};

export const LAZADA_QC_STATUS_COLOR = {
    [LAZADA_PRODUCT_REQUEST_STATUS.pending]: 'info',
    [LAZADA_PRODUCT_REQUEST_STATUS.approved]: 'success',
    [LAZADA_PRODUCT_REQUEST_STATUS.liverejected]: 'danger',
    [LAZADA_PRODUCT_REQUEST_STATUS.rejected]: 'danger',
    [LAZADA_PRODUCT_REQUEST_STATUS.lock]: 'danger',
};

export const LAZADA_PRODUCT_STATUS_COLOR = {
    [LAZADA_PRODUCT_STATUS.pending]: 'info', 
    [LAZADA_PRODUCT_STATUS.live]: 'success', 
    [LAZADA_PRODUCT_STATUS.active]: 'success',
    [LAZADA_PRODUCT_STATUS.inactive]: 'secondary', 
    [LAZADA_PRODUCT_STATUS.rejected]: 'danger', 
    [LAZADA_PRODUCT_STATUS.deleted]: 'danger', 
    [LAZADA_PRODUCT_STATUS['image-missing']]: 'danger', 
    [LAZADA_PRODUCT_STATUS['sold-out']]: 'secondary',
    [LAZADA_PRODUCT_STATUS.all]: 'dark',
};

export const TIKI_PRODUCT_REQUEST_STATUS_COLOR = {
    [TIKI_PRODUCT_REQUEST_STATUS.queuing]: 'info',
    [TIKI_PRODUCT_REQUEST_STATUS.processing]: 'info',
    [TIKI_PRODUCT_REQUEST_STATUS.drafted]: 'info',
    [TIKI_PRODUCT_REQUEST_STATUS.bot_awaiting_approve]: 'info',
    [TIKI_PRODUCT_REQUEST_STATUS.md_awaiting_approve]: 'info',
    [TIKI_PRODUCT_REQUEST_STATUS.awaiting_approve]: 'info',
    [TIKI_PRODUCT_REQUEST_STATUS.approved]: 'success',
    [TIKI_PRODUCT_REQUEST_STATUS.rejected]: 'danger',
    [TIKI_PRODUCT_REQUEST_STATUS.deleted]: 'danger',
};

export const SHOPEE_PRODUCT_STATUS_COLOR = {
    [SHOPEE_PRODUCT_STATUS.normal]: 'success',
    [SHOPEE_PRODUCT_STATUS.unlist]: 'secondary',
    [SHOPEE_PRODUCT_STATUS.deleted]: 'danger',
    [SHOPEE_PRODUCT_STATUS.banned]: 'danger',
};