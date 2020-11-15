import React, {Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Dropify from '../../../../../commons/dropify/dropify';
import {safeRetrieve as sr} from '../../../../../utils/retrieve-value-utils';
import './list-image.scss'

class ListImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            images: [],
        };
        // Constructor
    }

    componentDidMount() {
        this.setState({
            images: this.props.product.images,
        })
    }

    componentDidUpdate(prev_props, prev_state) {
        if (prev_state.modal !== this.state.modal) {
            if (this.state.modal) {
                this.setState({
                    images: this.props.product.images,
                })
            } else {
                this.props.on_change_general(this.state.images)
            }
        }
    }

    toggle = () => {
        this.setState({modal: !this.state.modal});
    };

    addImage(url) {
        const images = this.state.images.slice();
        images.push(url);
        this.setState({
            images: images,
        })
    }

    updateImage(index, url) {
        const images = this.state.images.slice();
        images[index] = url;
        this.setState({
            images: images,
        })
    }

    removeImage(index) {
        const images = this.state.images.slice();
        images.splice(index, 1);
        this.setState({
            images: images,
        });
    }

    render() {
        const {
            buttonLabel,
            className,
        } = this.props;
        // const images = product.images;
        const {
            modal,
            images,
        } = this.state;

        return (
            <div>
                <Button color="danger" onClick={this.toggle}>{buttonLabel}</Button>
                <Modal isOpen={modal} toggle={this.toggle} className={className} size="lg" >
                    <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                    <ModalBody className='list-image'>
                        {
                            Array.isArray(images) && images.length > 0 
                                ? images.map((image, index) => (
                                    <div key={index}>
                                        <Dropify
                                            default_url={image}
                                            on_change_general={url => this.updateImage(index, url)}
                                            on_removed={() => this.removeImage(index)}
                                        />
                                    </div>
                                ))
                                : null
                        }
                        <div>
                            <Dropify
                                default_url={null}
                                on_change_general={url => {this.addImage(url)}} 
                                // on_removed={() => on_removed(images.length)}
                            />
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}


export default ListImage;