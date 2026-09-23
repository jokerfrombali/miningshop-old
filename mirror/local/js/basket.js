BX.ready(function(){
	BX.addCustomEvent('onCompleteAction', function(e, data){
		if (e.action == 'loadForm' && $(data).data('iblockid')) {
			openPopup($(data).data('item'));
			console.log('onCompleteAction');
		}
    });
});

function openPopup(id){
	$.get(
		'/local/dop_services.php',
		{id: id},
		function(items){
			if(items.length) {
				createPopup(items);
				console.log('createPopup');
			}
		}
	);
	return false;
}
function number_format1( number, decimals, dec_point, thousands_sep ) {	// Format a number with grouped thousands
	// 
	// +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +	 bugfix by: Michael White (http://crestidg.com)

	var i, j, kw, kd, km;

	// input sanitation & defaults
	if( isNaN(decimals = Math.abs(decimals)) ){
		decimals = 2;
	}
	if( dec_point == undefined ){
		dec_point = ",";
	}
	if( thousands_sep == undefined ){
		thousands_sep = ".";
	}

	i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

	if( (j = i.length) > 3 ){
		j = j % 3;
	} else{
		j = 0;
	}

	km = (j ? i.substr(0, j) + thousands_sep : "");
	kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
	//kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
	kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");


	return km + kw + kd;
}

function createPopup(items){
	var html = '';
	html += '<div class="b-popup" style="display: flex; align-items:center; justify-content:center; owerflow:auto; padding: 50px; position:fixed;top:0;left:0;width:100%;height:100%;z-index:100000;">';
	html += '<div class="b-popup-shutter" style="position: fixed; top:0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,.6); cursor:pointer;"></div>';
	html += '<div class="b-popup-content" style="position:relative; width: 300px; padding: 20px; text-align: center; background: #fff; color:#000"><div>';
	html += '<p>Товар добавлен в корзину. Вы можете выбрать дополнительные услуги:</p><br>';
	$.each(items, function(){
		html += '<label><input type="checkbox" value="'+this.ID+'"> '+this.NAME+' ('+number_format1(this.CATALOG_PRICE_1, 0, '.', ' ')+' руб.)</label><br>'
	});
	html += '<br><br><button class="b-popup-add btn btn-success">Добавить</button></div>';
	html += '<br><br><br><a href="#" class="b-popup-close btn btn-warning">Продолжить покупки</a>';
	html += '</div>';
	html += '</div>';

	$('body').append(html);

	$('.b-popup-add').on('click', clickAddToBasket);
	$('.b-popup-close, .b-popup-shutter').on('click', clickClosePopup);
}

function clickClosePopup(e) {
	e.preventDefault();
	$('.b-popup').remove();
}

function clickAddToBasket(e) {
		console.log('clickAddToBasket');
	var ids = [];
	$('.b-popup-content input:checked').each(function(){
		ids.push($(this).val());
	});
	if (ids.length) {
		$.get(
			'/local/services_add_to_basket.php',
			{ids: ids},
			function(){
				if ($('#basket-root').length) document.location.reload();
			}
		);
	}
	$('.b-popup-content > div').html('<p>Выбранные услуги добавлены в корзину. Перейдя в неё вы можете добавить или удалить услуги</p>');
}

/*
Если мы в корзине, загружаем информацию о ней
ид в корзине - (ид продукта, услуга?)
При изменении в корзине, проходимся по всем пунктам, и у услуг удаляем количество, у товаров если есть услуги, добавляем кнопку
При добавлении услуг, если мы в корзине, то перезагружаем страницу
*/



$(function(){
	var $basketRoot = $('#basket-root'),
	basketData = null;

	var fixBasket = function(){
		console.log('basket-root');
		if (basketData) {
			$('#basket-item-table .basket-items-list-item-container').each(function(){
				if (basketData[$(this).data('id')].services) {
					$(this).find('.basket-item-block-amount').hide();
				}
				var $btn = $(this).find('.basket-item-property-value[data-property-code="SERVICES"]');
				if ($btn.length) {
					$btn.html('<a href="javascript:openPopup('+basketData[$(this).data('id')].id+')" title="">Добавить услуги</a>');
				}
			});
		} else {
			setTimeout(fixBasket, 1000);
		}
	};

	if ($basketRoot.length) {
		console.log('basket-info');
		$.get('/local/basket-info.php', function(data){
			basketData = data;
			fixBasket();
		});

		BX.addCustomEvent('OnBasketChange', fixBasket);
	}
});
