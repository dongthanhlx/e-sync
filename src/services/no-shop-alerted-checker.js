import authen_service from './authen-service';

let ns_alerted = false;

function alerted() {
    ns_alerted = true;
}

function is_alerted() {
    return ns_alerted;
}

authen_service.register('NoShopAlertedChecker', function() {
    if (!authen_service.getUserInfo()) {
        ns_alerted = false;
    }
});

export default {alerted, is_alerted};
