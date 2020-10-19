import * as ShopApi from "../api/shop-api";
import {toString} from "../utils/tostring-utils";
import authen_service from './authen-service';

const EVENT_TYPES = {
    CHANGE_SHOPS: 'CHANGE_SHOPS',
    CHANGE_CURRENT_SHOP: 'CHANGE_CURRENT_SHOP',
    HAS_NO_SHOP: 'HAS_NO_SHOP',
};

let shops = [];
let current_shop = {};
let has_no_shop = false;
let listeners = {
    [EVENT_TYPES.CHANGE_SHOPS]: {},
    [EVENT_TYPES.CHANGE_CURRENT_SHOP]: {},
    [EVENT_TYPES.HAS_NO_SHOP]: {},
};

function broadcast(event_type) {
    for (let key in listeners[event_type]) {
        listeners[event_type][key]();
    }
}

function register(event_type, key, callback) {
    listeners[event_type][key] = callback;
}

function unregister(event_type, key) {
    delete listeners[event_type][key];
}

function getShops() {
    return shops;
}

function hasNoShop() {
    return has_no_shop;
}

async function loadShops() {
    try {
        const promises = [ShopApi.getShops('lazada'), ShopApi.getShops('shopee')];
        const results = await Promise.all(promises);
        shops = [
            ...results[0].shops.map(shop => ({ ...shop, type: 'lazada' })),
            ...results[1].shops.map(shop => ({ ...shop, type: 'shopee', id: shop.shop_id, name: shop.shop_name })),
        ];
        current_shop = shops[0] || {};
        if (shops.length === 0) {
            has_no_shop = true;
            broadcast(EVENT_TYPES.HAS_NO_SHOP);
        } else {
            has_no_shop = false;
        }
        broadcast(EVENT_TYPES.CHANGE_SHOPS);
        broadcast(EVENT_TYPES.CHANGE_CURRENT_SHOP);
    } catch (err) {
        console.error(err);
    }
}

function changeCurrentShop(shop_id) {
    current_shop = shops.find(shop => toString(shop.id) === toString(shop_id)) || {};
    broadcast(EVENT_TYPES.CHANGE_CURRENT_SHOP);
}

function getCurrentShop() {
    return current_shop;
}

authen_service.register('ShopsService', function() {
    if (!authen_service.getUserInfo()) {
        shops = [];
        current_shop = {};
        has_no_shop = false;
        broadcast(EVENT_TYPES.CHEVENT_TYPESANGE_SHOPS);
        broadcast(EVENT_TYPES.CHANGE_CURRENT_SHOP);
        broadcast(EVENT_TYPES.HAS_NO_SHOP);
    }
});

export {EVENT_TYPES, register, unregister, getShops, loadShops, changeCurrentShop, getCurrentShop, hasNoShop};
