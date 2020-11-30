import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import {Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Label as div, Button} from 'reactstrap';
import classnames from 'classnames';
import MainContent from '../../../../commons/layout/main-content';
import LazadaNewProduct from './lazada-new-product/lazada-new-product';
import {get_lazada_product_form} from '../../../../api/lazada-product-form';
import {get_tiki_product_form} from '../../../../api/tiki-product-form';
import {get_shopee_product_form} from '../../../../api/shopee-product-form';
import {safeRetrieve as sr} from '../../../../utils/retrieve-value-utils';
import {LAZADA_PRODUCT_FIXED_FIELDS} from '../../../../constants/lazada-product-fixed-fields';
import {noti} from '../../../../services/noti-service';
import TikiNewProduct from './tiki-new-product/tiki-new-product';
import {TIKI_PRODUCT_FIXED_FIELDS} from '../../../../constants/tiki-product-fixed-fields';
import uuidv4 from 'uuid/v4';
import {lazada_sync, general_product_to_lazada_variations} from './lazada-new-product/lazada-sync';
import {tiki_sync, general_variations_to_tiki_variants} from './tiki-new-product/tiki-sync';
import {shopee_sync} from './shopee-new-product/shopee-sync';
import LoadingButton from '../../../../commons/loading-button/loading-button';
import GeneralNewProduct from './general-new-product/general-new-product';
import {make_general_init_product_form, make_general_publish_payload} from './general-new-product/general-init-product-form';
import {make_lazada_init_product_form, make_lazada_publish_payload} from './lazada-new-product/lazada-init-product-form';
import {make_tiki_init_product_form, make_tiki_publish_payload} from './tiki-new-product/tiki-init-product-form';
import {make_shopee_init_product_form, make_shopee_publish_payload} from './shopee-new-product/shopee-init-product-form';
import ShopeeNewProduct from './shopee-new-product/shopee-new-product';
import {create_product} from '../../../../api/products';
import Image from '../../../../commons/image/image';
import logo_lazada from '../../../../assets/images/normal-use/logo-lazada.png';
import logo_tiki from '../../../../assets/images/normal-use/logo-tiki.png';
import logo_shopee from '../../../../assets/images/normal-use/logo-shopee.png';
import withTabPaneActiveState from '../../../../commons/with-tab-pane-active-state/with-tab-pane-active-state';
import next_arrow from '../../../../assets/images/normal-use/next-arrow.svg';
import back_arrow from '../../../../assets/images/normal-use/back-arrow.svg';

const TABS = {
    general: 'general',
    lazada: 'lazada',
    tiki: 'tiki',
    shopee: 'shopee',
}

