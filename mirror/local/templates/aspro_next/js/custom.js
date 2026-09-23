$(function () {
    $(window).on('resize', function () {
        if ($('.mobileheader-v1').is(':visible')) {
            $('.mobileheader-v1 .logo-block').width(
                $('.mobileheader-v1').width() - $('.mobileheader-v1 .burger').outerWidth() - $('.mobileheader-v1 .right-icons').outerWidth()
            );
        }
    }).trigger('resize');
});

//////////////////////////////////////////////////////
// Калькулятор
//////////////////////////////////////////////////////
function getPropProfit() {
    var r = false;
    $('.props_list.nbg:eq(0) .char_name').each(function(){
        if ($.trim($(this).text()) == 'Доходность') {
            r = $.trim($(this).next().text());
            r = r.replace(/[^0-9,]/g,"");
            r = r.replace(',', '.');
            r = Number(r);
        }
    });
    $('.props.props_list .char_name').each(function(){
        if ($.trim($(this).text()) == 'Доходность') {
            r = $.trim($(this).parent().next().text());
            r = r.replace(/[^0-9,]/g,"");
            r = r.replace(',', '.');
            r = Number(r);
        }
    });
    return r;
}

function getPropPower() {
    var r = false;
    $('.props_list.nbg:eq(0) .char_name').each(function(){
        var text = $.trim($(this).text());
        if (text == 'Потребление' || text == 'Энергопотребление, W') {
            r = $.trim($(this).next().text());
            r = r.replace(/[^0-9,\.]/g,"");
            r = r.replace(',', '.');
            r = Number(r);
        }
    });
    $('.props.props_list .char_name').each(function(){
        var text = $.trim($(this).text());
        if (text == 'Потребление' || text == 'Энергопотребление, W') {
            r = $.trim($(this).parent().next().text());
            r = r.replace(/[^0-9,\.]/g,"");
            r = r.replace(',', '.');
            r = Number(r);
        }
    });
    return r;
}

function getPropPrice(){
    var r = false,
        $price = $('.price_value:eq(0)');
    if($price.length) {
        var price = $price.text();
        price = price.replace(/[^0-9,\.]/g,"");
        price = price.replace(',', '.');
        price = Number(price);
        if(price) {
            r = price;
        }
    }
    return r;
}

var staticProfit = 0,
    staticPower = 0,
    staticPrice = 0;

function clickCalcBtn(e){
    e.preventDefault();
    if (!$('.calc-popup-shadow').length) {
        var html = '';
        html += '<div class="calc-popup-wrap"><div class="calc-popup-shadow"></div>';
        html += '<div class="calc-popup-content">';
        html += '<p><span>1</span> Стоимость электричества: <input type="text" value="3.50"> руб.</p>';
        html += '<p><span>2</span> Ваш доход за день: <strong></strong></p>';
        html += '<p><span>3</span> Ваш доход за месяц: <strong></strong></p>';
        html += '<p><span>4</span> Окупится за: <strong></strong></p>';
        html += '<p><a href="" class="btn btn-default">Закрыть</a></p>';
        html += '</div>';
        html += '</div>';
        $('body').append(html);

        $('.calc-popup-shadow, .calc-popup-wrap a').on('click', closeCalcPopup);
        $('.calc-popup-wrap input').on('change', execCalc).on('keyup', execCalc);

    }

    staticProfit = getPropProfit();
    staticPower = getPropPower();
    staticPrice = getPropPrice();
    $('.calc-popup-wrap input').trigger('change');
    $('.calc-popup-shadow').fadeIn('fast');
    $('.calc-popup-wrap').fadeIn('fast');
}

