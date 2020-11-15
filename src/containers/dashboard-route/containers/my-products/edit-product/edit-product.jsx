import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import {Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Label, Button} from 'reactstrap';
import classnames from 'classnames';
import MainContent from '../../../../../commons/layout/main-content';

import GeneralNewProduct from '../../new-product/general-new-product/general-new-product';
import LazadaNewProduct from '../../new-product/lazada-new-product/lazada-new-product';
import ShopeeNewProduct from '../../new-product/shopee-new-product/shopee-new-product';
import TikiNewProduct from '../../new-product/tiki-new-product/tiki-new-product';

import {get_lazada_product_form} from '../../../../../api/lazada-product-form';
import {get_tiki_product_form} from '../../../../../api/tiki-product-form';
import {get_shopee_product_form} from '../../../../../api/shopee-product-form';

import {lazada_sync, general_product_to_lazada_variations} from '../../new-product/lazada-new-product/lazada-sync';
import {tiki_sync, general_variations_to_tiki_variants} from '../../new-product/tiki-new-product/tiki-sync';
import {shopee_sync} from '../../new-product/shopee-new-product/shopee-sync';

import {
    make_general_init_product_form, 
    from_db_make_general_init_product_form, 
    make_general_publish_payload
} from '../../new-product/general-new-product/general-init-product-form';
import {
    make_lazada_init_product_form, 
    from_db_make_lazada_init_product_form, 
    make_lazada_publish_payload
} from '../../new-product/lazada-new-product/lazada-init-product-form';
import {
    make_tiki_init_product_form, 
    from_db_make_tiki_init_product_form, 
    make_tiki_publish_payload
} from '../../new-product/tiki-new-product/tiki-init-product-form';
import {
    make_shopee_init_product_form, 
    from_db_make_shopee_init_product_form, 
    make_shopee_publish_payload
} from '../../new-product/shopee-new-product/shopee-init-product-form';

import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';
import {noti} from '../../../../../services/noti-service';
import {v4 as uuidv4} from 'uuid';

import {LAZADA_PRODUCT_FIXED_FIELDS} from '../../../../../constants/lazada-product-fixed-fields';
import {TIKI_PRODUCT_FIXED_FIELDS} from '../../../../../constants/tiki-product-fixed-fields';

import LoadingButton from '../../../../../commons/loading-button/loading-button';
import {get_one_product, update_product} from '../../../../../api/products';
import {parse} from 'query-string';
import Image from '../../../../../commons/image/image';
import logo_lazada from '../../../../../assets/images/normal-use/logo-lazada.png';
import logo_tiki from '../../../../../assets/images/normal-use/logo-tiki.png';
import logo_shopee from '../../../../../assets/images/normal-use/logo-shopee.png';

const TABS = {
    general: 'general',
    lazada: 'lazada',
    tiki: 'tiki',
    shopee: 'shopee',
}

