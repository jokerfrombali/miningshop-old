function declension(a){switch(a){case 1:return text_d1_items;break;case 2:case 3:case 4:return text_d2_items;break;default:return text_d3_items;}}
function button_autopager(callback) {
	$('.bal-loading').remove();
	$('.row.bal').remove();
	var e_length,e_length_s,appendTodiv,d_start,d_end,d_total,p_total,e_total_p;
	var pagenum = 1;
        var pagelink = window.location.href;
        var page = pagelink.match(/page=(\d+)/);
	if(page) pagenum = page[1];

	if ($('data').is('[data-bal="bal-elemen"]')){
		appendTodiv = $('data[data-bal="bal-elemen"]').parent().attr('data-bal','append-bal');
		$('data[data-bal="bal-elemen"]').next().attr('data-bal','element-bal');
		$('data[data-bal="bal-elemen"]').remove();
	} else {
		appendTodiv = $('[data-bal="element-bal"]').parent().attr('data-bal','append-bal');
	}

	var e_length = appendTodiv.find('[data-bal="element-bal"]').length;
	if ($('data').is('[data-bal="bal-settings"]')){
		var bal_settings = $('data[data-bal="bal-settings"]');
		var pagination = bal_settings.prev().parent();
		var results = pagination.siblings();
		var divpagination = pagination.parent();

		pagination.attr('data-bal','bal-pagination');
		divpagination.attr('data-bal','bal-div');
		results.attr('data-bal','bal-results');

		var next_url = bal_settings.attr('href');
		d_start = bal_settings.attr('data-d-start');
		d_end = bal_settings.attr('data-d-end');
		d_total = bal_settings.attr('data-d-total');
		p_total = bal_settings.attr('data-p-total');
		e_length_s = d_end - d_start +1;
		e_total_p = d_total - (pagenum-1)*e_length_s;
		if ((e_total_p - e_length) < e_length_s) e_length_s = e_total_p - e_length;
	}
//	if (next_url !== undefined) {
	if (d_end != d_total) {
		$('[data-bal="bal-div"]').before('<div class="row bal" style="margin-bottom: 10px;"><div class="col-sm-12"><div class="bal-box-next"><a href="'+next_url+ location.hash+'" rel="next">'+text_show_next.replace(/{show}/gi, e_length_s).replace(/{items}/gi, declension(e_length_s))+'</a></span></div></div>');
	} else {
		$('[data-bal="bal-pagination"]').show();
	}
	$.autopager({
		autoLoad	: false,
		link 			: 'data[data-bal="bal-settings"]',
		pagination	: '[data-bal="bal-div"]',
		content 		: '[data-bal="element-bal"]',
		appendTo	: appendTodiv,
		start			: function(current, next) {
					$('.element-bal').removeClass("new-element-bal");
					$('[data-bal="bal-div"]').after('<div class="bal-loading"><img alt="'+text_loading+'" src="image/bal-loading.gif" /><div>'+text_loading+'</div></div>');
		},
		load			: function(current, next) {
					if(next.pagination !== undefined) {$('[data-bal="bal-div"]').html(next.pagination.html());}
					if(next.url == undefined) {$('div.bal-box-next').html(text_no_more_show);$('div.bal-box-next').fadeOut(2000, function () {$(this).remove();})}else{$('.bal-box-next a[rel=next]').attr('href',next.url+location.hash)}
					$('.row.bal').remove();
					$('.bal-loading').remove();
					if(callback && typeof(callback) ==="function") {callback();}
					button_autopager();
		}
	});

	$('div.bal-box-next').click(function() {
		$.autopager('load');
		return false;
	});
	e_length = appendTodiv.find('[data-bal="element-bal"]').length;
}

$(document).ready(function(){
	button_autopager();
	var hash = window.location.href;
	function hashchange(){ 
		var hash = location.hash;
		button_autopager();
	}
	window.addEventListener('hashchange', hashchange);
});