function formatMoney(number, decPlaces, decSep, thouSep) {
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
        decSep = typeof decSep === "undefined" ? "." : decSep;
    thouSep = typeof thouSep === "undefined" ? "," : thouSep;
    var sign = number < 0 ? "-" : "";
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    var j = (j = i.length) > 3 ? j % 3 : 0;

    return sign +
        (j ? i.substr(0, j) + thouSep : "") +
        i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
        (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
}

function num_word(value, words){
    value = Math.abs(value) % 100;
    var num = value % 10;
    if(value > 10 && value < 20) return words[2];
    if(num > 1 && num < 5) return words[1];
    if(num == 1) return words[0];
    return words[2];
}

function closeCalcPopup(e){
    e.preventDefault();
    $('.calc-popup-shadow').fadeOut('fast');
    $('.calc-popup-wrap').fadeOut('fast');
}

function execCalc(){
    var val = $(this).val();
    var r0 = '---';
    var r1 = '---';
    var r2 = '---';

    val = Number(val.replace(',', '.').replace(/[^0-9.]/g,""));
    if(!isNaN(val) && val >= 0) {
        var inDat = staticProfit - (staticPower / 1000 * val * 24);
        if (inDat && inDat >= 0) {
            r0 = formatMoney(inDat, 2, '.', ' ')+' руб.';
            r1 = formatMoney(inDat * 31, 2, '.', ' ')+' руб.';
            var days = Math.ceil(staticPrice/inDat);
            r2 = formatMoney(days, 0, '.', '')+' '+num_word(days, ['день', 'дня', 'дней']);
        }
    }

    $('.calc-popup-wrap strong:eq(0)').text(r0);
    $('.calc-popup-wrap strong:eq(1)').text(r1);
    $('.calc-popup-wrap strong:eq(2)').text(r2);
}

function addCalcButton() {
    var html = '<a href="#" class="transparent btn-lg btn btn-default white transition_bg btn-calc"><span>Калькулятор окупаемости</span></a>';
    if ($('.props.props_list').length) {
        $('.props.props_list').append(html);
    } else {
        $(html).insertAfter($('.props_list.nbg:eq(0)'));
    }

    $('.btn-calc').on('click', clickCalcBtn);
}

$(function(){
    if(!$('.catalog_detail.detail').length) return false;

    if (getPropProfit() && getPropPower() && getPropPrice()) {
        addCalcButton();
    } else {
        $(window).on('load', function(){
            if (getPropProfit() && getPropPower() && getPropPrice()) {
                addCalcButton();
            }
        });
    }
});

//////////////////////////////////////////////////////
// Сортировка
//////////////////////////////////////////////////////
function getParamVal (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.search);
    return (results !== null) ? results[1] || 0 : false;
}

