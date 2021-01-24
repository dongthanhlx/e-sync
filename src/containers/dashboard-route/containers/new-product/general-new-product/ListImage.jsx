import React, {Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import Dropify from '../../../../../commons/dropify/dropify';
import LazadaInput from '../../../../../commons/lazada-input/lazada-input';
import TableWithItemPattern from '../../../../../commons/table-with-item-pattern/table-with-item-pattern';
import VariationValueTableItem from './variation-value-table-item';
import {make_empty_variation_value} from './general-init-product-form';
import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';
import add_image from '../../../../../assets/images/normal-use/add-image.svg';
import './list-image.scss'

class ListImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            general_product: props.general_product,
        };
        // Constructor
        this.handle_change_general_form = this.handle_change_general_form.bind(this);
    }

    // shouldComponentUpdate() {
    //     return this.state.modal;
    // }

    componentDidUpdate(prev_props, prev_state) {
        if (prev_state.modal !== this.state.modal) {
            if (this.state.modal) {
                this.setState({
                    general_product: this.props.general_product
                })
            } else {
                this.props.on_change_general(this.state.general_product);
            }
        }
    }

    toggle = () => {
        this.setState({modal: !this.state.modal});
    };

    get_variation_table_titles() {
        const {general_product} = this.props;
        const fixed_titles_1 = ['Seller SKU', 'Số lượng', 'Giá gốc', 'Giá bán']
        const fixed_titles_2 = ['']
        const volatile_titles = [];
        if (sr(general_product, ['variation_attributes', '0', 'name'])) {
            volatile_titles.push(general_product.variation_attributes[0].name);
        }
        if (sr(general_product, ['variation_attributes', '1', 'name'])) {
            volatile_titles.push(general_product.variation_attributes[1].name);
        }
        return fixed_titles_1.concat(volatile_titles).concat(fixed_titles_2);
    }

    handle_change_general_form(path, value) {
        const {general_product} = this.state;
        const new_product = Object.assign({}, general_product);
        let setter = new_product;
        for (let i = 0; i < path.length; i += 1) {
            if (i === path.length - 1) {
                console.log('valueeee: ' + value);
                console.log(setter);
                // if (value === '') setter.splice(i, 1);
                // else setter[path[i]] = value;
                setter[path[i]] = value;
            } else {
                setter[path[i]] = setter[path[i]] || {};
            }
            setter = setter[path[i]]
        }

        this.setState({
            general_product: new_product
        })
    }

    render() {
        const {
            editmode,
            className,
        } = this.props;
        
        const {
            modal,
            general_product,
        } = this.state;
        const images = sr(general_product, ['images']);

        console.log('render listtt');
            
        return (
            <div className='text-center'>
                <button className="btn btn-outline-info waves-effect p-2 rounded" onClick={this.toggle}>
                    <img src={add_image} alt="add-image" style={{'width': '24px'}} />
                </button>
                <Modal isOpen={modal} toggle={this.toggle} className={className} size="lg" >
                    <ModalHeader toggle={this.toggle}>Thông tin chi tiết sản phẩm</ModalHeader>
                    <ModalBody>
                        <div className="list-image">
                            {
                                Array.isArray(images) && images.length > 0 
                                    ? images.map((image, index) => (
                                        <div key={index}>
                                            <Dropify
                                                default_url={image}
                                                on_change_general={url => this.handle_change_general_form(['images', index], url)}
                                                on_removed={() => this.handle_change_general_form(['images', index], '')}
                                            />
                                        </div>
                                    ))
                                    : null
                            }
                            <div>
                                <Dropify
                                    default_url={null}
                                    on_change_general={url => {this.handle_change_general_form(['images', images.length], url)}} 
                                    on_removed={() => {}}
                                />
                            </div>
                        </div>

                        <div>
                            <FormGroup>
                                <Label for="gp_sellersku" className="required-field">Seller SKU</Label>
                                <Input 
                                    type="text" id="gp_sellersku" 
                                    value={sr(general_product, ['seller_sku'])}
                                    onChange={e => {this.handle_change_general_form(['seller_sku'], e.target.value)}} 
                                />
                            </FormGroup>

                            <div className='mb-5 attributes-group-1'>
                                <FormGroup>
                                    <Label for="gp_package_width" className="required-field">Chiều rộng (cm)</Label>
                                    <Input 
                                        type="number" id="gp_package_width" 
                                        value={sr(general_product, ['package_width'])}
                                        onChange={e => {this.handle_change_general_form(['package_width'], e.target.value)}} 
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="gp_package_length" className="required-field">Chiều dài (cm)</Label>
                                    <Input 
                                        type="number" id="gp_package_length" 
                                        value={sr(general_product, ['package_length'])}
                                        onChange={e => {this.handle_change_general_form(['package_length'], e.target.value)}} 
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="gp_package_height" className="required-field">Chiều cao (cm)</Label>
                                    <Input 
                                        type="number" id="gp_package_height" 
                                        value={sr(general_product, ['package_height'])}
                                        onChange={e => {this.handle_change_general_form(['package_height'], e.target.value)}} 
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="gp_package_weight" className="required-field">Cân nặng (kg)</Label>
                                    <Input 
                                        type="number" id="gp_package_weight" 
                                        value={sr(general_product, ['package_weight'])}
                                        onChange={e => {this.handle_change_general_form(['package_weight'], e.target.value)}} 
                                    />
                                </FormGroup>
                            </div>

                            <div className="mb-5 attributes-group-2">
                                <FormGroup>
                                    <Label for="gp_variation_attribute_1_name" className="required-field">Tên biến thể 1</Label>
                                    <Input 
                                        type="text" id="gp_variation_attribute_1_name" 
                                        disabled={editmode}
                                        value={sr(general_product, ['variation_attributes', '0', 'name'])}
                                        onChange={e => {this.handle_change_general_form(['variation_attributes', '0', 'name'], e.target.value)}} 
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="gp_variation_attribute_1_options" className="required-field">
                                        Các lựa chọn của biến thể 1 - được cách nhau bởi dấu ","
                                    </Label>
                                    <Input 
                                        type="text" id="gp_variation_attribute_1_options" 
                                        disabled={editmode}
                                        value={sr(general_product, ['variation_attributes', '0', 'options']).join(', ')}
                                        onChange={e => {
                                            this.handle_change_general_form(['variation_attributes', '0', 'options'], e.target.value.trim().split(/\s*,\s*/))
                                        }} 
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="gp_variation_attribute_2_name" className="required-field">Tên biến thể 2</Label>
                                    <Input 
                                        type="text" id="gp_variation_attribute_2_name" 
                                        disabled={editmode}
                                        value={sr(general_product, ['variation_attributes', '1', 'name'])}
                                        onChange={e => {this.handle_change_general_form(['variation_attributes', '1', 'name'], e.target.value)}} 
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="gp_variation_attribute_2_options" className="required-field">
                                        Các lựa chọn của biến thể 2 - được cách nhau bởi dấu ","
                                    </Label>
                                    <Input 
                                        type="text" id="gp_variation_attribute_2_options" 
                                        disabled={editmode}
                                        value={sr(general_product, ['variation_attributes', '1', 'options']).join(', ')}
                                        onChange={e => {
                                            this.handle_change_general_form(['variation_attributes', '1', 'options'], e.target.value.trim().split(/\s*,\s*/))
                                        }} 
                                    />
                                </FormGroup>
                            </div>

                            <div className="mb-5">
                                {
                                    editmode
                                        ? null
                                        : <FormGroup>
                                            <Button 
                                                color="primary" 
                                                onClick={e => {
                                                    this.handle_change_general_form(
                                                        ['variation_values'], 
                                                        [...sr(general_product, ['variation_values']), make_empty_variation_value()]
                                                    )
                                                }}
                                                className='py-2 font-weight-bold'
                                            >
                                                <i className="fa fa-plus" /> Thêm biến thể
                                            </Button>
                                        </FormGroup>
                                }
                                <div className="table-responsive">
                                    <TableWithItemPattern
                                        bordered striped
                                        className="variation-values-table"
                                        titles={this.get_variation_table_titles()}
                                        items={sr(general_product, ['variation_values'])}
                                        itemPattern={VariationValueTableItem}
                                        itemKeyGen={item => item.id}
                                        itemProps={{
                                            editmode,
                                            variation_attributes: sr(general_product, ['variation_attributes']),
                                            variation_values: sr(general_product, ['variation_values']),
                                            on_change_general: this.handle_change_general_form,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default ListImage;