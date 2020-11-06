import React, {Component} from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import $ from 'jquery';
import {noti} from '../../services/noti-service';
import {upload_static} from '../../api/upload-static';

export default class Dropify extends Component {

    constructor(props) {
        super(props);
        this.id = uuidv4();
    }

    componentDidMount() {
        const {on_change_general, on_removed} = this.props;
        const dropify = $(`#dropify_${this.id}`).dropify();
        $(`#dropify_${this.id}`).on('change', async function() {
            const file = this.files[0];
            try {
                const file_url = await upload_static(file);
                on_change_general(file_url);
            } catch (err) {
                console.error('Dropify cannot upload file:', err.message);
                noti('error', 'Dropify cannot upload file');
            }
        });
        
        dropify.on('dropify.afterClear', function() {
            on_removed();
        });
    }

    render() {
        const {default_url} = this.props;
        
        return (
            <input id={`dropify_${this.id}`} type="file" {...(default_url ? {'data-default-file': default_url} : {})} />
        )
    }
}

Dropify.propTypes = {
    default_url: PropTypes.string,
    on_change_general: PropTypes.func.isRequired,
    on_removed: PropTypes.func.isRequired,
};
