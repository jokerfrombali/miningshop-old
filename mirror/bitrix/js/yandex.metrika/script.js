(function (){

    if (typeof BX === 'undefined' || typeof BX.ajax === 'undefined' || window.ymecInited) {
        return;
    }

    window.ymecInited = true;

    let hasActiveRequest = false;


    BX.ready(function(){
        requestEcommerceActions(true);

        if (typeof jQuery === 'function') {
            jQuery(document).on('ajaxSuccess', function(r){
                if (hasActions()) {
                    requestEcommerceActions();
                }
            });
        }

        BX.addCustomEvent('onAjaxSuccess', function(oResponse, r2, r3){
            if (typeof oResponse !== 'undefined' && oResponse && !oResponse.ecActions && oResponse.status !== 'error') {
                if (hasActions()) {
                    requestEcommerceActions();
                }
            }
        });
    });

    function requestEcommerceActions(processInstant){
        if (hasActiveRequest) {
            return;
        }

        hasActiveRequest = true;
        BX.ajax.runAction('yandex:metrika.yandex_metrika.Ajax.getEcommerceActions')
            .then(function(oResponse) {
                if (oResponse.status === 'success') {
                    if (typeof oResponse.data.actions !== 'undefined') {
                        const actions = oResponse.data.actions;
                        const actionsIds = Object.keys(actions);
                        if (processInstant) {
                            processActions(actions);
                            removeSentActions(actionsIds);
                            hasActiveRequest = false;
                        } else {
                            setTimeout(function () {
                                processActions(actions);
                                removeSentActions(actionsIds);
                                hasActiveRequest = false;
                            }, 2000);
                        }
                    }
                }

                oResponse.ecActions = true;
                return oResponse;
            }, function (oResponse) {
                oResponse.ecActions = true;
                hasActiveRequest = false;
                return oResponse;
            });
    }

    function processActions(actions){
        for (let id in actions) {
            let action = actions[id];

            window.dataLayer.push(action);
        }
    }

    function removeSentActions(actionsIds){
        BX.ajax.runAction('yandex:metrika.yandex_metrika.Ajax.removeEcommerceActions', {
            data: {
                'actionsIds': actionsIds
            }
        })
            .then(function(oResponse) {
                oResponse.ecActions = true;
                return oResponse;
            }, function (oResponse) {
                oResponse.ecActions = true;
                return oResponse;
            });

        BX.setCookie('ym_has_actions', '', {
            expires: -1000,
            path: '/'
        });
    }

    function hasActions(){
        return BX.getCookie('ym_has_actions');
    }

})();