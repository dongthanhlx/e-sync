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

    render() {
        const {
            buttonLabel,
            className,
            on_change_general,
            on_removed,
            product,
        } = this.props;
        const images = product.images;
        const {modal} = this.state;

        return (
            <div>
                <Button color="danger" onClick={this.toggle}>{buttonLabel}</Button>
                <Modal isOpen={modal} toggle={this.toggle} className={className} size="lg" >
                    <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                    <ModalBody>
                        <div>
                            <Dropify
                                // default_url={sr(product, ['images', product.images.length])}
                                on_change_general={url => on_change_general(images.length, url)} 
                                on_removed={() => on_removed(images.length)}
                            />
                        </div>

                        {
                            Array.isArray(images) && images.length > 0 
                                ? images.map((image, index) => (
                                    <div key={index}>
                                        <Dropify
                                            default_url={image}
                                            on_change_general={url => on_change_general(index, url)}
                                            on_removed={() => on_removed(index)}
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