import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {noti} from "../../services/noti-service";
import {Button} from "reactstrap";

class CategoryFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            category_path: [],
            show_categories: false,
            show_abort_category_button: !!props.defaultFilterLabel,
            filter_label: props.defaultFilterLabel || 'Choose category',
        };
        this._handleAbortCategory = this._handleAbortCategory.bind(this);
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.defaultFilterLabel !== this.props.defaultFilterLabel) {
            this.setState({
                filter_label: nextProps.defaultFilterLabel,
                show_abort_category_button: true,
            });
        }
    };

    _makeCategoryPathString(category_path) {
        const {nameGen} = this.props;
        return category_path.map(category => nameGen(category)).join(' / ');
    };

    _isParentCategory(category) {
        const {childrenGen} = this.props;
        return Array.isArray(childrenGen(category)) && childrenGen(category).length > 0;
    };

    _handleToggleCategoryMenu(show_categories) {
        this.setState({
            show_categories,
            category_path: show_categories ? this.state.category_path : []
        });
    };

    _handleHoverCategory(category, level) {
        this.setState({
            category_path: [...this.state.category_path.slice(0, level), category]
        });
    };

    _handleChooseCategory(category, level) {
        const minimumValidLevel = this.props.minimumValidLevel || 0;
        if (level >= minimumValidLevel) {
            const {category_path} = this.state;
            this.props.onChangeCategory(category);
            this.setState({
                filter_label: this._makeCategoryPathString(category_path),
                show_abort_category_button: true,
            });
            this._handleToggleCategoryMenu(false);
        } else {
            noti('error', 'Please choose a more specific category');
        }
    };

    _handleAbortCategory() {
        this.setState({
            category_path: [],
            show_categories: false,
            show_abort_category_button: false,
            filter_label: 'Choose category',
        });
        this.props.onAbortCategory();
    };

    _renderCategoryList(category_list, level) {
        const {idGen, nameGen} = this.props;
        const {category_path} = this.state;
        const current_hovered_category = category_path[level] || {};
        return (
            <ul>{
                category_list.map(category => (
                    <li
                        key={idGen(category)}
                        className={
                            (idGen(category) === idGen(current_hovered_category) ? 'active' : '')
                            + " d-flex align-items-center justify-content-between"
                        }
                        onMouseEnter={() => {this._handleHoverCategory(category, level)}}
                        onClick={() => {this._handleChooseCategory(category, level)}}
                    >
                        {nameGen(category)}
                        {
                            this._isParentCategory(category)
                                ? <i className="fa fa-angle-right" />
                                : null
                        }
                    </li>
                ))
            }</ul>
        );
    };

    render() {
        const {categories, idGen, childrenGen, className} = this.props;
        const {category_path, show_categories, show_abort_category_button, filter_label} = this.state;
        return (
            <div className={`category-filter d-flex position-relative ${className}`}>
                <span
                    className="category-trigger d-flex align-items-center justify-content-center"
                    onClick={() => {this._handleToggleCategoryMenu(!show_categories)}}
                >
                    {filter_label}
                    <i className="fa fa-angle-down" />
                </span>
                {
                    show_abort_category_button
                        ? <Button
                            color="light"
                            className="abort-category-button"
                            onClick={this._handleAbortCategory}
                        >
                            <i className="fa fa-times" />
                        </Button>
                        : null
                }
                {
                    show_categories
                        ? <div
                            className="category-multilist d-flex align-items-stretch"
                            onMouseLeave={() => {this._handleToggleCategoryMenu(false)}}
                        >
                            {
                                Array.isArray(categories) && categories.length > 0
                                    ? <Fragment>
                                        <div className="category-list">
                                            {this._renderCategoryList(categories, 0)}
                                        </div>
                                        {
                                            category_path.map((category, i) => (
                                                this._isParentCategory(category)
                                                    ? <div key={`parent-${idGen(category)}`} className="category-list">
                                                        {this._renderCategoryList(childrenGen(category), i + 1)}
                                                    </div>
                                                    : null
                                            ))
                                        }
                                    </Fragment>
                                    : <div className="category-list-empty">
                                        No category
                                    </div>
                            }
                        </div>
                        : null
                }
            </div>
        );
    }
}

CategoryFilter.propTypes = {
    categories: PropTypes.array.isRequired,
    idGen: PropTypes.func.isRequired,
    nameGen: PropTypes.func.isRequired,
    childrenGen: PropTypes.func.isRequired,
    defaultFilterLabel: PropTypes.string,
    onChangeCategory: PropTypes.func.isRequired,
    onAbortCategory: PropTypes.func.isRequired,
    minimumValidLevel: PropTypes.number,
    className: PropTypes.string,
};

export default CategoryFilter;