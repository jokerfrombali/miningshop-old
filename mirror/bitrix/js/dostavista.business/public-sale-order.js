window.addEventListener('DOMContentLoaded', function () {
    if (typeof(BX) === 'undefined') {
        return;
    }

    if (typeof(BX.Sale) === 'undefined') {
        return;
    }

    if (typeof(BX.Sale.OrderAjaxComponent) === 'undefined') {
        return;
    }

    try {
        var getJSON = function (url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'json';
            xhr.onload = function () {
                var status = xhr.status;
                if (status === 200) {
                    callback(null, xhr.response);
                } else {
                    callback(status);
                }
            };
            xhr.send();
        };

        getJSON('/bitrix/admin/dostavista_business_checkout_delivery_data_ajax.php', function(err, data) {
            if (!err) {
                try {
                    BX.Sale.OrderAjaxComponent.editPaySystemBlock(true);
                } catch (e) {

                }
                try {
                    BX.Sale.OrderAjaxComponent.editActivePropsBlock(true);
                } catch(e) {

                }

                var fieldsMap = [
                    ['delivery_date_field_ids', 'delivery_date'],
                    ['delivery_start_time_field_ids', 'delivery_start_time'],
                    ['delivery_finish_time_field_ids', 'delivery_finish_time'],
                ];

                for (var f in fieldsMap) {
                    var propValue = data[fieldsMap[f][1]];
                    for (var i in data[fieldsMap[f][0]]) {
                        var prop = document.getElementById('bx-soa-properties').querySelector('[name="ORDER_PROP_' + data[fieldsMap[f][0]][i] + '"]');
                        if (prop) {
                            prop.value = propValue;
                        }
                    }
                }

                BX.Sale.OrderAjaxComponent.sendRequest();
            }
        });
    } catch (e) {

    }

    document.addEventListener('change', function(event) {
        var name = event.target.name;
        var tagName = event.target.tagName.toLowerCase();

        var listenElements = {
            'input'   : true,
            'select'  : true,
            'textarea': true,
        };

        if (
            name
            && typeof(listenElements[tagName]) !== 'undefined'
            && document.getElementById('bx-soa-properties').querySelector('[name="' + name + '"]')
        ) {
            // Задержку установил из за того, что в некоторых шаблонах (например Аспро) может дублироваться номер телефона, и значение должно быть считано из нового поля. Если без задержки, то наш пересчет возьмет еще пустое значение
            setTimeout(function() {
                sendOrderFormAjaxRequest();
            }, 200);
        }
    });

    var passedWaitingMs = 0;
    var maxWaitingCountMs = 5000;

    var sendOrderFormAjaxRequest = function () {
        if (!BX.Sale.OrderAjaxComponent.BXFormPosting) {
            BX.Sale.OrderAjaxComponent.sendRequest();
            passedWaitingMs = 0;
            return;
        }

        if (passedWaitingMs < maxWaitingCountMs) {
            setTimeout(function() {
                passedWaitingMs += 100;
                sendOrderFormAjaxRequest();
            }, 100);
        }
    }
});
