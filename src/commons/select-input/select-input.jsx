import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {filter} from "../../utils/filter";
import SelectedItem from "./selected-item/selected-item";
import {isIdenticalArrays} from "../../utils/identical-arrays";

const BACKSPACE_KEY_CODE = 8;

class SelectInput extends Component {

    static produceIsSelectedItem(selected_items, item_key_gen) {
        return Array.isArray(selected_items)
            ? selected_items.reduce((current, next) => ({...current, [item_key_gen(next)] : true}), {})
            : {};
    };

    constructor(props) {
        super(props);
        this.state = {
            is_focusing: false,
            keep_focusing: false,
            label_input: '',
            is_selected_item: props.multiple ? SelectInput.produceIsSelectedItem(props.value, props.itemIdGen) : {},
        };
        this._handleCancelSelect = this._handleCancelSelect.bind(this);
        this._handleSingleSelectItem = this._handleSingleSelectItem.bind(this);
        this._handleMultipleSelectItem = this._handleMultipleSelectItem.bind(this);
        this._handleMultipleDeleteItem = this._handleMultipleDeleteItem.bind(this);
        this._handleBackspacePressOnSearchBox = this._handleBackspacePressOnSearchBox.bind(this);
        this._handleSearchChange = this._handleSearchChange.bind(this);
    };

    componentDidUpdate(prevProps, prevState) {
        const {multiple, itemIdGen, value} = this.props;
        if (multiple && !isIdenticalArrays(prevProps.value, value, (a, b) => itemIdGen(a) === itemIdGen(b))) {
            this.setState({is_selected_item: SelectInput.produceIsSelectedItem(value, itemIdGen)});
        }
        if (this.state.is_focusing) {
            this.search_box.focus();
        } else {
            this.search_box.blur();
        }
    };

    _handleSingleSelectItem(item) {
        const {onSelect} = this.props;
        this.setState({label_input: '', is_focusing: false});
        onSelect(item);
    };

    _handleMultipleSelectItem(item) {
        const {itemIdGen, onSelect, value} = this.props;
        const new_value = [...value, item];
        const is_selected_item = {...this.state.is_selected_item, [itemIdGen(item)]: true};
        this.setState({is_selected_item});
        onSelect(new_value);
    };

    _handleMultipleDeleteItem(item) {
        const {itemIdGen, onSelect, value} = this.props;
        const new_value = value.filter(selected_item => itemIdGen(selected_item) !== itemIdGen(item));
        onSelect(new_value);
    };

    _handleCancelSelect() {
        const {onCancel} = this.props;
        this.setState({
            label_input: '',
            is_selected_item: {},
        });
        onCancel();
    };

    _handleBackspacePressOnSearchBox(e) {
        const {multiple, value} = this.props;
        const {label_input} = this.state;
        if (e.keyCode === BACKSPACE_KEY_CODE && !label_input) {
            if (multiple) {
                this._handleMultipleDeleteItem(value[value.length - 1]);
            } else {
                this.props.onSelect({});
            }
        }
    };

    _handleItemClick(item) {
        const {multiple} = this.props;
        const selectHandler = multiple ? this._handleMultipleSelectItem : this._handleSingleSelectItem;
        selectHandler(item);
    };

    _handleSearchChange(e) {
        this.setState({label_input: e.target.value});
        this.props.onSearchChange(e.target.value);
    }

    render() {
        const {multiple, className, items: raw_items, itemIdGen, itemLabelGen, value, placeholder} = this.props;
        const {is_focusing, keep_focusing, label_input, is_selected_item} = this.state;
        const items = filter(label_input, raw_items, itemLabelGen).filter(item => !is_selected_item[itemIdGen(item)]);
        return (
            <div
                tabIndex={0}
                className={`select-input ${is_focusing ? 'focus' : ''} ${className}`}
                onFocus={() => {if (!is_focusing) {this.setState({is_focusing: true})}}}
                onBlur={() => {if (!keep_focusing) {this.setState({is_focusing: false})}}}
                onMouseEnter={() => {this.setState({keep_focusing: true})}}
                onMouseLeave={() => {this.setState({keep_focusing: false})}}
            >
                <div className="input-zone">
                    {
                        multiple && value.length > 0
                            ? value.map(selected_item => (
                                <SelectedItem
                                    multiple
                                    key={itemIdGen(selected_item)}
                                    item={selected_item}
                                    itemLabelGen={itemLabelGen}
                                    onDelete={this._handleMultipleDeleteItem}
                                />
                            ))
                            : !multiple && itemIdGen(value)
                                ? <SelectedItem
                                    item={value}
                                    itemLabelGen={itemLabelGen}
                                />
                                : null
                    }
                    <input
                        tabIndex={-1}
                        className="search-box"
                        placeholder={((multiple && value.length > 0) || (!multiple && itemIdGen(value))) ? '' : placeholder}
                        value={label_input}
                        onChange={this._handleSearchChange}
                        onKeyDown={this._handleBackspacePressOnSearchBox}
                        ref={(el) => {this.search_box = el}}
                    />
                </div>
                {
                    (!multiple && (label_input || itemIdGen(value))) || (multiple && value.length) > 0
                        ? <i className="fa fa-times" onClick={this._handleCancelSelect} />
                        : null
                }
                {
                    is_focusing
                        ? <div className="item-list">
                            {
                                items.length > 0
                                    ? items.map(item => (
                                        <button
                                            key={itemIdGen(item)} tabIndex={0}
                                            type="button" className="select-item"
                                            onClick={() => {this._handleItemClick(item)}}
                                        >
                                            {itemLabelGen(item)}
                                        </button>
                                    ))
                                    : <div className="no-items text-center text-secondary">No items</div>
                            }
                        </div>
                        : null
                }
            </div>
        );
    };

}

SelectInput.propTypes = {
    multiple: PropTypes.bool,
    className: PropTypes.string,
    items: PropTypes.array.isRequired,
    itemIdGen: PropTypes.func.isRequired,
    itemLabelGen: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
    onSelect: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};

SelectInput.defaultProps = {
    onSearchChange: () => {},
};

export default SelectInput;