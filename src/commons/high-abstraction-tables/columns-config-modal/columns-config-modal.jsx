import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Button, FormGroup,
    ModalBody, ModalFooter, ModalHeader,
    CustomInput
} from "reactstrap";
import uuidv4 from 'uuid/v4';
import TableColumnsConfigService from '../../../services/table-columns-config-service';
import DraggableModal from "../../draggable-modal/draggable-modal";
import {t} from '../../../services/i18n-service';

class ColumnsConfigModal extends Component {

    _handleCheckColumn(is_checked, index) {
        const {configRegisterName} = this.props;
        const old_columns_config = TableColumnsConfigService.getColumnsConfig(configRegisterName) || [];
        const filtered_columns_config = old_columns_config.filter(i => parseFloat(i) !== parseFloat(index));
        const new_columns_config = is_checked
            ? [...filtered_columns_config, index].sort((a, b) => (parseFloat(a) - parseFloat(b)))
            : filtered_columns_config;
        TableColumnsConfigService.setColumnsConfig(configRegisterName, new_columns_config);
    };

    render() {
        const {isOpen, toggle, columnTitles, configRegisterName} = this.props;
        const columns_config = TableColumnsConfigService.getColumnsConfig(configRegisterName) || [];
        return (
            <DraggableModal className="columns-config-modal" isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>{t('Table columns configuration')}</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        {t('Choose which columns you want to show')}:
                    </FormGroup>
                    <div className="column-list d-flex flex-column flex-wrap">
                        {
                            columnTitles.map((title, index) => {
                                const input_id = uuidv4();
                                return typeof title === 'string'
                                     ? <div className="column-option" key={input_id}>
                                        <CustomInput
                                            id={`column-checkbox-${input_id}`}
                                            type="checkbox"
                                            label={title}
                                            checked={columns_config.includes(index)}
                                            onChange={(e) => {this._handleCheckColumn(e.target.checked, index)}}
                                        />
                                    </div>
                                    : null;
                            })
                        }
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="light" onClick={toggle}>{t('Close')}</Button>
                </ModalFooter>
            </DraggableModal>
        );
    };

}

ColumnsConfigModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    configRegisterName: PropTypes.string.isRequired,
    columnTitles: PropTypes.array.isRequired,
};

export default ColumnsConfigModal;