function updateURLParameter(url, param, paramVal)
{
    var TheAnchor = null;
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";

    if (additionalURL)
    {
        var tmpAnchor = additionalURL.split("#");
        var TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];
        if(TheAnchor)
            additionalURL = TheParams;

        tempArray = additionalURL.split("&");

        for (var i=0; i<tempArray.length; i++)
        {
            if(tempArray[i].split('=')[0] != param)
            {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }
    else
    {
        var tmpAnchor = baseURL.split("#");
        var TheParams = tmpAnchor[0];
        TheAnchor  = tmpAnchor[1];

        if(TheParams)
            baseURL = TheParams;
    }

    if(TheAnchor)
        paramVal += "#" + TheAnchor;

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

$(function(){
    if ($('.sort_filter').length) {
        var currentCat = window.location.pathname.split('/');
        if (typeof(currentCat[2]) == 'undefined') return;
        if (currentCat[2] != 'asic_maynery' && currentCat[2] != 'videokarty' && currentCat[2] != 'fermy_dlya_mayninga') return;


        var currentSort = getParamVal('sort');
        var currentOrder = getParamVal('order');
        var htmlPc = '';
        var htmlMobile = '';
        var link = '';
        var c = [];
        var sortText = '';

        if (currentSort == 'PROPERTY_NH_PROFIT') {
            c = ['current ' + currentOrder];
            link = updateURLParameter(window.location.href, 'order', currentOrder == 'desc' ? 'asc' : 'desc');
        } else {
            c = ['desc'];
            link = updateURLParameter(window.location.href, 'order', 'desc');
            link = updateURLParameter(link, 'sort', 'PROPERTY_NH_PROFIT');
        }
        htmlPc += '<a href="'+link+'" class="sort_btn '+c.join(' ')+' CATALOG_AVAILABLE" rel="nofollow"><i class="icon" title="По доходности "></i><span>По доходности</span><i class="arr icons_fa"></i></a>';

        if (currentSort == 'PROPERTY_NH_PAYBACK') {
            c = ['current ' + currentOrder];
            link = updateURLParameter(window.location.href, 'order', currentOrder == 'desc' ? 'asc' : 'desc');
        } else {
            c = ['desc'];
            link = updateURLParameter(window.location.href, 'order', 'desc');
            link = updateURLParameter(link, 'sort', 'PROPERTY_NH_PAYBACK');
        }
        htmlPc += '<a href="'+link+'" class="sort_btn '+c.join(' ')+' CATALOG_AVAILABLE" rel="nofollow"><i class="icon" title="По окупаемости "></i><span>По окупаемости</span><i class="arr icons_fa"></i></a>';

        link = updateURLParameter(window.location.href, 'order', 'asc');
        link = updateURLParameter(link, 'sort', 'PROPERTY_NH_PROFIT');
        c = ['asc'];
        if (currentSort == 'PROPERTY_NH_PROFIT' && currentOrder == 'asc') {
            c.push('current');
            sortText = 'По доходности (Возрастание)';
        }
        htmlMobile += '<li><a href="'+link+'" class="sort_btn '+c.join(' ')+' CATALOG_AVAILABLE" rel="nofollow"><span>По доходности (Возрастание)</span></a></li>';

        link = updateURLParameter(window.location.href, 'order', 'desc');
        link = updateURLParameter(link, 'sort', 'PROPERTY_NH_PROFIT');
        c = ['desc'];
        if (currentSort == 'PROPERTY_NH_PROFIT' && currentOrder == 'desc') {
            c.push('current');
            sortText = 'По доходности (Убывание)';
        }
        htmlMobile += '<li><a href="'+link+'" class="sort_btn '+c.join(' ')+' CATALOG_AVAILABLE" rel="nofollow"><span>По доходности (Убывание)</span></a></li>';

        link = updateURLParameter(window.location.href, 'order', 'asc');
        link = updateURLParameter(link, 'sort', 'PROPERTY_NH_PAYBACK');
        c = ['asc'];
        if (currentSort == 'PROPERTY_NH_PAYBACK' && currentOrder == 'asc') {
            c.push('current');
            sortText = 'По окупаемости (Возрастание)';
        }
        htmlMobile += '<li><a href="'+link+'" class="sort_btn '+c.join(' ')+' CATALOG_AVAILABLE" rel="nofollow"><span>По окупаемости (Возрастание)</span></a></li>';

        link = updateURLParameter(window.location.href, 'order', 'desc');
        link = updateURLParameter(link, 'sort', 'PROPERTY_NH_PAYBACK');
        c = ['desc'];
        if (currentSort == 'PROPERTY_NH_PAYBACK' && currentOrder == 'desc') {
            c.push('current');
            sortText = 'По окупаемости (Убывание)';
        }
        htmlMobile += '<li><a href="'+link+'" class="sort_btn '+c.join(' ')+' CATALOG_AVAILABLE" rel="nofollow"><span>По окупаемости (Убывание)</span></a></li>';


        $('.sort_filter').append(htmlPc);

        if (sortText != '') {
            $('.bx_sort_filter .bx_filter_select_text').text(sortText);
        }

        var waitFilter = setInterval(function(){
            if($('#popup-window-content-smartFilterDropDownASPRO_FILTER_SORT').length) {
                clearInterval(waitFilter);
                if (sortText != '') {
                    $('#popup-window-content-smartFilterDropDownASPRO_FILTER_SORT ul .current').removeClass('current');
                }
                $('#popup-window-content-smartFilterDropDownASPRO_FILTER_SORT ul').append(htmlMobile);
            }
        }, 200);
    }
});

$(function () {
    if ($('#smartfilter').length) {
        setTimeout(function () {
            $('.catalog_block .catalog_item:not(.ussa)').each(function () {
                $(this).addClass('ussa');
                if ($(this).find('.item-stock > .order').length) {
                    var id = $(this).find('.sa_block .item-stock').data('id');
                    if (!$(this).find('.to-subscribe').length) {
                        $(this).find('.counter_wrapp > div').html(
                            '<div style="display: none"><span class="small ss to-subscribe nsubsc btn btn-default transition_bg" data-name="subscribe" data-param-form_id="subscribe" data-param-id="' + id + '" rel="nofollow" data-item="' + id + '"><i></i><span>Подписаться</span></span>' +
                            '<span class="small ss in-subscribe btn btn-default transition_bg" rel="nofollow" style="display:none;" data-item="' + id + '"><i></i><span>Отписаться</span></span></div>'
                        );
                    } else {
                        $(this).find('.to-subscribe').parent().find('>span').wrapAll('<div style="position:relative; width:0; height:0; overflow: hidden;" />');
                    }
                    $('<span data-id="' + id + '" data-email="" class="btn-default w_icons ss btn btn-danger transition_bg send-r46 vb-stock-notification">Уведомить о поступлении</span>' +
                        '<div class="VB-form-popup" name="vbForm" id="vb-form">' +
                        '<form name="r46" class="VB-form-container">' +
                        '<input type="hidden" id="rees46-id" value="' + id + '">' +
                        '<input type="email" class="inputtext rees46-initialized" id="email" placeholder="Ваш е-мейл" style="margin-bottom:10px" name="email" required="">' +
                        '<div class="button_block wide">' +
                        '<button type="submit" onclick="VBsubmitForm()" class="btn-lg w_icons ss btn btn-default transition_bg" style="margin-right:30px">Отправить</button>' +
                        '<button type="button" onclick="VBcloseForm()" class="btn-lg w_icons ss white btn-default btn">Закрыть</button>' +
                        '</div>' +
                        '</form>' +
                        '</div>').insertAfter($(this).find('.to-subscribe').parent());
                    $(this).find('.send-r46').on('click', VBopenForm);
                    $(this).find('.VB-form-container button[type="submit"]').on('click', VBsubmitForm);
                    $(this).find('.VB-form-container button[type="button"]').on('click', VBcloseForm);
                }
            });
        }, 500);
    }
});

var subscribeActive = null;


function VBopenForm(e) {
    if (typeof (e) == 'undefined') {
        var $form = $('#vb-form');
    } else {
        var $form = $(this).next();
    }

    if ($form.data('active') === 'cansel') {
        $form.parent().find('div:eq(0) > span:eq(1)').trigger('click');
    } else {
        $form.show();
    }
    return false;
}

function VBsubmitForm(e) {
    if (typeof (e) == 'undefined') {
        var t = $('.VB-form-popup button[type="submit"]')[0];
    } else {
        var t = this;
    }
    let email = $(t).parents('form').find('>input[type="email"]').val();
    let item = $(t).parents('form').find('>input[type="hidden"]').val();
    r46('subscribe_trigger', 'product_available', {email: email, item: item});
    $(t).parents('form').parent().parent().find('div:eq(0) > span:eq(0)').trigger('click');
    $(t).parents('form').hide();
    return false;
}

function VBcloseForm(e) {
    if (typeof (e) == 'undefined') {
        var t = $('.VB-form-popup button[type="button"]')[0];
    } else {
        var t = this;
    }
    $(t).parents('form').hide();
    return false;
}

$(function () {

    setInterval(function () {
        $('.VB-form-popup').each(function () {
            var $form = $(this);
            var $el = $form.parent().find('.to-subscribe'),
                $btn = $form.prev();
            $form.data('active', $el.css('display') == 'none' ? 'cansel' : 'active');
            $btn.text($el.css('display') == 'none' ? 'Отменить подписку' : 'Уведомить о поступлении');
        });
        $('.VB-form-container').on('submit', function (e) {
            e.preventDefault();
        });
    }, 200);

});

$(function () {
    $('.quantity_block_wrapper .cheaper_form').append('<a href="#" class="desh">Уведомить о снижении цены</a><div class="e-popup-content" style="display: none; z-index: 10; position: absolute; top: 100%; margin-top: 4px; right: 0; width: 100%; height:50px; background:#fff; border-radius: 10px; border: 1px solid #0088cc;"><input type="text" placeholder="Ваш e-mail" style="background: none; border: none; height: 100%; padding: 0 50px 0 15px;box-sizing: border-box;outline: none;"><button style="position: absolute;top: 1px; right: 1px; width: 50px; bottom: 1px; border: none; border-radius: 0 10px 10px 0; cursor: pointer;">OK</button></div>');
    $('.desh').on('click', function (e) {
        e.preventDefault();
        var $content = $('.e-popup-content');
        $content[$content.is(':visible') ? 'hide' : 'show']();

        var w = 0;
        $('.quantity_block_wrapper>div').each(function () {
            w += $(this).outerWidth(true)
        });

        $content.width(w);
    });

    $('.quantity_block_wrapper').css('position', 'relative');

    $('.e-popup-content button').on('click', function (e) {
        e.preventDefault();
        var email = $(this).parent().find('input').val();
        var re = /\S+@\S+\.\S+/;
        if (re.test(email)) {
            var obj = {
                email: email,
                item: $('meta[itemprop="sku"]').attr('content'),
                price: $('.price_matrix_wrapper > .price').data('value')
            };
            r46('subscribe_trigger', 'product_price_decrease', obj);
            $('.desh').text('Вы успешно подписаны');
        }
        $('.e-popup-content').hide();
    });
});

$(function(){
    $('.top_big_banners').each(function(){
        var $wrap = $(this),
            resizeActive = false,
            bannerId = 'bannerId',

            resize = function(){
                if (!resizeActive) {
                    resizeActive = true;
                    $('#'+bannerId).html('');
                    var bodyWidth = $('body').width();
                    if (bodyWidth >= 992 && bodyWidth <= 1710) {
                        var h = 670 - ((1710 - bodyWidth) * 0.27855),
                            s = 1 - ((1710 - bodyWidth) * 0.00059),
                            css = '.top_big_banners{width:1650px;height:'+h+'px;position: relative;overflow:hidden;}';
                        css += '.top_big_banners>div{transform: scale('+s+');transform-origin: left top;}';
                        $('#'+bannerId).html(css);
                    } else {
                        $('#'+bannerId).html('');
                    }
                    $(window).trigger('resize');
                    resizeActive = false;
                }
            },

            init = function(){
                $('body').append('<style id="'+bannerId+'"></style>');
                $(window).on('resize', resize).trigger('resize');
            };

        init();
    });

    var lastEPrice = null,
        waitExecTimeout = null,
        waitExecTimeout2 = null,
        lastSizeType = $(window).width() < 1300,
        lastValEe = null,
        sortIndex = null,
        sortVector = null,
        waitExecTimeout3 = null;

    var filterNameMobile = function(name){
        var replace = {
            'Видеокарта': '',
            'видеокартах': '',
            'Майнинг-ферма': 'Ферма',
            'Radeon': '',
            'GeForce': '',
            'БУ': '',
            '(Наличие)': '',
            'Без гарантии': '',
            'Без разгона': '',
            'Встроенный БП': '',
        };
        for(var k in replace) {
            name = name.replaceAll(k, replace[k]);
        }
        name = $.trim(name);
        name = name.replace(/ +/g, ' ');
        return name;
    }

    var setData = function() {
        var elect = $('.b-tlist-filter-item-content input[type="text"]:eq(1)').val();
        $('.b-tlist-items').html('');
        $('.b-tlist-loader').show();

        for(var k in tListData) {
            tListData[k].minus = tListData[k].power ? tListData[k].power.replace(/[^0-9]/, '') / 1000 * elect * 24 : null;
            tListData[k].dohod = tListData[k].profit - tListData[k].minus;
            tListData[k].rate = Number(tListData[k].minus) / Number(tListData[k].dohod);

            tListData[k].profitBaks = formatMoney(tListData[k].profit / tListCurse, lastSizeType ? 0 : 2, '.', ' ');
            tListData[k].dohodBaks = formatMoney(tListData[k].dohod / tListCurse, lastSizeType ? 0 : 2, '.', ' ');
            tListData[k].minusBaks = formatMoney(tListData[k].minus / tListCurse, lastSizeType ? 0 : 2, '.', ' ');

            tListData[k].profit1 = formatMoney(tListData[k].profit, lastSizeType ? 0 : 2, '.', ' ');
            tListData[k].dohod = formatMoney(tListData[k].dohod, lastSizeType ? 0 : 2, '.', ' ');
            tListData[k].minus = formatMoney(tListData[k].minus, lastSizeType ? 0 : 2, '.', ' ');
            tListData[k].rate = formatMoney(tListData[k].rate*100, lastSizeType ? 0 : 2, '.', ' ');

            tListData[k].days = Math.ceil(tListData[k].price/(tListData[k].profit - (tListData[k].power.replace(/[^0-9]/, '') / 1000 * elect * 24)))
        }

        var sortList = lastSizeType ? [
            'name',
            'hash',
            'profit'
        ] :[
            'name',
            'algoritm',
            'hash',
            'power',
            'ee',
            'profit',
            'minus',
            'dohod',
            'days',
            'rate',
        ];

        if (sortIndex != null && typeof(sortList[sortIndex]) != 'undefined') {
            tListData.sort(function(a, b){
                var sortOrder = sortVector ? -1 : 1;
                var property = sortList[sortIndex];
                if (!isNaN(Number(a[property])) && !isNaN(Number(a[property]))) {
                    var result = (Number(a[property]) < Number(b[property])) ? -1 : (Number(a[property]) > Number(b[property])) ? 1 : 0;
                } else {
                    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                }
                return result * sortOrder;
            });
        }

        createTable();
    }

    var getRateWrap = function(val){
        var r = '<span class="b-tlist-rate">';
        r += '<span>'+val+'%</span>';
        r += '<span style="width: '+val+'%" class="b-tlist-rate-wrap">';
        r += '<span>'+val+'%</span>';
        r += '</span>';
        r += '</span>';
        return r;
    }

    var createTable = function() {
        $('.b-tlist-items').html('');
        $('.b-tlist-loader').show();
        var baks = $('.b-tlist-money li:eq(0)').hasClass('m-active');
        var baksSuf = !baks ? '$' : ' руб.'
        var html = '';
        var searchText = $.trim($('.b-tlist-filter-item-content input[type="text"]:eq(0)').val());
        html += '<table>';
        html += '<tr>';
        if (lastSizeType) {
            html += '<th class="'+(sortIndex == 0 ? (sortVector ? 'm-sort m-asc' : 'm-sort m-desc') : '')+'">Название<br>Алгоритм / Э/Э';
            html += '<th class="'+(sortIndex == 1 ? (sortVector ? 'm-sort m-asc' : 'm-sort m-desc') : '')+'">Доходность (24 ч.) / Расходы<br>Хешрейт / Потребление</th>';
            html += '<th class="'+(sortIndex == 2 ? (sortVector ? 'm-sort m-asc' : 'm-sort m-desc') : '')+'">Профит / Окупаемость<br>Соотношение доходности и затрат</th>';
        } else {
            html += '<th class="'+(sortIndex == 0 ? (sortVector ? 'm-sort m-asc' : 'm-sort m-desc') : '')+'">Название</th>';
            html += '<th class="'+(sortIndex == 1 ? (sortVector ? 'm-sort m-asc' : 'm-sort m-desc') : '')+'">Алгоритм</th>';
            html += '<th class="'+(sortIndex == 2 ? (sortVector ? 'm-sort m-asc' : 'm-sort m-desc') : '')+'">Хешрейт</th>';
            html += '<th class="'+(sortIndex == 3 ? (sortVector ? 'm-sort m-asc' : 'm-sort m-desc') : '')+'">Потребление</th>';
            html += '<th class="'+(sortIndex == 4 ? (sortVector ? 'm-sort m-asc' : 'm-sort m-desc') : '')+'">Э/Э</th>';
            html += '<th class="'+(sortIndex == 5 ? (sortVector ? 'm-sort m-asc' : 'm-sort m-desc') : '')+'">Доходность (24 ч.)</th>';
            html += '<th class="'+(sortIndex == 6 ? (sortVector ? 'm-sort m-asc' : 'm-sort m-desc') : '')+'">Расходы на электричество</th>';
            html += '<th class="'+(sortIndex == 7 ? (sortVector ? 'm-sort m-asc' : 'm-sort m-desc') : '')+'">Профит</th>';
            html += '<th class="'+(sortIndex == 5 ? (sortVector ? 'm-sort m-asc' : 'm-sort m-desc') : '')+'">Окупаемость</th>';
            html += '<th class="'+(sortIndex == 8 ? (sortVector ? 'm-sort m-asc' : 'm-sort m-desc') : '')+'">Соотношение доходности и затрат</th>';
        }
        html += '</tr>';
        for(var k in tListData) {
            if (searchText == '' || (lastSizeType ? tListData[k].mobile : tListData[k].name).indexOf(searchText) != -1) {
                html += '<tr class="m-'+tListData[k].section+'">';
                var eeSuf = '';
                if ($.trim(tListData[k].algoritm) == 'SHA256') eeSuf = ' W/Th';
                if ($.trim(tListData[k].algoritm) == 'DaggerHashimoto') eeSuf = ' W/Mh';
                var hashSuf = '';
                if ($.trim(tListData[k].algoritm) == 'SHA256') hashSuf = ' Th/s';
                if ($.trim(tListData[k].algoritm) == 'DaggerHashimoto') hashSuf = ' Mh/s';

                if (lastSizeType) {
                    html += '<td><a href="'+tListData[k].url+'" target="_BLANK">'+tListData[k].name+'</a><br>';
                    html += ''+(tListData[k].algoritm ? tListData[k].algoritm : '-')+' / ';
                    html += ''+(tListData[k].ee ? tListData[k].ee+eeSuf : '-')+'</td>';
                    if (baks) {
                        html += '<td>'+(tListData[k].profit1 ? tListData[k].profit1 : '-')+baksSuf+' / ';
                        html += ''+(tListData[k].minus ? tListData[k].minus : '-')+baksSuf+'<br>';
                    } else {
                        html += '<td>'+(tListData[k].profitBaks ? tListData[k].profitBaks : '-')+baksSuf+' / ';
                        html += ''+(tListData[k].minusBaks ? tListData[k].minusBaks : '-')+baksSuf+'<br>';
                    }
                    html += ''+tListData[k].hash+hashSuf+' / ';
                    if (baks) {
                        html += ''+(tListData[k].power ? tListData[k].power : '-')+'W</td>';
                        html += '<td>'+(tListData[k].dohod ? tListData[k].dohod : '-')+baksSuf+' / ';
                    } else  {
                        html += ''+(tListData[k].power ? tListData[k].power : '-')+'W</td>';
                        html += '<td>'+(tListData[k].dohodBaks ? tListData[k].dohodBaks : '-')+baksSuf+' / ';
                    }


                    html += (tListData[k].days ? formatMoney(tListData[k].days, 0, '.', '')+' '+num_word(tListData[k].days, ['день', 'дня', 'дней']) : '-')+'<br>';
                    html += (tListData[k].rate ? getRateWrap(tListData[k].rate) : '-')+'</td>';
                } else {
                    html += '<td><a href="'+tListData[k].url+'" target="_BLANK">'+tListData[k].name+'</a></td>';
                    html += '<td>'+(tListData[k].algoritm ? tListData[k].algoritm : '-')+'</td>';
                    html += '<td>'+tListData[k].hash+hashSuf+'</td>';
                    html += '<td>'+$.trim(tListData[k].power ? tListData[k].power : '-')+'W</td>';
                    html += '<td>'+(tListData[k].ee ? tListData[k].ee+eeSuf : '-')+'</td>';
                    if (baks) {
                        html += '<td>'+(tListData[k].profit1 ? tListData[k].profit1 : '-')+baksSuf+'</td>';
                        html += '<td>'+(tListData[k].minus ? tListData[k].minus : '-')+baksSuf+'</td>';
                        html += '<td>'+(tListData[k].dohod ? tListData[k].dohod : '-')+baksSuf+'</td>';
                    } else  {
                        html += '<td>'+(tListData[k].profitBaks ? tListData[k].profitBaks : '-')+baksSuf+'</td>';
                        html += '<td>'+(tListData[k].minusBaks ? tListData[k].minusBaks : '-')+baksSuf+'</td>';
                        html += '<td>'+(tListData[k].dohodBaks ? tListData[k].dohodBaks : '-')+baksSuf+'</td>';
                    }
                    html += '<td>'+(tListData[k].days ? formatMoney(tListData[k].days, 0, '.', '')+' '+num_word(tListData[k].days, ['день', 'дня', 'дней']) : '-')+'</td>';
                    html += '<td>'+(tListData[k].rate ? getRateWrap(tListData[k].rate) : '-')+'</td>';
                }
                html += '</tr>';
            }
        }
        html += '</table>';
        $('.b-tlist-items').html(html);
        //$('.b-tlist-items').mCustomScrollbar({
        //	axis:"yx" // vertical and horizontal scrollbar
        //});
        $('.b-tlist-loader').hide();
    }

    $('.b-tlist').each(function(){
        $('.b-tlist-category li').on('click', function(e){
            e.preventDefault();
            if(!$(this).hasClass('m-active')) {
                $('.b-tlist-category .m-active').removeClass('m-active');
                $(this).addClass('m-active');
                if (!$(this).data('cat')) {
                    $('.b-tlist-items').prop('class', 'b-tlist-items');
                } else {
                    $('.b-tlist-items').prop('class', 'b-tlist-items m-'+$(this).data('cat'));
                }
            }
        });

        $('.b-tlist-money li').on('click', function(e){
            e.preventDefault();
            if(!$(this).hasClass('m-active')) {
                $('.b-tlist-money .m-active').removeClass('m-active');
                $(this).addClass('m-active');
                createTable();
            }
        });

        // Поиск по названию
        $('.b-tlist-filter-item-content input[type="text"]:eq(0)').on('keyup', function(e){
            clearTimeout(waitExecTimeout);
            waitExecTimeout = setTimeout(createTable, 1500);
        });

        // Стоимость электричества
        $('.b-tlist-filter-item-content input[type="text"]:eq(1)').on('keyup', function(e){
            clearTimeout(waitExecTimeout2);
            var $this = $(this);
            waitExecTimeout2 = setTimeout(function(){
                var val = $this.val();
                val = val.replace(/[^0-9\.,]/, '');
                val = Number(val);
                if (isNaN(val)) {
                    val = 3.30;
                }
                $this.val(val);
                if (val != lastValEe) {
                    lastValEe = val;
                    setData();
                }
            }, 1000);
        });

        // Сортировка
        $('.b-tlist-items').on('click', 'th', function(e){
            e.preventDefault();
            if ($(e.target).hasClass('m-sort')) {
                sortVector = !sortVector;
            } else {
                sortIndex = $(e.target).index(),
                    sortVector = false;
            }
            setData();
        });

        if ($('.b-tlist-items').length) {
            // Изменение размера страницы
            $(window).on('resize', function(){
                clearTimeout(waitExecTimeout3);
                waitExecTimeout2 = setTimeout(function(){
                    var sizeType = $(window).width() < 1300;
                    if (lastSizeType !== sizeType) {
                        lastSizeType = sizeType;
                        sortIndex = null;
                        sortVector = null;
                        createTable();
                    }
                }, 250);
            });

            for(var k in tListData) {
                tListData[k].hash = tListData[k].hash.replace(/[^0-9\.]/g, '');
                tListData[k].name = filterNameMobile(tListData[k].name);
            }

            setData();
        }

    });
});

function copyText() {
    let text = document.getElementById("pagetitle").innerText;
    let elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
}



$('.props_list.nbg:eq(0) .char_name').each(function(){
    if ($(this).text() == 'Доходность') {
        $(this).next().text().append('<span>руб. в день</span>');
    }
});

$('.props.props_list .char_name').each(function(){
    if ($(this).text() == 'Доходность') {
        $(this).next().text().append('<span>руб. в день</span>');
    }
});

