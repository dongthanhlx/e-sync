import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Button} from 'reactstrap';
import {t} from '../../services/i18n-service';

function FeatureNotAvailable({required_level}) {
    const supported_for = required_level.map((lv, i) => (
        i === required_level.length - 1
            ? required_level.length === 1
                ? <span key={lv}><span className="text-primary font-weight-bold">{lv}</span>{t('_user').trim()}.</span>
                : <span key={lv}>{t('or')} <span className="text-primary font-weight-bold">{lv}</span>{t('_user').trim()}.</span>
            : <span key={lv}><span className="text-primary font-weight-bold">{lv}</span>{t('_user').trim()}, </span>
    ));
    return (
        <div className="feature-not-available">
            <h3 className="text-secondary">{t('This feature is not available')}</h3>
            <div className="text-secondary">{t('We\'re sorry, but this feature is only supported for')} {supported_for}</div>
            <Link to="/settings/billing">
                <Button color="primary" className="mt-3">{t('Upgrade your plan')}</Button>
            </Link>
        </div>
    );
}

FeatureNotAvailable.propTypes = {
    required_level: PropTypes.array.isRequired,
};

export default FeatureNotAvailable;