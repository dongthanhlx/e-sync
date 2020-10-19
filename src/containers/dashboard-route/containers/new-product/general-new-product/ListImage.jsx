import React, {Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Dropify from '../../../../../commons/dropify/dropify';
import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';
import $ from 'jquery';
import AspectRatio from 'react-aspect-ratio';

class ListImage extends Component {
    constructor(props) {
        super(props);
        this.state = {modal: false};
        // Constructor
    }

    toggle = () => {
        this.setState({modal: !this.state.modal});
    };

    handle_change_form = (path, value) => {
        const {product, add_image, on_change_general, on_variations_change} = this.props;
        const new_product = Object.assign({}, product);
        let setter = new_product;
    
        for (let i = 0; i < path.length; i += 1) {
            if (i === path.length - 1) {
                setter[path[i]] = value;
            } else {
                setter[path[i]] = setter[path[i]] || {};
            }
            setter = setter[path[i]]
        }
        
        add_image(value);
        
        on_change_general(new_product);
        
        if (path[0] === 'variation_attributes' || path[0] === 'variation_values') {
            on_variations_change(new_product);
        }
    }

    resetDropify() {
        $('.input-dropify input').dropify();
    }

    render() {
        const {
            buttonLabel,
            className,
            product,
        } = this.props;
        const {modal} = this.state;

        return (
            <div>
                <Button color="danger" onClick={this.toggle}>{buttonLabel}</Button>
                <Modal isOpen={modal} toggle={this.toggle} className={className} size="lg" >
                    <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                    <ModalBody>
                        <div>
                            <Dropify
                                default_url={sr(product, ['images', product.images.length])}
                                on_change_general={url => {this.handle_change_form(['images', product.images.length], url)}} 
                                on_removed={() => {this.handle_change_form(['images', product.images.length], '')}} 
                            />
                        </div>

                        {
                            Array.isArray(product.images) && product.images.length > 0 
                                ? product.images.map((image, index) => (
                                    <div key={index}>
                                        <Dropify
                                            default_url={sr(product, ['images', index])}
                                            on_change_general={url => {this.handle_change_form(['images', index], url)}} 
                                            on_removed={() => {this.handle_change_form(['images', index], '')}} 
                                        />
                                    </div>
                                ))
                                : null
                        }
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}


export default ListImage;