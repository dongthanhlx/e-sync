import React, {Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/ui/widgets/slider';
import 'jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon';
import {
    isValidDate, stampToDateValue, dateValueToStamp,
    stampToDateTimeValue, dateTimeValueToStamp,
    VI_DATE_FORMAT, VI_DATE_TIME_FORMAT
} from "../../utils/date-transform-utils";

class DatePicker extends Component {

    constructor(props) {
        super(props);
        this.stampToValue = props.withTime ? stampToDateTimeValue : stampToDateValue;
        this.valueToStamp = props.withTime ? dateTimeValueToStamp : dateValueToStamp;
        this.initPickerMethod = props.withTime ? 'datetimepicker' : 'datepicker';
        this.TIME_FORMAT = props.withTime ? VI_DATE_TIME_FORMAT : VI_DATE_FORMAT;
    };

    componentDidMount() {
        this._updateValueByProps();
        $(this.date_picker).change(this._handlePickerChange.bind(this));
        $(this.date_picker)[this.initPickerMethod]({dateFormat: 'dd/mm/yy', showAnim: 'fadeIn'})
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        this._updateValueByProps();
    };

    componentWillUnmount() {
        $(this.date_picker).datepicker('destroy');
    };

    _handlePickerChange(e) {
        const {value} = e.target;
        this._updateValueByProps();
        if (isValidDate(value, this.TIME_FORMAT)) {
            this.props.onChange(this.valueToStamp(value));
        }
    };

    _updateValueByProps() {
        this.date_picker.value = this.stampToValue(this.props.value);
    };

    render() {
        const {className, disabled, placeholder, helptext} = this.props;
        return (
            <div className="sel-datepicker">
                <input
                    disabled={disabled}
                    autoComplete="off"
                    className={`date-picker form-control ${className}`}
                    placeholder={placeholder}
                    ref={(el) => {this.date_picker = el}}
                />
                {
                    helptext
                        ? <small className="form-text text-muted">{helptext}</small>
                        : null
                }
            </div>
        );
    };

}

DatePicker.propTypes = {
    disabled: PropTypes.bool,
    className: PropTypes.string,
    withTime: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    helptext: PropTypes.string,
};

DatePicker.defaultProps = {
    className: '',
    placeholder: '',
};

export default DatePicker;