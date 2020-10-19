import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import {t} from "../../services/i18n-service";
import Stars from "../stars/stars";

class RatingDropdown extends Component {

    render() {
        const {className, onChange, value, noRatingLabel, ...props} = this.props;
        return (
            <UncontrolledDropdown className={"rating-dropdown " + className} {...props}>
                <DropdownToggle caret color="light">
                    {
                        parseInt(value) === 0 
                            ? <span className="font-weight-bold">{t(noRatingLabel)}</span> 
                            : parseInt(value)
                                ? <Stars numberStars={parseInt(value)}  /> 
                                : t('Choose rating')
                    }
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem onClick={() => {onChange(0)}}>{t(noRatingLabel)}</DropdownItem>
                    <DropdownItem onClick={() => {onChange(1)}}><Stars numberStars={1}/></DropdownItem>
                    <DropdownItem onClick={() => {onChange(2)}}><Stars numberStars={2}/></DropdownItem>
                    <DropdownItem onClick={() => {onChange(3)}}><Stars numberStars={3}/></DropdownItem>
                    <DropdownItem onClick={() => {onChange(4)}}><Stars numberStars={4}/></DropdownItem>
                    <DropdownItem onClick={() => {onChange(5)}}><Stars numberStars={5}/></DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }

}

RatingDropdown.propTypes = {
    ...UncontrolledDropdown.propTypes,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    onChange: PropTypes.func.isRequired,
    noRatingLabel: PropTypes.string,
};

RatingDropdown.defaultProps = {
    noRatingLabel: 'No rating',
};

export default RatingDropdown;