export default class EditProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product_id: '',

            current_active_tab: TABS.tiki,
            create_for: {lazada: true, tiki: true, shopee: true},
            publishing: false,

            general_product: make_general_init_product_form(),
            general_images_key: uuidv4(),

            lazada_additional_fields: [],
            lazada_product: make_lazada_init_product_form(),

            tiki_additional_fields: [],
            tiki_product: make_tiki_init_product_form(),

            shopee_additional_fields: [],
            shopee_product: make_shopee_init_product_form(),

            editorRemountKey1: uuidv4(),
            editorRemountKey2: uuidv4(),
        };
        this.handle_general_variations_change = this.handle_general_variations_change.bind(this);
        this.handle_publish = this.handle_publish.bind(this);
        this.next_tab = this.next_tab.bind(this);
        this.prev_tab = this.prev_tab.bind(this);
    }

    componentDidMount() {
        this.get_product();
    }

    componentWillUnmount() {
        this.setState({
            product_id: '',

            current_active_tab: TABS.lazada,
            create_for: {lazada: true, tiki: true, shopee: true},
            publishing: false,

            general_product: make_general_init_product_form(),
            general_images_key: uuidv4(),

            lazada_additional_fields: [],
            lazada_product: make_lazada_init_product_form(),

            tiki_additional_fields: [],
            tiki_product: make_tiki_init_product_form(),

            shopee_additional_fields: [],
            shopee_product: make_shopee_init_product_form(),

            editorRemountKey1: uuidv4(),
            editorRemountKey2: uuidv4(),
        })
    }

    componentDidUpdate(prev_props, prev_state) {
        if (sr(prev_state, ['lazada_product', 'PrimaryCategory']) !== sr(this.state, ['lazada_product', 'PrimaryCategory'])) {
            if (sr(this.state, ['lazada_product', 'PrimaryCategory'])) {
                const old_additional_fields = this.state.lazada_additional_fields;
                this.get_lazada_additional_fields().then(success => {
                    if (success) {
                        const lazada_product = Object.assign({}, this.state.lazada_product);
                        for (let field of old_additional_fields) {
                            const field_path = LazadaNewProduct.make_attribute_path(field);
                            const last_prop = field_path.slice(-1)[0];
                            try {
                                const field_context = sr(lazada_product, field_path.slice(0, -1));
                                delete field_context[last_prop];
                            } catch (err) {
                                console.error(err);
                            }
                        }
                        this.setState({lazada_product});
                    }
                });
            } else {
                this.setState({lazada_product: make_lazada_init_product_form(), lazada_additional_fields: []});
            }
        }
        if (sr(prev_state, ['tiki_product', 'category_id']) !== sr(this.state, ['tiki_product', 'category_id'])) {
            if (sr(this.state, ['tiki_product', 'category_id'])) {
                const old_additional_fields = this.state.tiki_additional_fields;
                this.get_tiki_additional_fields().then(success => {
                    if (success) {
                        const tiki_product = Object.assign({}, this.state.tiki_product);
                        for (let field of old_additional_fields) {
                            const field_path = TikiNewProduct.make_attribute_path(field);
                            const last_prop = field_path.slice(-1)[0];
                            try {
                                const field_context = sr(tiki_product, field_path.slice(0, -1));
                                delete field_context[last_prop];
                            } catch (err) {
                                console.error(err);
                            }
                        }
                        this.setState({tiki_product});
                    }
                });
            } else {
                this.setState({tiki_product: make_tiki_init_product_form(), tiki_additional_fields: []});
            }
        }
        if (sr(prev_state, ['shopee_product', 'category_id']) !== sr(this.state, ['shopee_product', 'category_id'])) {
            if (sr(this.state, ['shopee_product', 'category_id'])) {
                const old_additional_fields = this.state.shopee_additional_fields;
                this.get_shopee_additional_fields().then(success => {
                    if (success) {
                        const shopee_product = Object.assign({}, this.state.shopee_product);
                        for (let field of old_additional_fields) {
                            const field_path = ShopeeNewProduct.make_attribute_path(field);
                            const last_prop = field_path.slice(-1)[0];
                            try {
                                const field_context = sr(shopee_product, field_path.slice(0, -1));
                                delete field_context[last_prop];
                            } catch (err) {
                                console.error(err);
                            }
                        }
                        this.setState({shopee_product});
                    }
                });
            } else {
                this.setState({shopee_product: make_shopee_init_product_form(), shopee_additional_fields: []});
            }
        }
    }

    async get_product() {
        try {
            const {product_id} = parse(this.props.location.search);
            const product = await get_one_product(product_id);
            const create_for = {lazada: false, tiki: false, shopee: false};
            for (let platform of product.create_for) {
                create_for[platform] = true;
            }

            const general_product = from_db_make_general_init_product_form(product.general_product);

            let {lazada_product, tiki_product, shopee_product} = this.state;
            if (create_for.lazada) {
                lazada_product = from_db_make_lazada_init_product_form(product.lazada_product.payload, general_product);
            }
            if (create_for.tiki) {
                tiki_product = from_db_make_tiki_init_product_form(product.tiki_product.payload, general_product);
            }
            if (create_for.shopee) {
                shopee_product = await from_db_make_shopee_init_product_form(product.shopee_product.payload);
            }

            this.setState({
                product_id: product._id,
                create_for,
                general_product,
                general_images_key: uuidv4(),
                lazada_product,
                tiki_product,
                shopee_product,
            });
            console.log('get data xonggggggggg');
        } catch (err) {
            console.error(err);
            noti('error', err);
        }
    }

    async get_lazada_additional_fields() {
        try {
            const category_id = sr(this.state, ['lazada_product', 'PrimaryCategory']);
            const {form} = await get_lazada_product_form(category_id);
            const lazada_additional_fields = form.filter(f => !LAZADA_PRODUCT_FIXED_FIELDS[f.name]);
            this.setState({lazada_additional_fields});
            return true;
        } catch (err) {
            console.error(err);
            noti('error', err);
            return false;
        }
    }

    async get_tiki_additional_fields() {
        try {
            const category_id = sr(this.state, ['tiki_product', 'category_id']);
            const {form} = await get_tiki_product_form(category_id);
            const tiki_additional_fields = form.attributes.filter(f => !TIKI_PRODUCT_FIXED_FIELDS[f.code]);
            this.setState({tiki_additional_fields});
            return true;
        } catch (err) {
            console.error(err);
            noti('error', err);
            return false;
        }
    }

    async get_shopee_additional_fields() {
        try {
            const category_id = sr(this.state, ['shopee_product', 'category_id']);
            const {form: shopee_additional_fields} = await get_shopee_product_form(category_id);
            this.setState({shopee_additional_fields});
            return true;
        } catch (err) {
            console.error(err);
            noti('error', err);
            return false;
        }
    }

    toggle_tab(current_active_tab) {
        this.setState({current_active_tab});
    }

    handle_product_change(which_product, value) {
        this.setState({[which_product]: value});
    }

    handle_general_variations_change(new_general_product) {
        // Sync variations with Tiki
        const {variants: tiki_variants} = this.state.tiki_product;
        const new_tiki_option_attributes = new_general_product['variation_attributes'].map(att => att.name);
        const new_tiki_variants = general_variations_to_tiki_variants(
            tiki_variants, 
            new_general_product['variation_values'], 
            new_general_product['variation_attributes']
        );
        const tiki_product = {...this.state.tiki_product, option_attributes: new_tiki_option_attributes, variants: new_tiki_variants};

        // Sync variations with Lazada
        const {Sku: lazada_variations} = this.state.lazada_product.Skus[0];
        const new_lazada_variations = general_product_to_lazada_variations(lazada_variations, new_general_product);
        const lazada_product = {...this.state.lazada_product, Skus: [{Sku: new_lazada_variations}]};

        this.setState({tiki_product, lazada_product});
    }

    is_current_special_tab() {
        const {current_active_tab, create_for} = this.state;
        const result = {is_first: false, is_last: false};
        const showable_tabs = [TABS.lazada, TABS.tiki, TABS.shopee].filter(tab => create_for[tab]);
        if (current_active_tab === TABS.general) {
            result.is_first = true;
        }
        if (current_active_tab === showable_tabs[showable_tabs.length - 1]) {
            result.is_last = true;
        }
        return result;
    }

    next_tab() {
        const {current_active_tab, create_for} = this.state;
        const showable_tabs = [TABS.general].concat([TABS.lazada, TABS.tiki, TABS.shopee].filter(tab => create_for[tab]));
        const i = showable_tabs.findIndex(tab => tab === current_active_tab);
        const nexttab = i + 1 < showable_tabs.length ? showable_tabs[i + 1] : showable_tabs[showable_tabs.length - 1];
        this.setState({current_active_tab: nexttab});
    }

    prev_tab() {
        const {current_active_tab, create_for} = this.state;
        const showable_tabs = [TABS.general].concat([TABS.lazada, TABS.tiki, TABS.shopee].filter(tab => create_for[tab]));
        const i = showable_tabs.findIndex(tab => tab === current_active_tab);
        const prevtab = i - 1 >= 0 ? showable_tabs[i - 1] : showable_tabs[0];
        this.setState({current_active_tab: prevtab});
    }

    async handle_publish() {
        try {
            this.setState({publishing: true});
            const create_for = Object.keys(this.state.create_for).filter(key => this.state.create_for[key]);
            let {product_id, general_product, lazada_product, tiki_product, shopee_product} = this.state;
            
            lazada_product = lazada_sync(lazada_product, general_product);
            tiki_product = tiki_sync(tiki_product, general_product);
            shopee_product = shopee_sync(shopee_product, general_product);

            const payload = {
                create_for,
                general_product: make_general_publish_payload(general_product),
                shopee_product: make_shopee_publish_payload(shopee_product),
                tiki_product: make_tiki_publish_payload(tiki_product),
                lazada_product: make_lazada_publish_payload(lazada_product),
            };

            await update_product(product_id, payload);
            noti('success', 'Product updated successfully');
            this.props.history.push('/my-products');
        } catch (err) {
            console.error(err);
            noti('error', err);
        } finally {
            this.setState({publishing: false});
        }
    }

    render() {
        const {
            current_active_tab, create_for, publishing,
            general_images_key, general_product,
            lazada_additional_fields, lazada_product,
            tiki_additional_fields, tiki_product,
            shopee_additional_fields, shopee_product,
            editorRemountKey1, editorRemountKey2,
        } = this.state;
        const {is_first, is_last} = this.is_current_special_tab();
        return (
            <MainContent className="edit-product">
                <FormGroup className="d-flex align-items-end">
                    <Label for="input_create_for">Product will be published to</Label>
                    <div className="ml-2 d-flex">
                        {
                            create_for.lazada
                                ? <span style={{opacity: 0.8}} className="ml-2">
                                    <Image src={logo_lazada} alt="Lazada" width="3rem" height="auto" />
                                </span>
                                : null
                        }
                        {
                            create_for.tiki
                                ? <span style={{opacity: 0.8}} className="ml-2">
                                    <Image src={logo_tiki} alt="Tiki" width="3rem" height="auto" />
                                </span>
                                : null
                        }
                        {
                            create_for.shopee
                                ? <span style={{opacity: 0.8}} className="ml-2 border rounded shopee-logo">
                                    <Image src={logo_shopee} alt="Shopee" width="3rem" height="auto" />
                                </span>
                                : null
                        }
                    </div>
                </FormGroup>
                <Nav tabs>
                    {/* <NavItem>
                        <NavLink
                            className={classnames({active: current_active_tab === TABS.general})}
                            onClick={() => {this.toggle_tab(TABS.general)}}
                        >
                            General
                        </NavLink>
                    </NavItem> */}
                    {
                        create_for.lazada
                            ? <NavItem>
                                <NavLink
                                    className={classnames({active: current_active_tab === TABS.lazada})}
                                    onClick={() => {this.toggle_tab(TABS.lazada)}}
                                >
                                    Lazada
                                </NavLink>
                            </NavItem>
                            : null
                    }
                    {
                        create_for.tiki
                            ? <NavItem>
                                <NavLink
                                    className={classnames({active: current_active_tab === TABS.tiki})}
                                    onClick={() => {this.toggle_tab(TABS.tiki)}}
                                >
                                    Tiki
                                </NavLink>
                            </NavItem>
                            : null
                    }
                    {
                        create_for.shopee
                            ? <NavItem>
                                <NavLink
                                    className={classnames({active: current_active_tab === TABS.shopee})}
                                    onClick={() => {this.toggle_tab(TABS.shopee)}}
                                >
                                    Shopee
                                </NavLink>
                            </NavItem>
                            : null
                    }
                </Nav>
                <TabContent activeTab={current_active_tab}>
                    {
                        create_for.lazada
                            ? <TabPane tabId={TABS.lazada}>
                                <LazadaNewProduct 
                                    editmode
                                    editor_remount_key_1={editorRemountKey1}
                                    editor_remount_key_2={editorRemountKey2}
                                    images_key={general_images_key}
                                    brand_name={sr(general_product, ['brand'])}
                                    images={sr(general_product, ['images'])}
                                    general_product={general_product}
                                    product={lazada_product} 
                                    additional_fields={lazada_additional_fields} 
                                    on_change_general={general_product => {this.handle_product_change('general_product', general_product)}}
                                    on_change={product => {this.handle_product_change('lazada_product', product)}} 
                                    on_variations_change={this.handle_general_variations_change}
                                />
                            </TabPane>
                            : null
                    }
                    {
                        create_for.tiki
                            ? <TabPane tabId={TABS.tiki}>
                                <TikiNewProduct
                                    editmode
                                    images_key={general_images_key}
                                    general_product={general_product}
                                    product={tiki_product} 
                                    additional_fields={tiki_additional_fields}
                                    on_change_general={general_product => {this.handle_product_change('general_product', general_product)}}
                                    on_change={product => {this.handle_product_change('tiki_product', product)}}
                                    on_variations_change={this.handle_general_variations_change}
                                />
                            </TabPane>
                            : null
                    }
                    {
                        create_for.shopee
                            ? <TabPane tabId={TABS.shopee}>
                                <ShopeeNewProduct
                                    product={shopee_product} additional_fields={shopee_additional_fields}
                                    on_change={product => {this.handle_product_change('shopee_product', product)}}
                                />
                            </TabPane>
                            : null
                    }
                </TabContent>
                <div className="d-flex align-items-center justify-content-between publish">
                    <div className="d-flex">
                        <Button outline color="secondary" disabled={is_first} onClick={this.prev_tab}>
                            <i className="fa fa-chevron-left" /> Back
                        </Button>
                        <Button outline color="primary" className="ml-2" disabled={is_last} onClick={this.next_tab}>
                            Next <i className="fa fa-chevron-right" />
                        </Button>
                    </div>
                    <LoadingButton 
                        disabled={!is_last} loading={publishing} 
                        size="lg" color="primary" 
                        onClick={this.handle_publish}
                    >
                        Update
                    </LoadingButton>
                </div>
            </MainContent>
        )
    }

}
