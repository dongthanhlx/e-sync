import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import {isNumber} from "../../utils/retrieve-value-utils";
import {noti} from "../../services/noti-service";
import {t} from '../../services/i18n-service';

export default class RatingFilter extends Component {

    static propTypes = {
        fixedMaxRating: PropTypes.bool,
        minRating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        maxRating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        onMinRatingChange: PropTypes.func.isRequired,
        onMaxRatingChange: PropTypes.func,
    };

    static renderStars(number_stars) {
        if (parseInt(number_stars) > 0) {
            return (
                <span>{
                    [...Array(parseInt(number_stars)).keys()].map((number) => (
                        <i key={number} className="fa fa-star" />
                    ))
                }</span>
            );
        } else {
            return null;
        }
    };

    static isValidRating(min_rating, max_rating) {
        if (isNumber(min_rating) && isNumber(max_rating)) {
            return parseFloat(min_rating) <= parseFloat(max_rating);
        } else {
            return false;
        }
    };

    _handleChooseMinRating(rating) {
        if (RatingFilter.isValidRating(rating, this.props.maxRating)) {
            this.props.onMinRatingChange(rating);
        } else {
            noti('error', t('Minimum rating must less than or equal to maximum rating'));
        }
    };

    _handleChooseMaxRating(rating) {
        if (RatingFilter.isValidRating(this.props.minRating, rating)) {
            this.props.onMaxRatingChange(rating);
        } else {
            noti('error', t('Maximum rating must greater than or equal to minimum rating'));
        }
    };

    render() {
        const {minRating, maxRating, fixedMaxRating} = this.props;
        return (
            <div className="rating-filter d-flex align-items-center">
                {t('From')}:&nbsp;&nbsp;
                <UncontrolledDropdown>
                    <DropdownToggle caret color="light" className="short-input">
                        {minRating ? RatingFilter.renderStars(minRating) : t('Choose rating')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => {this._handleChooseMinRating(1)}}>{RatingFilter.renderStars(1)}</DropdownItem>
                        <DropdownItem onClick={() => {this._handleChooseMinRating(2)}}>{RatingFilter.renderStars(2)}</DropdownItem>
                        <DropdownItem onClick={() => {this._handleChooseMinRating(3)}}>{RatingFilter.renderStars(3)}</DropdownItem>
                        <DropdownItem onClick={() => {this._handleChooseMinRating(4)}}>{RatingFilter.renderStars(4)}</DropdownItem>
                        <DropdownItem onClick={() => {this._handleChooseMinRating(5)}}>{RatingFilter.renderStars(5)}</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
                {t('To')}:&nbsp;&nbsp;
                {
                    fixedMaxRating
                        ? RatingFilter.renderStars(maxRating)
                        : <UncontrolledDropdown>
                            <DropdownToggle caret color="light" className="short-input">
                                {maxRating ? RatingFilter.renderStars(maxRating) : t('Choose rating')}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => {this._handleChooseMaxRating(1)}}>{RatingFilter.renderStars(1)}</DropdownItem>
                                <DropdownItem onClick={() => {this._handleChooseMaxRating(2)}}>{RatingFilter.renderStars(2)}</DropdownItem>
                                <DropdownItem onClick={() => {this._handleChooseMaxRating(3)}}>{RatingFilter.renderStars(3)}</DropdownItem>
                                <DropdownItem onClick={() => {this._handleChooseMaxRating(4)}}>{RatingFilter.renderStars(4)}</DropdownItem>
                                <DropdownItem onClick={() => {this._handleChooseMaxRating(5)}}>{RatingFilter.renderStars(5)}</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                }
            </div>
        )
    }
}