export default class NewProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current_active_tab: TABS.lazada,
            create_for: {lazada: true, tiki: true, shopee: false},
            publishing: false,

            general_product: make_general_init_product_form(),
            general_images_key: uuidv4(),

            lazada_additional_fields: [],
            lazada_product: make_lazada_init_product_form(),

            tiki_additional_fields: [],
            tiki_product: make_tiki_init_product_form(),

            shopee_additional_fields: [],
            shopee_product: make_shopee_init_product_form(),

            lazadaEditorKey: uuidv4(),
            tikiEditorKey: uuidv4(),
        };
        this.handle_general_variations_change = this.handle_general_variations_change.bind(this);
        this.handle_publish = this.handle_publish.bind(this);
        this.next_tab = this.next_tab.bind(this);
        this.prev_tab = this.prev_tab.bind(this);
    }

    componentDidMount() {
        // Sync variation with Lazada and Tiki - the first time
        this.handle_general_variations_change(this.state.general_product);
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
        switch (current_active_tab) {
            case TABS.lazada:
                this.setState({lazadaEditorKey: uuidv4()});
                break;
            case TABS.tiki:
                this.setState({tikiEditorKey: uuidv4()});
                break;
            default:
                break;
        }
        this.setState({current_active_tab});
    }

    handle_product_change(which_product, value) {
        console.log(value);
        this.setState({[which_product]: value});
    }

    handle_general_variations_change(new_general_product) {
        // Sync variations with Tiki
        const {variants: tiki_variants} = this.state.tiki_product;
        const new_tiki_option_attributes = new_general_product['variation_attributes'].map(att => att.name);
        const new_tiki_variants = general_variations_to_tiki_variants(
            tiki_variants, 
            new_general_product['variation_values'], 
            new_general_product['variation_attributes'],
            new_general_product['images']
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
            let {general_product, lazada_product, tiki_product, shopee_product} = this.state;

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

            // console.log(payload);
            await create_product(payload);
            noti('success', 'Product created successfully');
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
            lazadaEditorKey, tikiEditorKey,
        } = this.state;
        console.log(general_product);
        const {is_first, is_last} = this.is_current_special_tab();
        return (
            <MainContent className="new-product">
                <FormGroup className="d-flex align-items-center">
                    <div>Sản phẩm sẽ được phát hành trên </div>
                    <div className="ml-2 d-flex">
                        <span 
                            style={create_for.lazada ? {} : {opacity: 0.2}} className="ml-2 lazada-logo"
                            onClick={() => {this.setState({create_for: {...create_for, lazada: !create_for.lazada}})}}
                        >
                            <Image src={logo_lazada} alt="Lazada" width="3rem" height="auto" />
                        </span>
                        <span 
                            style={create_for.tiki ? {} : {opacity: 0.2}} className="ml-2 tiki-logo"
                            onClick={() => {this.setState({create_for: {...create_for, tiki: !create_for.tiki}})}}
                        >
                            <Image src={logo_tiki} alt="Tiki" width="3rem" height="auto" />
                        </span>
                        <span 
                            style={create_for.shopee ? {} : {opacity: 0.2}} className="ml-2 border rounded shopee-logo d-none"
                            onClick={() => {this.setState({create_for: {...create_for, shopee: !create_for.shopee}})}}
                        >
                            <Image src={logo_shopee} alt="Shopee" width="3rem" height="auto" />
                        </span>
                    </div>
                </FormGroup>
                <Nav tabs>
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
                            ? <TabPane tabId={TABS.lazada} style={{'backgroundColor': '#eff0f5'}}>
                                <LazadaNewProduct 
                                    // images_key={general_images_key}
                                    editorKey={lazadaEditorKey}
                                    activeTab={current_active_tab}
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
                            ? <TabPane tabId={TABS.tiki} style={{'backgroundColor': 'rgb(239, 239, 239)'}} >
                                <TikiNewProduct
                                    // images_key={general_images_key}
                                    editorKey={tikiEditorKey}
                                    activeTab={current_active_tab}
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
                            ? <TabPane tabId={TABS.shopee} style={{'display': 'none'}}>
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
                        {/* <Button outline color="secondary" disabled={is_first} onClick={this.prev_tab}>
                            <i className="fa fa-chevron-left" /> Back
                            <img src={back_arrow} alt="back_arrow"/>
                        </Button>
                        <Button outline color="primary" className="ml-2" disabled={is_last} onClick={this.next_tab}>
                            Next <i className="fa fa-chevron-right" />
                            <img src={next_arrow} alt="next_arrow"/>
                        </Button> */}

                        <button className="btn btn-default px-0 py-2 rounded-circle" disabled={is_first} onClick={this.prev_tab} style={{'width': '37px'}}>
                            <img src={back_arrow} alt="back_arrow" style={{'width': '21px'}} />
                        </button>

                        <button className="btn btn-default px-0 py-2 rounded-circle" disabled={is_last} onClick={this.next_tab} style={{'width': '37px'}}>
                            <img src={next_arrow} alt="next_arrow" style={{'width': '21px'}} />
                        </button>
                    </div>
                    <LoadingButton 
                        disabled={!is_last} loading={publishing} 
                        size="sm" color="primary" 
                        onClick={this.handle_publish}
                    >
                        Publish
                    </LoadingButton>
                </div>
            </MainContent>
        )
    }

}
