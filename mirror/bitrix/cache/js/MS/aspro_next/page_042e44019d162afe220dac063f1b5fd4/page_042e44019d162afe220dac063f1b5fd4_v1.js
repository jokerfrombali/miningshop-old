
; /* Start:"a:4:{s:4:"full";s:87:"/local/templates/aspro_next/components/bitrix/catalog/main/script.min.js?16534349341260";s:6:"source";s:68:"/local/templates/aspro_next/components/bitrix/catalog/main/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
$(document).on("click","#headerfixed .buy.btn",function(){$(".catalog_detail .buy_block .offer_buy_block .to-cart").length?$(".catalog_detail .buy_block .offer_buy_block .to-cart").is(":visible")?$(".catalog_detail .buy_block .offer_buy_block .to-cart").trigger("click"):location.href=arNextOptions.PAGES.BASKET_PAGE_URL:$(".catalog_detail .buy_block .offer_buy_block .btn").length&&$(".catalog_detail .buy_block .offer_buy_block .btn").trigger("click")}),$(document).on("click","#headerfixed .bx_catalog_item_scu",function(){var t=0;t=$(".catalog_detail .sku_props .bx_catalog_item_scu").offset().top,$("body, html").animate({scrollTop:t-150},500)}),$(document).on("click",".stores-title .stores-title__list",function(){var t=$(this);t.siblings().removeClass("stores-title--active"),t.addClass("stores-title--active"),$(".stores_block_wrap .stores-amount-list").hide(100).removeClass("stores-amount-list--active"),$(".stores_block_wrap .stores-amount-list:eq("+t.index()+")").show(100,function(){t.hasClass("stores-title--map")&&"undefined"!=typeof map&&(map.container.fitToViewport(),"undefined"==typeof clusterer||$(this).find(".detail_items").is(":visible")||map.setBounds(clusterer.getBounds(),{zoomMargin:40}))}).addClass("stores-amount-list--active")});
/* End */
;
; /* Start:"a:4:{s:4:"full";s:93:"/local/templates/aspro_next/components/bitrix/catalog.element/main/script.js?1658831996114641";s:6:"source";s:76:"/local/templates/aspro_next/components/bitrix/catalog.element/main/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
var ItemObj = {};

$(document).on('click', ".item-stock .store_view", function(){
	scroll_block($('.tabs_section'));
});

$(document).ready(function (){
	// stock (sale)
	if($('.catalog_detail .stock_wrapper').length > 1){
		$('.catalog_detail .stock_wrapper').first().html($('.stock_wrapper').last().html()).show();
	}

	//set fixed tabs
	$('<div class="product-item-detail-tabs-container-fixed">'+
		'<div class="wrapper_inner">'+
			'<ul class="product-item-detail-tabs-list nav nav-tabs">'+
				$('ul.nav.nav-tabs').html()+
				'<li class="last"></li>'+
			'</ul>'+
		'</div>'+
		'</div>').insertAfter($('#headerfixed'));
	$('.product-item-detail-tabs-list a').addClass('dark_link');
	$('.tab_slider_wrapp .tabs > li').first().addClass('cur');
	$('.tab_slider_wrapp .slider_navigation > li').first().addClass('cur');
	$('.tab_slider_wrapp .tabs_content > li').first().addClass('cur');

	$('.tab_slider_wrapp .tabs > li').on('click', function(){
		InitFlexSlider();
		$('.tab_slider_wrapp .tabs_content').height($('.tab_slider_wrapp .tabs_content > li.cur').data('unhover'));
		$(window).resize();
	});

	$('.items-services .item').sliceHeight();

	$(document).on({
		mouseover: function(e){
			e.stopImmediatePropagation();
			var tabsContentHover = $(this).closest('.tab').attr('data-hover') * 1;
			$(this).closest('.tab').fadeTo(100, 1);
			$(this).closest('.tab').stop().css({'height': tabsContentHover});
			$(this).closest('.flex-viewport').stop().css({'height': tabsContentHover});
		},
		mouseleave: function(e){
			e.stopImmediatePropagation();
			var tabsContentUnhoverHover = $(this).closest('.tab').attr('data-unhover') * 1;
			$(this).closest('.tab').stop().animate({'height': tabsContentUnhoverHover}, 100);
			$(this).closest('.flex-viewport').stop().css({'height': tabsContentUnhoverHover});
		}
	}, '.tabs_slider > li');

	$(".opener").click(function(){

		$(this).find(".opener_icon").toggleClass("opened");
		/*Elvira start*/
		var showBlock = $(this).parents(".table-view__item--has-stores").toggleClass("nb").find(".offer_stores").find(".stores_block_wrap");
		/*Elvira end*/
		showBlock.slideToggle(200);
	});

	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
		var _this = $(e.target),
			parent = _this.parent();

		//top nav
		if(_this.closest('.product-item-detail-tabs-list').length)
		{
			var content_offset=$('.tabs_section').offset(),
				tab_height = $('.product-item-detail-tabs-container-fixed').actual('outerHeight'),
				hfixed_height = $('#headerfixed').actual('outerHeight');
			$('html, body').animate({scrollTop: content_offset.top-hfixed_height-tab_height}, 400);
		}

		$('.nav.nav-tabs li').each(function(){
			$(this).removeClass('active');
			if($(this).index() == parent.index())
				$(this).addClass('active');
		})

		if(parent.hasClass('product_reviews_tab')) // review
		{
			$(".shadow.common").hide();
			$("#reviews_content").show();
		}
		else
		{
			$(".shadow.common").show();
			$("#reviews_content").hide();

			if($(this).attr('href') == '#descr'){
				var $gallery = $('.galerys-block');
				if($gallery.length){
					var bTypeBig = $gallery.find('.big_slider').length;
					var $slider = bTypeBig ? $gallery.find('.big_slider') : $gallery.find('.small_slider');
					InitFlexSlider();
					var interval = setInterval(function(){
						if($slider.find('.slides .item').length && $slider.find('.slides .item').attr('style').indexOf('height') === -1){
							$(window).resize();
						}
						else{
							clearInterval(interval);
						}
					}, 100);
				}
			}
		}

		if (typeof map !== 'undefined' && typeof clusterer !== 'undefined') {
			setTimeout(function(){
				map.setBounds(clusterer.getBounds(), {
					zoomMargin: 40,
				});
			}, 100)
		}
	})

	if($('.title-tab-heading').length)
	{
		$('.title-tab-heading').on('click', function(){
			var _this = $(this),
				content_offset = _this.offset();
			$('html, body').animate({scrollTop: content_offset.top-100}, 400);
		})
	}

	$('html, body').on('mousedown', function(e) {
		if(typeof e.target.className == 'string' && e.target.className.indexOf('adm') < 0)
		{
			e.stopPropagation();
			var hint = $(e.target).closest('.hint');
			if(!$(e.target).closest('.hint').length)
			{
				$('.hint').removeClass("active").find(".tooltip").slideUp(100);
			}
			else
			{
				var pos_tmp = hint.offset().top+''+hint.offset().left;
				$('.hint').each(function(){
					var pos_tmp2 = $(this).offset().top+''+$(this).offset().left;
					if($(this).text()+pos_tmp2 != hint.text()+pos_tmp)
					{
						$(this).removeClass("active").find(".tooltip").slideUp(100);
					}
				})
			}
		}
	})
	$('.share_wrapp').find('*').on('mousedown', function(e) {
		e.stopPropagation();
	});

	BX.addCustomEvent('onSlideInit', function(eventdata) {
		try{
			ignoreResize.push(true);
			if(eventdata){
				var slider = eventdata.slider;
				if(slider){
				 	if(slider.find('.catalog_item').length){
						setHeightBlockSlider();
					}
					if(slider.hasClass('small_slider')){
						$('.detail .small-gallery-block .item').sliceHeight({lineheight: -3});
					}
					if(slider.hasClass('big_slider')){
						$('.detail .big_slider .item').sliceHeight({lineheight: -3});
					}
				}
			}
		}
		catch(e){}
		finally{
			ignoreResize.pop();
		}
	});

	BX.addCustomEvent('onWindowResize', function(eventdata){
		try{
			ignoreResize.push(true);
			InitFlexSlider();
		}
		catch(e){}
		finally{
			ignoreResize.pop();
		}
	});
})
$('.set_block').ready(function(){
	$('.set_block ').equalize({children: '.item:not(".r") .cost', reset: true});
	$('.set_block').equalize({children: '.item .item-title', reset: true});
	$('.set_block').equalize({children: '.item .item_info', reset: false});
});

(function (window) {

if (!window.JCCatalogOnlyElement)
{

	window.JCCatalogOnlyElement = function (arParams)
	{
		if (typeof arParams === 'object')
		{
			this.params = arParams;

			this.obProduct = null;
			this.set_quantity = 1;

			this.currentPriceMode = '';
			this.currentPrices = [];
			this.currentPriceSelected = 0;
			this.currentQuantityRanges = [];
			this.currentQuantityRangeSelected = 0;

			if (this.params.MESS)
			{
				this.mess = this.params.MESS;
			}

			this.init();
		}
	}
	window.JCCatalogOnlyElement.prototype = {
		init: function()
		{
			var i = 0,
				j = 0,
				treeItems = null;

			this.obProduct = BX(this.params.ID);

			if(!!this.obProduct)
			{
				$(this.obProduct).find('.counter_wrapp .counter_block input').data('product', 'ob'+this.obProduct.id+'el');
				this.currentPriceMode = this.params.ITEM_PRICE_MODE;
				this.currentPrices = this.params.ITEM_PRICES;
				this.currentQuantityRanges = this.params.ITEM_QUANTITY_RANGES;
			}

		},

		setPriceAction: function()
		{
			this.set_quantity = this.params.MIN_QUANTITY_BUY;
			if($(this.obProduct).find('input[name=quantity]').length)
				this.set_quantity = $(this.obProduct).find('input[name=quantity]').val();

			this.checkPriceRange(this.set_quantity);

			$(this.obProduct).find('.not_matrix').hide();

			$(this.obProduct).find('.with_matrix .price_value_block').html(getCurrentPrice(this.currentPrices[this.currentPriceSelected].PRICE, this.currentPrices[this.currentPriceSelected].CURRENCY, this.currentPrices[this.currentPriceSelected].PRINT_PRICE));

			if($(this.obProduct).find('.with_matrix .discount'))
			{
				$(this.obProduct).find('.with_matrix .discount').html(getCurrentPrice(this.currentPrices[this.currentPriceSelected].BASE_PRICE, this.currentPrices[this.currentPriceSelected].CURRENCY, this.currentPrices[this.currentPriceSelected].PRINT_BASE_PRICE));
			}

			if(this.params.SHOW_DISCOUNT_PERCENT_NUMBER == 'Y')
			{
				if(this.currentPrices[this.currentPriceSelected].PERCENT > 0 && this.currentPrices[this.currentPriceSelected].PERCENT < 100)
				{
					if(!$(this.obProduct).find('.with_matrix .sale_block .sale_wrapper .value').length)
						$('<div class="value"></div>').insertBefore($(this.obProduct).find('.with_matrix .sale_block .sale_wrapper .text'));

					$(this.obProduct).find('.with_matrix .sale_block .sale_wrapper .value').html('-<span>'+this.currentPrices[this.currentPriceSelected].PERCENT+'</span>%');
				}
				else
				{
					if($(this.obProduct).find('.with_matrix .sale_block .sale_wrapper .value').length)
						$(this.obProduct).find('.with_matrix .sale_block .sale_wrapper .value').remove();
				}
			}

			$(this.obProduct).find('.with_matrix .sale_block .text .values_wrapper').html(getCurrentPrice(this.currentPrices[this.currentPriceSelected].DISCOUNT, this.currentPrices[this.currentPriceSelected].CURRENCY, this.currentPrices[this.currentPriceSelected].PRINT_DISCOUNT));

			$(this.obProduct).find('.with_matrix').show();

			if(arNextOptions['THEME']['SHOW_TOTAL_SUMM'] == 'Y')
			{
				if(typeof this.currentPrices[this.currentPriceSelected] !== 'undefined')
					setPriceItem($(this.obProduct), this.set_quantity, this.currentPrices[this.currentPriceSelected].PRICE);
			}
		},

		checkPriceRange: function(quantity)
		{
			if (typeof quantity === 'undefined'|| this.currentPriceMode != 'Q')
				return;

			var range, found = false;

			for (var i in this.currentQuantityRanges)
			{
				if (this.currentQuantityRanges.hasOwnProperty(i))
				{
					range = this.currentQuantityRanges[i];

					if (
						parseInt(quantity) >= parseInt(range.SORT_FROM)
						&& (
							range.SORT_TO == 'INF'
							|| parseInt(quantity) <= parseInt(range.SORT_TO)
						)
					)
					{
						found = true;
						this.currentQuantityRangeSelected = range.HASH;
						break;
					}
				}
			}

			if (!found && (range = this.getMinPriceRange()))
			{
				this.currentQuantityRangeSelected = range.HASH;
			}

			for (var k in this.currentPrices)
			{
				if (this.currentPrices.hasOwnProperty(k))
				{
					if (this.currentPrices[k].QUANTITY_HASH == this.currentQuantityRangeSelected)
					{
						this.currentPriceSelected = k;
						break;
					}
				}
			}
		},

		getMinPriceRange: function()
		{
			var range;

			for (var i in this.currentQuantityRanges)
			{
				if (this.currentQuantityRanges.hasOwnProperty(i))
				{
					if (
						!range
						|| parseInt(this.currentQuantityRanges[i].SORT_FROM) < parseInt(range.SORT_FROM)
					)
					{
						range = this.currentQuantityRanges[i];
					}
				}
			}

			return range;
		}
	}
}

if (!!window.JCCatalogElement)
{
	return;
}

var BasketButton = function(params)
{
	BasketButton.superclass.constructor.apply(this, arguments);
	this.nameNode = BX.create('span', {
		props : { className : 'bx_medium bx_bt_button', id : this.id },
		style: typeof(params.style) === 'object' ? params.style : {},
		text: params.text
	});
	this.buttonNode = BX.create('span', {
		attrs: { className: params.ownerClass },
		children: [this.nameNode],
		events : this.contextEvents
	});
	if (BX.browser.IsIE())
	{
		this.buttonNode.setAttribute("hideFocus", "hidefocus");
	}
};
BX.extend(BasketButton, BX.PopupWindowButton);

window.JCCatalogElement = function (arParams)
{
	this.timerInitCalculateDelivery = false;
	this.skuVisualParams = {
		SELECT:
		{
			TAG_BIND: 'select',
			TAG: 'option',
			ACTIVE_CLASS: 'active',
			HIDE_CLASS: 'hidden',
			EVENT: 'change',
		},
		LI:
		{
			TAG_BIND: 'li',
			TAG: 'li',
			ACTIVE_CLASS: 'active',
			HIDE_CLASS: 'missing',
			EVENT: 'click',
		}
	};
	this.productType = 0;

	this.config = {
		useCatalog: true,
		showQuantity: true,
		showPrice: true,
		showAbsent: true,
		showOldPrice: false,
		showPercent: false,
		showSkuProps: false,
		showOfferGroup: false,
		useCompare: false,
		mainPictureMode: 'IMG',
		showBasisPrice: false,
		showPercentNumber: false,
		basketAction: ['BUY'],
		showClosePopup: false,
		offerID: 'oid'
	};

	this.basketLinkURL = '';

	this.checkQuantity = false;
	this.maxQuantity = 0;
	this.SliderImages=0;
	this.defaultCount = 1;
	this.stepQuantity = 1;
	this.isDblQuantity = false;
	this.canBuy = true;
	this.currentBasisPrice = {};
	this.canSubscription = true;
	this.currentIsSet = false;
	this.updateViewedCount = false;

	this.currentPriceMode = '';
	this.currentPrices = [];
	this.currentPriceSelected = 0;
	this.currentQuantityRanges = [];
	this.currentQuantityRangeSelected = 0;

	this.precision = 6;
	this.precisionFactor = Math.pow(10,this.precision);

	this.listID = {
		main: ['PICT_ID', 'BIG_SLIDER_ID', 'BIG_IMG_CONT_ID'],
		stickers: ['STICKER_ID'],
		productSlider: ['SLIDER_CONT', 'SLIDER_LIST', 'SLIDER_LEFT', 'SLIDER_RIGHT'],
		offerSlider: ['SLIDER_CONT_OF_ID', 'SLIDER_LIST_OF_ID', 'SLIDER_LEFT_OF_ID', 'SLIDER_RIGHT_OF_ID'],
		offerSliderMobile: ['SLIDER_CONT_OFM_ID', 'SLIDER_LIST_OFM_ID', 'SLIDER_LEFT_OFM_ID', 'SLIDER_RIGHT_OFM_ID'],
		offers: ['TREE_ID', 'TREE_ITEM_ID', 'DISPLAY_PROP_DIV', 'DISPLAY_PROP_ARTICLE_DIV', 'OFFER_GROUP'],
		quantity: ['QUANTITY_ID', 'QUANTITY_UP_ID', 'QUANTITY_DOWN_ID', 'QUANTITY_MEASURE', 'QUANTITY_LIMIT', 'BASIS_PRICE'],
		price: ['PRICE_ID'],
		oldPrice: ['OLD_PRICE_ID', 'DISCOUNT_VALUE_ID'],
		discountPerc: ['DISCOUNT_PERC_ID'],
		basket: ['BASKET_PROP_DIV', 'BUY_ID', 'BASKET_LINK', 'ADD_BASKET_ID', 'BASKET_ACTIONS_ID', 'NOT_AVAILABLE_MESS', 'SUBSCRIBE_ID', 'SUBSCRIBED_ID'],
		magnifier: ['MAGNIFIER_ID', 'MAGNIFIER_AREA_ID'],
		compare: ['COMPARE_LINK_ID']
	};

	this.visualPostfix = {
		// main pict
		PICT_ID: '_pict',
		BIG_SLIDER_ID: '_big_slider',
		BIG_IMG_CONT_ID: '_bigimg_cont',
		// stickers
		STICKER_ID: '_sticker',
		// product pict slider
		SLIDER_CONT: '_slider_cont',
		SLIDER_LIST: '_slider_list',
		SLIDER_LEFT: '_slider_left',
		SLIDER_RIGHT: '_slider_right',
		// offers sliders
		SLIDER_CONT_OF_ID: '_slider_cont_',
		SLIDER_LIST_OF_ID: '_slider_list_',
		SLIDER_LEFT_OF_ID: '_slider_left_',
		SLIDER_RIGHT_OF_ID: '_slider_right_',
		// offers sliders mobile
		SLIDER_CONT_OFM_ID: '_sliderm_cont_',
		SLIDER_LIST_OFM_ID: '_sliderm_list_',
		SLIDER_LEFT_OFM_ID: '_sliderm_left_',
		SLIDER_RIGHT_OFM_ID: '_sliderm_right_',
		// offers
		TREE_ID: '_skudiv',
		TREE_ITEM_ID: '_prop_',
		DISPLAY_PROP_DIV: '_sku_prop',
		DISPLAY_PROP_ARTICLE_DIV: '_sku_article_prop',
		// quantity
		QUANTITY_ID: '_quantity',
		QUANTITY_UP_ID: '_quant_up',
		QUANTITY_DOWN_ID: '_quant_down',
		QUANTITY_MEASURE: '_quant_measure',
		QUANTITY_LIMIT: '_quant_limit',
		BASIS_PRICE: '_basis_price',
		// price and discount
		PRICE_ID: '_price',
		OLD_PRICE_ID: '_old_price',
		DISCOUNT_VALUE_ID: '_price_discount',
		DISCOUNT_PERC_ID: '_dsc_pict',
		// basket
		BASKET_PROP_DIV: '_basket_prop',
		BUY_ID: '_buy_link',
		BASKET_LINK: '_basket_link',
		ADD_BASKET_ID: '_add_basket_link',
		BASKET_ACTIONS_ID: '_basket_actions',
		NOT_AVAILABLE_MESS: '_not_avail',
		SUBSCRIBE_ID: '_subscribe_div',
		SUBSCRIBED_ID: '_subscribed_div',
		// magnifier
		MAGNIFIER_ID: '_magnifier',
		MAGNIFIER_AREA_ID: '_magnifier_area',
		// offer groups
		OFFER_GROUP: '_set_group_',
		// compare
		COMPARE_LINK_ID: '_compare_link'
	};

	this.visual = {};

	this.basketMode = '';
	this.product = {
		checkQuantity: false,
		maxQuantity: 0,
		stepQuantity: 1,
		startQuantity: 1,
		isDblQuantity: false,
		canBuy: true,
		canSubscription: true,
		name: '',
		pict: {},
		id: 0,
		addUrl: '',
		buyUrl: '',
		slider: {},
		sliderCount: 0,
		useSlider: false,
		sliderPict: []
	};
	this.mess = {};

	this.basketData = {
		useProps: false,
		emptyProps: false,
		quantity: 'quantity',
		props: 'prop',
		basketUrl: '',
		sku_props: '',
		sku_props_var: 'basket_props',
		add_url: '',
		buy_url: ''
	};
	this.compareData = {
		compareUrl: '',
		comparePath: ''
	};

	this.defaultPict = {
		preview: null,
		detail: null
	};

	this.offers = [];
	this.offerNum = 0;
	this.treeProps = [];
	this.obTreeRows = [];
	this.showCount = [];
	this.showStart = [];
	this.selectedValues = {};
	this.sliders = [];

	this.obProduct = null;
	this.obQuantity = null;
	this.obQuantityUp = null;
	this.obQuantityDown = null;
	this.obBasisPrice = null;
	this.obPict = null;
	this.obPictAligner = null;
	this.obPrice = {
		price: null,
		full: null,
		discount: null,
		percent: null
	};
	this.obTree = null;
	this.obBuyBtn = null;
	this.obBasketBtn = null;
	this.obAddToBasketBtn = null;
	this.obBasketActions = null;
	this.obNotAvail = null;
	this.obSkuProps = null;
	this.obSlider = null;
	this.obMeasure = null;
	this.obQuantityLimit = {
		all: null,
		value: null
	};
	this.obCompare = null;

	this.viewedCounter = {
		path: '/bitrix/components/bitrix/catalog.element/ajax.php',
		params: {
			AJAX: 'Y',
			SITE_ID: '',
			PRODUCT_ID: 0,
			PARENT_ID: 0
		}
	};

	this.currentImg = {
		src: '',
		width: 0,
		height: 0,
		screenWidth: 0,
		screenHeight: 0,
		screenOffsetX: 0,
		screenOffsetY: 0,
		scale: 1
	};
	this.currentBigImg = {
		src: '',
	}

	this.obPopupWin = null;
	this.basketUrl = '';
	this.basketParams = {};

	this.obPopupPict = null;
	this.magnify = {
		obMagnifier: null,
		obMagnifyPict: null,
		obMagnifyArea: null,
		obBigImg: null,
		obBigSlider: null,
		magnifyShow: false,
		areaParams : {
			width: 100,
			height: 130,
			left: 0,
			top: 0,
			scaleFactor: 1,
			globalLeft: 0,
			globalTop: 0,
			globalRight: 0,
			globalBottom: 0
		},
		magnifierParams: {
			top: 0,
			left: 0,
			width: 0,
			height: 0,
			ratioX: 10,
			ratioY: 13,
			defaultScale: 1
		},
		magnifyPictParams: {
			marginTop: 0,
			marginLeft: 0,
			width: 0,
			height: 0
		}
	};

	this.treeRowShowSize = 5;
	this.treeEnableArrow = { display: '', cursor: 'pointer', opacity: 1 };
	this.treeDisableArrow = { display: '', cursor: 'default', opacity: 0.2 };
	this.sliderRowShowSize = 5;
	this.sliderEnableArrow = { display: '', cursor: 'pointer', opacity: 1 };
	this.sliderDisableArrow = { display: '', cursor: 'default', opacity: 0.2 };

	this.errorCode = 0;
	if (typeof arParams === 'object')
	{
		this.params = arParams;
		this.initConfig();

		if (!!this.params.MESS)
		{
			this.mess = this.params.MESS;
		}
		switch (this.productType)
		{
			case 0:// no catalog
			case 1://product
			case 2://set
				this.initProductData();
				break;
			case 3://sku
				this.initOffersData();
				break;
			default:
				this.errorCode = -1;
		}

		this.initBasketData();
		this.initCompareData();
	}
	if (0 === this.errorCode)
	{
		BX.ready(BX.delegate(this.Init,this));
	}
	this.params = {};
};

window.JCCatalogElement.prototype.Init = function()
{
	var i = 0,
		j = 0,
		strPrefix = '',
		SliderImgs = null,
		TreeItems = null;

	this.obProduct = BX(this.visual.ID);
	if (!this.obProduct)
	{
		this.errorCode = -1;
	}
	this.obPict = BX(this.visual.PICT_ID);
	if (!this.obPict)
	{
		this.errorCode = -2;
	}
	else
	{
		this.obPictAligner = this.obPict.parentNode;
	}

	if (this.config.showPrice)
	{
		this.obPrice.price = BX(this.visual.PRICE_ID);
		if (!this.obPrice.price && this.config.useCatalog)
		{
			this.errorCode = -16;
		}
		else
		{
			if (this.config.showOldPrice)
			{
				this.obPrice.full = BX(this.visual.OLD_PRICE_ID);
				this.obPrice.discount = BX(this.visual.DISCOUNT_VALUE_ID);
				if(!!this.obPrice.full)
					BX.adjust(this.obPrice.full, {style: {display: 'none'}, html: ''});
				/*if (!this.obPrice.full || !this.obPrice.discount)
				{
					this.config.showOldPrice = false;
				}*/
			}
			if (this.config.showPercent)
			{
				this.obPrice.percent = BX(this.visual.DISCOUNT_PERC_ID);
				/*if (!this.obPrice.percent)
				{
					this.config.showPercent = false;
				}*/
			}
		}
		this.obBasketActions = BX(this.visual.BASKET_ACTIONS_ID);
		if (!!this.obBasketActions)
		{
			if (BX.util.in_array('BUY', this.config.basketAction))
			{
				this.obBuyBtn = BX(this.visual.BUY_ID);
			}
			if (BX.util.in_array('ADD', this.config.basketAction))
			{
				this.obAddToBasketBtn = BX(this.visual.BUY_ID);
			}
			if (!!this.visual.BASKET_LINK)
			{
				this.obBasketBtn = BX(this.visual.BASKET_LINK);
			}

		}
		this.obNotAvail = BX(this.visual.NOT_AVAILABLE_MESS);
	}

	if (this.config.showQuantity)
	{
		this.obQuantity = BX(this.visual.QUANTITY_ID);
		if (!!this.visual.QUANTITY_UP_ID)
		{
			this.obQuantityUp = BX(this.visual.QUANTITY_UP_ID);
		}
		if (!!this.visual.QUANTITY_DOWN_ID)
		{
			this.obQuantityDown = BX(this.visual.QUANTITY_DOWN_ID);
		}
		if (this.config.showBasisPrice)
		{
			this.obBasisPrice = BX(this.visual.BASIS_PRICE);
		}
	}
	if (3 === this.productType)
	{
		if (!!this.visual.TREE_ID)
		{
			this.obTree = BX(this.visual.TREE_ID);
			if (!this.obTree)
			{
				this.errorCode = -256;
			}
			strPrefix = this.visual.TREE_ITEM_ID;
			for (i = 0; i < this.treeProps.length; i++)
			{
				this.obTreeRows[i] = {
					LEFT: BX(strPrefix+this.treeProps[i].ID+'_left'),
					RIGHT: BX(strPrefix+this.treeProps[i].ID+'_right'),
					LIST: BX(strPrefix+this.treeProps[i].ID+'_list'),
					CONT: BX(strPrefix+this.treeProps[i].ID+'_cont')
				};
				if (!this.obTreeRows[i].LIST || !this.obTreeRows[i].CONT)
				{
					this.errorCode = -512;
					break;
				}
			}
		}
		if (!!this.visual.QUANTITY_MEASURE)
		{
			this.obMeasure = BX(this.visual.QUANTITY_MEASURE);
		}
		if (!!this.visual.QUANTITY_LIMIT)
		{
			this.obQuantityLimit.all = BX(this.visual.QUANTITY_LIMIT);
			if (!!this.obQuantityLimit.all)
			{
				this.obQuantityLimit.value = BX.findChild(this.obQuantityLimit.all, {tagName: 'span'}, false, false);
				if (!this.obQuantityLimit.value)
				{
					this.obQuantityLimit.all = null;
				}
			}
		}
	}

	if (this.config.showSkuProps)
	{
		if (!!this.visual.DISPLAY_PROP_DIV)
		{
			this.obSkuProps = BX(this.visual.DISPLAY_PROP_DIV);
		}
		if (!!this.visual.DISPLAY_PROP_ARTICLE_DIV)
		{
			this.obSkuArticleProps = BX(this.visual.DISPLAY_PROP_ARTICLE_DIV);
		}

	}

	if (this.config.useCompare)
	{
		this.obCompare = BX(this.visual.COMPARE_LINK_ID);
	}
	if (0 === this.errorCode)
	{

		if (this.config.showQuantity)
		{
			if (!!this.obQuantityUp)
			{
				BX.bind(this.obQuantityUp, 'click', BX.delegate(this.QuantityUp, this));
			}
			if (!!this.obQuantityDown)
			{
				BX.bind(this.obQuantityDown, 'click', BX.delegate(this.QuantityDown, this));
			}
			if (!!this.obQuantity)
			{
				BX.bind(this.obQuantity, 'change', BX.delegate(this.QuantityChange, this));
			}
		}
		switch (this.productType)
		{
			case 0://no catalog
			case 1://product
			case 2://set
				if (this.product.useSlider)
				{
					this.product.slider = {
						COUNT: this.product.sliderCount,
						ID: this.visual.SLIDER_CONT,
						CONT: BX(this.visual.SLIDER_CONT),
						LIST: BX(this.visual.SLIDER_LIST),
						LEFT: BX(this.visual.SLIDER_LEFT),
						RIGHT: BX(this.visual.SLIDER_RIGHT),
						START: 0
					};
					SliderImgs = BX.findChildren(this.product.slider.LIST, {tagName: 'li'}, true);
					if (!!SliderImgs && 0 < SliderImgs.length)
					{
						for (j = 0; j < SliderImgs.length; j++)
						{
							BX.bind(SliderImgs[j], 'click', BX.delegate(this.ProductSelectSliderImg, this));
						}
					}
					if (!!this.product.slider.LEFT)
					{
						BX.bind(this.product.slider.LEFT, 'click', BX.delegate(this.ProductSliderRowLeft, this));
						BX.adjust(this.product.slider.LEFT, { style: this.sliderDisableArrow } );

					}
					if (!!this.product.slider.RIGHT)
					{
						BX.bind(this.product.slider.RIGHT, 'click', BX.delegate(this.ProductSliderRowRight, this));
						BX.adjust(this.product.slider.RIGHT, { style: this.sliderEnableArrow } );
					}
					this.setCurrentImg(this.product.sliderPict[0], true);
				}
				break;
			case 3://sku
				for(var key in this.skuVisualParams){
					var TreeItems = BX.findChildren(this.obTree, {tagName: this.skuVisualParams[key].TAG_BIND}, true);
					if (!!TreeItems && 0 < TreeItems.length){
						for (i = 0; i < TreeItems.length; i++){
							$(TreeItems[i]).on(this.skuVisualParams[key].EVENT, BX.delegate(this.SelectOfferProp, this));
							//BX.bind(TreeItems[i], this.skuVisualParams[key].EVENT, BX.delegate(this.SelectOfferProp, this));
						}
					}
				}
				for (i = 0; i < this.offers.length; i++)
				{
					this.offers[i].SLIDER_COUNT = parseInt(this.offers[i].SLIDER_COUNT, 10);
					if (isNaN(this.offers[i].SLIDER_COUNT))
					{
						this.offers[i].SLIDER_COUNT = 0;
					}
					if (0 === this.offers[i].SLIDER_COUNT)
					{
						this.sliders[i] = {
							COUNT: this.offers[i].SLIDER_COUNT,
							ID: ''
						};
					}
					else
					{
						for (j = 0; j < this.offers[i].SLIDER.length; j++)
						{
							this.offers[i].SLIDER[j].WIDTH = parseInt(this.offers[i].SLIDER[j].WIDTH, 10);
							this.offers[i].SLIDER[j].HEIGHT = parseInt(this.offers[i].SLIDER[j].HEIGHT, 10);
						}
						this.sliders[i] = {
							COUNT: this.offers[i].SLIDER_COUNT,
							OFFER_ID: this.offers[i].ID,
							ID: this.visual.SLIDER_CONT_OF_ID+this.offers[i].ID,
							CONT: BX(this.visual.SLIDER_CONT_OF_ID+this.offers[i].ID),
							LIST: BX(this.visual.SLIDER_LIST_OF_ID+this.offers[i].ID),
							CONT_M: BX(this.visual.SLIDER_CONT_OFM_ID+this.offers[i].ID),
							LIST_M: BX(this.visual.SLIDER_LIST_OFM_ID+this.offers[i].ID),
							LEFT: BX(this.visual.SLIDER_LEFT_OF_ID+this.offers[i].ID),
							RIGHT: BX(this.visual.SLIDER_RIGHT_OF_ID+this.offers[i].ID),
							START: 0
						};
						SliderImgs = BX.findChildren(this.sliders[i].LIST, {tagName: 'li'}, true);
						if (!!SliderImgs && 0 < SliderImgs.length)
						{
							for (j = 0; j < SliderImgs.length; j++)
							{
								BX.bind(SliderImgs[j], 'click', BX.delegate(this.SelectSliderImg, this));
							}
						}
						if (!!this.sliders[i].LEFT)
						{
							BX.bind(this.sliders[i].LEFT, 'click', BX.delegate(this.SliderRowLeft, this));
						}
						if (!!this.sliders[i].RIGHT)
						{
							BX.bind(this.sliders[i].RIGHT, 'click', BX.delegate(this.SliderRowRight, this));
						}
					}
				}
				this.SetCurrent();

				break;
		}

		if (!!this.obBuyBtn)
		{
			BX.bind(this.obBuyBtn, 'click', BX.proxy(this.BuyBasket, this));
		}
		if (!!this.obAddToBasketBtn)
		{
			BX.bind(this.obAddToBasketBtn, 'click', BX.proxy(this.Add2Basket, this));
		}
		if (!!this.obCompare)
		{
			BX.bind(this.obCompare, 'click', BX.proxy(this.Compare, this));
		}

		this.setMainPictHandler();
		setTimeout(function(){
			$('.offers_img.wof').css('opacity', 1);
		},400);
	}
};

window.JCCatalogElement.prototype.initConfig = function()
{
	this.productType = parseInt(this.params.PRODUCT_TYPE, 10);
	if (!!this.params.CONFIG && typeof(this.params.CONFIG) === 'object')
	{

		if (this.params.CONFIG.USE_CATALOG !== 'undefined' && BX.type.isBoolean(this.params.CONFIG.USE_CATALOG))
		{
			this.config.useCatalog = this.params.CONFIG.USE_CATALOG;
		}
		this.config.showQuantity = !!this.params.CONFIG.SHOW_QUANTITY;
		this.config.showPrice = !!this.params.CONFIG.SHOW_PRICE;
		this.config.showPercent = !!this.params.CONFIG.SHOW_DISCOUNT_PERCENT;
		this.config.showOldPrice = !!this.params.CONFIG.SHOW_OLD_PRICE;
		this.config.showSkuProps = !!this.params.CONFIG.SHOW_SKU_PROPS;
		this.config.showOfferGroup = !!this.params.CONFIG.OFFER_GROUP;
		this.config.useCompare = !!this.params.CONFIG.DISPLAY_COMPARE;
		this.config.showPercentNumber = (this.params.SHOW_DISCOUNT_PERCENT_NUMBER == "Y");
		if (!!this.params.CONFIG.MAIN_PICTURE_MODE)
		{
			this.config.mainPictureMode = this.params.CONFIG.MAIN_PICTURE_MODE;
		}
		this.config.showBasisPrice = !!this.params.CONFIG.SHOW_BASIS_PRICE;
		if (!!this.params.CONFIG.ADD_TO_BASKET_ACTION)
		{
			this.config.basketAction = this.params.CONFIG.ADD_TO_BASKET_ACTION;
		}
		this.config.showClosePopup = !!this.params.CONFIG.SHOW_CLOSE_POPUP;

		this.config.offerID = this.params.SKU_DETAIL_ID
	}
	else
	{
		// old version
		if (this.params.USE_CATALOG !== 'undefined' && BX.type.isBoolean(this.params.USE_CATALOG))
		{
			this.config.useCatalog = this.params.USE_CATALOG;
		}
		this.config.showQuantity = !!this.params.SHOW_QUANTITY;
		this.config.showPrice = !!this.params.SHOW_PRICE;
		this.config.showPercent = !!this.params.SHOW_DISCOUNT_PERCENT;
		this.config.showOldPrice = !!this.params.SHOW_OLD_PRICE;
		this.config.showSkuProps = !!this.params.SHOW_SKU_PROPS;
		this.config.showOfferGroup = !!this.params.OFFER_GROUP;
		this.config.useCompare = !!this.params.DISPLAY_COMPARE;
		if (!!this.params.MAIN_PICTURE_MODE)
		{
			this.config.mainPictureMode = this.params.MAIN_PICTURE_MODE;
		}
		this.config.showBasisPrice = !!this.params.SHOW_BASIS_PRICE;
		if (!!this.params.ADD_TO_BASKET_ACTION)
		{
			this.config.basketAction = this.params.ADD_TO_BASKET_ACTION;
		}
		this.config.showClosePopup = !!this.params.SHOW_CLOSE_POPUP;
	}

	if (!this.params.VISUAL || typeof(this.params.VISUAL) !== 'object' || !this.params.VISUAL.ID)
	{
		this.errorCode = -1;
		return;
	}
	this.visual.ID = this.params.VISUAL.ID;
	this.basketLinkURL = this.params.BASKET.BASKET_URL;
	this.defaultCount = this.params.DEFAULT_COUNT;
	this.storeQuanity = BX(this.params.STORE_QUANTITY);
	this.initVisualParams('main');
	if (this.config.showQuantity)
	{
		this.initVisualParams('quantity');
	}
	if (this.config.showPrice)
	{
		this.initVisualParams('price');
	}
	if (this.config.showOldPrice)
	{
		this.initVisualParams('oldPrice');
	}
	if (this.config.showPercent)
	{
		this.initVisualParams('discountPerc');
	}
	this.initVisualParams('basket');
	if (this.config.mainPictureMode === 'MAGNIFIER')
	{
		this.initVisualParams('magnifier');
	}
	if (this.config.useCompare)
	{
		this.initVisualParams('compare');
	}
};

window.JCCatalogElement.prototype.initVisualParams = function(ID)
{
	var i = 0,
		key = '';

	if (!this.listID[ID])
	{
		this.errorCode = -1;
		return;
	}
	for (i = 0; i < this.listID[ID].length; i++)
	{
		key = this.listID[ID][i];
		this.visual[key] = (!!this.params.VISUAL[key] ? this.params.VISUAL[key] : this.visual.ID+this.visualPostfix[key]);
	}
};

window.JCCatalogElement.prototype.initProductData = function()
{
	var j = 0;
	this.initVisualParams('productSlider');

	if (!!this.params.PRODUCT && 'object' === typeof(this.params.PRODUCT))
	{
		if (this.config.showQuantity)
		{
			this.product.checkQuantity = this.params.PRODUCT.CHECK_QUANTITY;
			this.product.isDblQuantity = this.params.PRODUCT.QUANTITY_FLOAT;


			if (this.product.checkQuantity)
			{
				this.product.maxQuantity = (this.product.isDblQuantity ? parseFloat(this.params.PRODUCT.MAX_QUANTITY) : parseInt(this.params.PRODUCT.MAX_QUANTITY, 10));
			}
			this.product.stepQuantity = (this.product.isDblQuantity ? parseFloat(this.params.PRODUCT.STEP_QUANTITY) : parseInt(this.params.PRODUCT.STEP_QUANTITY, 10));

			this.checkQuantity = this.product.checkQuantity;
			this.isDblQuantity = this.product.isDblQuantity;
			this.maxQuantity = this.product.maxQuantity;
			this.stepQuantity = this.product.stepQuantity;
			if (this.isDblQuantity)
			{
				this.stepQuantity = Math.round(this.stepQuantity*this.precisionFactor)/this.precisionFactor;
			}
		}

		this.product.canBuy = this.params.PRODUCT.CAN_BUY;
		this.product.canSubscription = this.params.PRODUCT.SUBSCRIPTION;
		if (this.config.showPrice)
		{
			this.currentBasisPrice = this.params.PRODUCT.BASIS_PRICE;
		}

		this.canBuy = this.product.canBuy;
		this.canSubscription = this.product.canSubscription;

		this.product.name = this.params.PRODUCT.NAME;
		this.product.pict = this.params.PRODUCT.PICT;
		this.product.id = this.params.PRODUCT.ID;

		if (!!this.params.PRODUCT.ADD_URL)
		{
			this.product.addUrl = this.params.PRODUCT.ADD_URL;
		}
		if (!!this.params.PRODUCT.BUY_URL)
		{
			this.product.buyUrl = this.params.PRODUCT.BUY_URL;
		}

		if (!!this.params.PRODUCT.SLIDER_COUNT)
		{
			this.product.sliderCount = parseInt(this.params.PRODUCT.SLIDER_COUNT, 10);
			if (isNaN(this.product.sliderCount))
			{
				this.product.sliderCount = 0;
			}
			if (0 < this.product.sliderCount && !!this.params.PRODUCT.SLIDER.length && 0 < this.params.PRODUCT.SLIDER.length)
			{
				for (j = 0; j < this.params.PRODUCT.SLIDER.length; j++)
				{
					this.product.useSlider = true;
					this.params.PRODUCT.SLIDER[j].WIDTH = parseInt(this.params.PRODUCT.SLIDER[j].WIDTH, 10);
					this.params.PRODUCT.SLIDER[j].HEIGHT = parseInt(this.params.PRODUCT.SLIDER[j].HEIGHT, 10);
				}
				this.product.sliderPict = this.params.PRODUCT.SLIDER;
				this.setCurrentImg(this.product.sliderPict[0], false);
			}
		}
		this.currentIsSet = true;
	}
	else
	{
		this.errorCode = -1;
	}
};

window.JCCatalogElement.prototype.initOffersData = function()
{
	this.initVisualParams('offerSlider');
	this.initVisualParams('offerSliderMobile');
	this.initVisualParams('offers');
	if (!!this.params.OFFERS && BX.type.isArray(this.params.OFFERS))
	{
		this.offers = this.params.OFFERS;
		this.offerNum = 0;
		if (!!this.params.OFFER_SELECTED)
		{
			this.offerNum = parseInt(this.params.OFFER_SELECTED, 10);
			if('offers' in this)
			{
				if(this.offers.length)
				{
					var objUrl = parseUrlQuery(),
						sku_params = this.config.offerID,
						sku_id = 0;
					if(sku_params && sku_params in objUrl)
						sku_id = objUrl[sku_params];
					if(sku_id)
					{
						for(var i in this.offers)
						{
							if(this.offers[i].ID == sku_id)
								this.offerNum = parseInt(i, 10);

						}
					}
				}
			}
		}
		if (isNaN(this.offerNum))
		{
			this.offerNum = 0;
		}
		if (!!this.params.TREE_PROPS)
		{
			this.treeProps = this.params.TREE_PROPS;
		}
		if (!!this.params.DEFAULT_PICTURE)
		{
			this.defaultPict.preview = this.params.DEFAULT_PICTURE.PREVIEW_PICTIRE;
			this.defaultPict.detail = this.params.DEFAULT_PICTURE.DETAIL_PICTURE;
		}
		if (!!this.params.PRODUCT && typeof(this.params.PRODUCT) === 'object')
		{
			this.product.id = parseInt(this.params.PRODUCT.ID, 10);
			this.product.name = this.params.PRODUCT.NAME;
		}
	}
	else
	{
		this.errorCode = -1;
	}
};

window.JCCatalogElement.prototype.initBasketData = function()
{
	if (!!this.params.BASKET && 'object' === typeof(this.params.BASKET))
	{
		if (1 === this.productType || 2 === this.productType)
		{
			this.basketData.useProps = !!this.params.BASKET.ADD_PROPS;
			this.basketData.emptyProps = !!this.params.BASKET.EMPTY_PROPS;
		}

		if (!!this.params.BASKET.QUANTITY)
		{
			this.basketData.quantity = this.params.BASKET.QUANTITY;
		}
		if (!!this.params.BASKET.PROPS)
		{
			this.basketData.props = this.params.BASKET.PROPS;
		}
		if (!!this.params.BASKET.BASKET_URL)
		{
			this.basketData.basketUrl = this.params.BASKET.BASKET_URL;
		}
		if (3 === this.productType)
		{
			if (!!this.params.BASKET.SKU_PROPS)
			{
				this.basketData.sku_props = this.params.BASKET.SKU_PROPS;
			}
		}
		if (!!this.params.BASKET.ADD_URL_TEMPLATE)
		{
			this.basketData.add_url = this.params.BASKET.ADD_URL_TEMPLATE;
		}
		if (!!this.params.BASKET.BUY_URL_TEMPLATE)
		{
			this.basketData.buy_url = this.params.BASKET.BUY_URL_TEMPLATE;
		}
		if (this.basketData.add_url === '' && this.basketData.buy_url === '')
		{
			this.errorCode = -1024;
		}
	}
};

window.JCCatalogElement.prototype.initCompareData = function()
{
	if (this.config.useCompare)
	{
		if (!!this.params.COMPARE && typeof(this.params.COMPARE) === 'object')
		{
			if (!!this.params.COMPARE.COMPARE_PATH)
			{
				this.compareData.comparePath = this.params.COMPARE.COMPARE_PATH;
			}
			if (!!this.params.COMPARE.COMPARE_URL_TEMPLATE_DEL)
			{
				this.compareData.compareUrlDel = this.params.COMPARE.COMPARE_URL_TEMPLATE_DEL;
			}
			if (!!this.params.COMPARE.COMPARE_URL_TEMPLATE)
			{
				this.compareData.compareUrl = this.params.COMPARE.COMPARE_URL_TEMPLATE;
			}
			else
			{
				this.config.useCompare = false;
			}
		}
		else
		{
			this.config.useCompare = false;
		}
	}
};

window.JCCatalogElement.prototype.setMainPictHandler = function()
{
	switch (this.config.mainPictureMode)
	{
		case 'GALLERY':
			break;
		case 'MAGNIFIER':
			if(this.currentBigImg.src)
			{
				$(this.obPict).addClass('zoom_picture');
				InitZoomPict();
			}
			break;
		case 'POPUP':
			$(this.obPict).parent().addClass('fancy_offer');
			break;
		default:
			break;
	}
};

window.JCCatalogElement.prototype.setCurrentImg = function(img, showImage)
{
	showImage = !!showImage;
	if('SMALL' in img){
		this.currentImg.src = img.SMALL.src;
	}else if ('SRC' in img) {
		this.currentImg.src = img.SRC
	};
	if('BIG' in img){
		this.currentBigImg.src = img.BIG.src;
	}
	if('WIDTH' in img){
		this.currentImg.width = img.WIDTH;
	}
	if('HEIGHT' in img){
		this.currentImg.height = img.HEIGHT;
	}
	if (showImage && !!this.obPict)
	{
		if (this.config.mainPictureMode === 'MAGNIFIER')
		{
			$(this.obPict).attr('data-large',this.currentBigImg.src);
			$(this.obPict).attr('xoriginal',this.currentBigImg.src);
			if('SMALL' in img)
				$(this.obPict).attr('xpreview',img.SMALL.src);
		}
		if('src' in this.currentImg){
			if (this.currentImg.src){
				BX.adjust(this.obPict, { props: { src: this.currentImg.src } });
			}

			$(this.obPict).attr('data-src', this.currentBigImg.src);
		}
		if('src' in this.currentBigImg){
			if (this.currentBigImg.src){
				if(this.config.mainPictureMode === 'POPUP'){
					$(this.obPict).parent().attr('href',this.currentBigImg.src).addClass('popup_link');
				}
				$(this.obPict).parent().attr('title',img.TITLE);
				$(this.obPict).parent().attr('alt',img.ALT);
				$(this.obPict).attr('title',img.TITLE);
				$(this.obPict).attr('alt',img.ALT);
			}
		}
		if (this.config.mainPictureMode == 'POPUP') {
			if (!('ID' in img)) {
				$(this.obPict).parent().removeClass('popup_link');
			}
		}
	}
};

window.JCCatalogElement.prototype.scaleImg = function(src, dest)
{
	var
		scaleX,
		scaleY,
		scale,
		result = {};

	if (dest.width >= src.width && dest.height >= src.height)
	{
		result.width = src.width;
		result.height = src.height;
	}
	else
	{
		scaleX = dest.width/src.width;
		scaleY = dest.height/src.height;
		scale =  Math.min(scaleX, scaleY);
		result.width = Math.max(1, parseInt(scale*src.width , 10));
		result.height = Math.max(1, parseInt(scale*src.height , 10));
	}
	return result;
};

window.JCCatalogElement.prototype.showMagnifier = function(e)
{
	if (!this.magnify.magnifyShow)
	{
		this.calcMagnifierParams();
		this.calcMagnifyAreaSize();
		this.calcMagnifyAreaPos(e);
		this.calcMagnifyPictSize();
		this.calcMagnifyPictPos();
		this.setMagnifyAreaParams(true);
		this.setMagnifyPictParams(true);
		this.setMagnifierParams(true);
		BX.bind(document, 'mousemove', BX.proxy(this.moveMagnifierArea, this));
	}
};

window.JCCatalogElement.prototype.hideMagnifier = function()
{
	if (!this.magnify.magnifyShow)
	{
		if (!!this.magnify.obMagnifier)
		{
			BX.adjust(this.magnify.obMagnifier, { style: { display: 'none' } });
		}
		if (!!this.magnify.obMagnifyArea)
		{
			BX.adjust(this.magnify.obMagnifyArea, { style: { display: 'none' } });
		}
		BX.unbind(document, 'mousemove', BX.proxy(this.moveMagnifierArea, this));
	}
};

window.JCCatalogElement.prototype.moveMagnifierArea = function(e)
{
	var
		currentPos = {
			X: 0,
			Y: 0
		},
		posBigImg = BX.pos(this.obPict),
		intersect = {},
		params = {},
		paramsPict = {};

	currentPos = this.inRect(e, posBigImg);
	if (this.inBound(posBigImg, currentPos))
	{
		intersect = this.intersectArea(currentPos, posBigImg);
		switch (intersect.X)
		{
			case -1:
				this.magnify.areaParams.left = this.currentImg.screenOffsetX;
				break;
			case 0:
				this.magnify.areaParams.left = this.currentImg.screenOffsetX + currentPos.X - (this.magnify.areaParams.width >>> 1);
				break;
			case 1:
				this.magnify.areaParams.left = this.currentImg.screenOffsetX + posBigImg.width - this.magnify.areaParams.width;
				break;
		}
		switch (intersect.Y)
		{
			case -1:
				this.magnify.areaParams.top = 0;
				break;
			case 0:
				this.magnify.areaParams.top = currentPos.Y - (this.magnify.areaParams.height >>> 1);
				break;
			case 1:
				this.magnify.areaParams.top = posBigImg.height - this.magnify.areaParams.height;
				break;
		}
		this.magnify.magnifyPictParams.marginLeft = -parseInt(((this.magnify.areaParams.left-this.currentImg.screenOffsetX)*this.currentImg.scale), 10);
		this.magnify.magnifyPictParams.marginTop = -parseInt(((this.magnify.areaParams.top)*this.currentImg.scale), 10);
		params.left = this.magnify.areaParams.left+'px';
		params.top = this.magnify.areaParams.top+'px';
		BX.adjust(this.magnify.obMagnifyArea, { style: params });
		paramsPict.marginLeft = this.magnify.magnifyPictParams.marginLeft+'px';
		paramsPict.marginTop = this.magnify.magnifyPictParams.marginTop+'px';
		BX.adjust(this.magnify.obMagnifyPict, { style: paramsPict });
	}
	else
	{
		this.outMagnifierArea();
		this.hideMagnifier();
	}
};

window.JCCatalogElement.prototype.onMagnifierArea = function()
{
	this.magnify.magnifyShow = true;
};

window.JCCatalogElement.prototype.outMagnifierArea = function()
{
	this.magnify.magnifyShow = false;
};

window.JCCatalogElement.prototype.calcMagnifierParams = function()
{
	if (!!this.magnify.obBigImg)
	{
		var pos = BX.pos(this.magnify.obBigImg, true);

		this.magnify.magnifierParams.width = pos.width;
		this.magnify.magnifierParams.height = pos.height;
		this.magnify.magnifierParams.top = pos.top;
		this.magnify.magnifierParams.left = pos.left + pos.width + 2;
	}
};

window.JCCatalogElement.prototype.setMagnifierParams = function(show)
{
	if (!!this.magnify.obMagnifier)
	{
		show = !!show;
		var params = {
			top: this.magnify.magnifierParams.top+'px',
			left: this.magnify.magnifierParams.left+'px',
			width: this.magnify.magnifierParams.width+'px',
			height: this.magnify.magnifierParams.height+'px'
		};
		if (show)
		{
			params.display = '';
		}
		BX.adjust(this.magnify.obMagnifier, { style: params });
	}
};

window.JCCatalogElement.prototype.setMagnifyAreaParams = function(show)
{
	if (!!this.magnify.obMagnifier)
	{
		show = !!show;
		var params = {
			top: this.magnify.areaParams.top+'px',
			left: this.magnify.areaParams.left+'px',
			width: this.magnify.areaParams.width+'px',
			height: this.magnify.areaParams.height+'px'
		};
		if (show)
		{
			params.display = '';
		}
		BX.adjust(this.magnify.obMagnifyArea, { style: params });
	}
};

window.JCCatalogElement.prototype.calcMagnifyAreaPos = function(e)
{
	var currentPos,
		posBigImg,
		intersect;

	posBigImg = BX.pos(this.obPict);
	currentPos = this.inRect(e, posBigImg);
	if (this.inBound(posBigImg, currentPos))
	{
		intersect = this.intersectArea(currentPos, posBigImg);
		switch (intersect.X)
		{
			case -1:
				this.magnify.areaParams.left = this.currentImg.screenOffsetX;
				break;
			case 0:
				this.magnify.areaParams.left = this.currentImg.screenOffsetX + currentPos.X - (this.magnify.areaParams.width >>> 1);
				break;
			case 1:
				this.magnify.areaParams.left = this.currentImg.screenOffsetX + posBigImg.width - this.magnify.areaParams.width;
				break;
		}
		switch (intersect.Y)
		{
			case -1:
				this.magnify.areaParams.top = 0;
				break;
			case 0:
				this.magnify.areaParams.top = currentPos.Y - (this.magnify.areaParams.height >>> 1);
				break;
			case 1:
				this.magnify.areaParams.top = posBigImg.height - this.magnify.areaParams.height;
				break;
		}
	}
};

window.JCCatalogElement.prototype.inBound = function(rect, point)
{
	return ((0 <= point.Y && rect.height >= point.Y) && (0 <= point.X && rect.width >= point.X));
};

window.JCCatalogElement.prototype.inRect = function(e, rect)
{
	var wndSize = BX.GetWindowSize(),
		currentPos = {
			X: 0,
			Y: 0,
			globalX: 0,
			globalY: 0
		};

	currentPos.globalX = e.clientX + wndSize.scrollLeft;
	currentPos.X = currentPos.globalX - rect.left;
	currentPos.globalY = e.clientY + wndSize.scrollTop;
	currentPos.Y = currentPos.globalY - rect.top;
	return currentPos;
};

window.JCCatalogElement.prototype.intersectArea = function(currentPos, rect)
{
	var intersect = {
			X: 0,
			Y: 0
		},
		halfX = this.magnify.areaParams.width >>> 1,
		halfY = this.magnify.areaParams.height >>> 1;

	if (currentPos.X <= halfX)
	{
		intersect.X = -1;
	}
	else if (currentPos.X >= (rect.width - halfX))
	{
		intersect.X = 1;
	}
	else
	{
		intersect.X = 0;
	}
	if (currentPos.Y <= halfY)
	{
		intersect.Y = -1;
	}
	else if (currentPos.Y >= (rect.height - halfY))
	{
		intersect.Y = 1;
	}
	else
	{
		intersect.Y = 0;
	}

	return intersect;
};

window.JCCatalogElement.prototype.calcMagnifyAreaSize = function()
{
	var scaleX,
		scaleY,
		scale;

	if (
		this.magnify.magnifierParams.width < this.currentImg.width &&
			this.magnify.magnifierParams.height < this.currentImg.height
		)
	{
		scaleX = this.magnify.obBigImg.offsetWidth/this.currentImg.width;
		scaleY = this.magnify.obBigImg.offsetHeight/this.currentImg.height;
		scale =  Math.min(scaleX, scaleY);
		this.currentImg.scale = 1/scale;
		this.magnify.areaParams.width = Math.max(1, parseInt(scale*this.magnify.magnifierParams.width , 10));
		this.magnify.areaParams.height = Math.max(1, parseInt(scale*this.magnify.magnifierParams.height , 10));
		this.magnify.areaParams.scaleFactor = this.magnify.magnifierParams.defaultScale;
	}
	else
	{
		scaleX = this.obPict.offsetWidth/this.magnify.obBigImg.offsetWidth;
		scaleY = this.obPict.offsetHeight/this.magnify.obBigImg.offsetHeight;
		scale =  Math.min(scaleX, scaleY);
		this.currentImg.scale = 1/scale;
		this.magnify.areaParams.width = Math.max(1, parseInt(scale*this.magnify.magnifierParams.width , 10));
		this.magnify.areaParams.height = Math.max(1, parseInt(scale*this.magnify.magnifierParams.height , 10));

		scaleX = this.magnify.magnifierParams.width/this.currentImg.width;
		scaleY = this.magnify.magnifierParams.height/this.currentImg.height;
		scale = Math.max(scaleX, scaleY);
		this.magnify.areaParams.scaleFactor = scale;
	}
};

window.JCCatalogElement.prototype.calcMagnifyPictSize = function()
{
	this.magnify.magnifyPictParams.width = this.currentImg.width*this.magnify.areaParams.scaleFactor;
	this.magnify.magnifyPictParams.height = this.currentImg.height*this.magnify.areaParams.scaleFactor;
};

window.JCCatalogElement.prototype.calcMagnifyPictPos = function()
{
	this.magnify.magnifyPictParams.marginLeft = -parseInt(((this.magnify.areaParams.left-this.currentImg.screenOffsetX)*this.currentImg.scale), 10);
	this.magnify.magnifyPictParams.marginTop = -parseInt(((this.magnify.areaParams.top)*this.currentImg.scale), 10);
};

window.JCCatalogElement.prototype.setMagnifyPictParams = function(show)
{
	if (!!this.magnify.obMagnifier)
	{
		show = !!show;
		var params = {
			width: this.magnify.magnifyPictParams.width+'px',
			height: this.magnify.magnifyPictParams.height+'px',
			marginTop: this.magnify.magnifyPictParams.marginTop+'px',
			marginLeft: this.magnify.magnifyPictParams.marginLeft+'px'
		};
		if (show)
		{
			params.display = '';
		}
		BX.adjust(this.magnify.obMagnifyPict, { style: params, props: { src: this.currentImg.src } });
	}
};

window.JCCatalogElement.prototype.ProductSliderRowLeft = function()
{
	var target = BX.proxy_context;
	if (!!target)
	{
		if (this.sliderRowShowSize < this.product.slider.COUNT)
		{
			if (0 > this.product.slider.START)
			{
				this.product.slider.START++;
				BX.adjust(this.product.slider.LIST, { style: { marginLeft: this.product.slider.START*20+'%' }});
				BX.adjust(this.product.slider.RIGHT, { style: this.sliderEnableArrow });
			}

			if (0 <= this.product.slider.START)
			{
				BX.adjust(this.product.slider.LEFT, { style: this.sliderDisableArrow });
			}
		}
	}
};

window.JCCatalogElement.prototype.ProductSliderRowRight = function()
{
	var target = BX.proxy_context;
	if (!!target)
	{
		if (this.sliderRowShowSize < this.product.slider.COUNT)
		{
			if ((this.sliderRowShowSize - this.product.slider.START) < this.product.slider.COUNT)
			{
				this.product.slider.START--;
				BX.adjust(this.product.slider.LIST, { style: { marginLeft: this.product.slider.START*20+'%' }});
				BX.adjust(this.product.slider.LEFT, { style: this.sliderEnableArrow } );
			}

			if ((this.sliderRowShowSize - this.product.slider.START) >= this.product.slider.COUNT)
			{
				BX.adjust(this.product.slider.RIGHT, { style: this.sliderDisableArrow } );
			}
		}
	}
};

window.JCCatalogElement.prototype.ProductSelectSliderImg = function()
{
	var strValue = '',
		target = BX.proxy_context;
	if (!!target && target.hasAttribute('data-value'))
	{
		strValue = target.getAttribute('data-value');
		this.SetProductMainPict(strValue);
	}
};

window.JCCatalogElement.prototype.SetProductMainPict = function(intPict)
{
	var indexPict = -1,
		i = 0,
		j = 0,
		value = '',
		strValue = '',
		RowItems = null;
	if (0 < this.product.sliderCount)
	{
		for (j = 0; j < this.product.sliderPict.length; j++)
		{
			if (intPict === this.product.sliderPict[j].ID)
			{
				indexPict = j;
				break;
			}
		}
		if (-1 < indexPict)
		{
			if (!!this.product.sliderPict[indexPict])
			{
				this.setCurrentImg(this.product.sliderPict[indexPict], true);
			}
			RowItems = BX.findChildren(this.product.slider.LIST, {tagName: 'li'}, false);
			if (!!RowItems && 0 < RowItems.length)
			{
				strValue = intPict;
				for (i = 0; i < RowItems.length; i++)
				{
					value = RowItems[i].getAttribute('data-value');
					if (value === strValue)
					{
						BX.addClass(RowItems[i], 'active');
					}
					else
					{
						BX.removeClass(RowItems[i], 'active');
					}
				}
			}
		}
	}
};

window.JCCatalogElement.prototype.SliderRowLeft = function()
{
	var strValue = '',
		index = -1,
		i,
		target = BX.proxy_context;
	if (!!target && target.hasAttribute('data-value'))
	{
		strValue = target.getAttribute('data-value');
		for (i = 0; i < this.sliders.length; i++)
		{
			if (this.sliders[i].OFFER_ID === strValue)
			{
				index = i;
				break;
			}
		}
		if (-1 < index && this.sliderRowShowSize < this.sliders[index].COUNT)
		{
			if (0 > this.sliders[index].START)
			{
				this.sliders[index].START++;
				BX.adjust(this.sliders[index].LIST, { style: { marginLeft: this.sliders[index].START*20+'%' }});
				BX.adjust(this.sliders[index].RIGHT, { style: this.sliderEnableArrow });
			}

			if (0 <= this.sliders[index].START)
			{
				BX.adjust(this.sliders[index].LEFT, { style: this.sliderDisableArrow });
			}
		}
	}
};

window.JCCatalogElement.prototype.SliderRowRight = function()
{
	var strValue = '',
		index = -1,
		i,
		target = BX.proxy_context;
	if (!!target && target.hasAttribute('data-value'))
	{
		strValue = target.getAttribute('data-value');
		for (i = 0; i < this.sliders.length; i++)
		{
			if (this.sliders[i].OFFER_ID === strValue)
			{
				index = i;
				break;
			}
		}
		if (-1 < index && this.sliderRowShowSize < this.sliders[index].COUNT)
		{
			if ((this.sliderRowShowSize - this.sliders[index].START) < this.sliders[index].COUNT)
			{
				this.sliders[index].START--;
				BX.adjust(this.sliders[index].LIST, { style: { marginLeft: this.sliders[index].START*20+'%' }});
				BX.adjust(this.sliders[index].LEFT, { style: this.sliderEnableArrow } );
			}

			if ((this.sliderRowShowSize - this.sliders[index].START) >= this.sliders[index].COUNT)
			{
				BX.adjust(this.sliders[index].RIGHT, { style: this.sliderDisableArrow } );
			}
		}
	}
};

window.JCCatalogElement.prototype.SelectSliderImg = function()
{
	var strValue = '',
		arItem = [],
		target = BX.proxy_context;
	if (!!target && target.hasAttribute('data-value'))
	{
		strValue = target.getAttribute('data-value');
		arItem = strValue.split('_');
		this.SetMainPict(arItem[0], arItem[1]);
	}
};

window.JCCatalogElement.prototype.SetMainPict = function(intSlider, intPict)
{
	var index = -1,
		indexPict = -1,
		i,
		j,
		value = '',
		RowItems = null,
		strValue = '';

	for (i = 0; i < this.offers.length; i++)
	{
		if (intSlider === this.offers[i].ID)
		{
			index = i;
			break;
		}
	}

	// $(window).resize();
	$('.thumbs_navigation ul').addClass('hidden_block');
	if(this.SliderImages>1){
		$('.thumbs_navigation ul:eq('+index+')').removeClass('hidden_block');
	}
	$('.thumbs_navigation').removeClass('hidden_block');

	$('.fancy_offer').addClass('hidden_block');
	$(this.obPict).closest('.offers_img').css('opacity', 0);

	if (-1 < index)
	{
		if (0 < this.offers[index].SLIDER_COUNT)
		{
			for (j = 0; j < this.offers[index].SLIDER.length; j++)
			{
				if (intPict === this.offers[index].SLIDER[j].ID)
				{
					indexPict = j;
					break;
				}
			}
			if (-1 < indexPict)
			{
				if (!!this.offers[index].SLIDER[indexPict])
				{
					this.setCurrentImg(this.offers[index].SLIDER[indexPict], true);
				}

				RowItems = BX.findChildren(this.sliders[index].LIST, {tagName: 'li'}, false);
				if (!!RowItems && 0 < RowItems.length)
				{
					strValue = intSlider+'_'+intPict;
					for (i = 0; i < RowItems.length; i++)
					{
						value = RowItems[i].getAttribute('data-value');
						if (value === strValue)
						{
							BX.addClass(RowItems[i], 'current');
						}
						else
						{
							BX.removeClass(RowItems[i], 'current');
						}
					}
				}
			}
		}
	}
	setTimeout(function(){
		$('.fancy_offer').removeClass('hidden_block');
		$('.offers_img').css('opacity', 1);
	}, 200);
};

window.JCCatalogElement.prototype.SetMainPictFromItem = function(index)
{
	if (!!this.obPict)
	{
		var boolSet = false,
			obNewPict = {};

		if (!!this.offers[index])
		{
			if (!!this.offers[index].DETAIL_PICTURE)
			{
				obNewPict = this.offers[index].DETAIL_PICTURE;
				boolSet = true;
			}
			else if (!!this.offers[index].PREVIEW_PICTURE)
			{
				obNewPict = this.offers[index].PREVIEW_PICTURE;
				boolSet = true;
			}
		}
		if (!boolSet)
		{
			if (!!this.defaultPict.detail)
			{
				obNewPict = this.defaultPict.detail;
				boolSet = true;
			}
			else if (!!this.defaultPict.preview)
			{
				obNewPict = this.defaultPict.preview;
				boolSet = true;
			}
		}
		if (boolSet)
		{
			this.setCurrentImg(obNewPict, true);
		}
	}
};

window.JCCatalogElement.prototype.SetAdditionalGallery = function(index){
	var $gallery = $('.galerys-block');
	if($gallery.length){
		var bHidden = $gallery.hasClass('hidden');
		var bTypeBig = $gallery.find('.big_slider').length;
		var $slider = bTypeBig ? $gallery.find('.big_slider') : $gallery.find('.small_slider');
		if($slider.length){
			if($.hasData($slider[0])){
				$.removeData($slider[0]);
				$slider.find('.flex-control-nav').remove();
				$slider.find('.flex-direction-nav').remove();
			}

			var slides = ethumbs = '';
			if(this.offers[index].ADDITIONAL_GALLERY.length){
				for(var i in this.offers[index].ADDITIONAL_GALLERY){
					var arPhoto = this.offers[index].ADDITIONAL_GALLERY[i];
					if(bTypeBig){
						slides += '<li class="col-md-12 item"><a href="' + arPhoto.DETAIL.SRC + '" class="fancy" rel="gallery" target="_blank" title="' + arPhoto.TITLE + '"><img src="' + arPhoto.PREVIEW.src + '" class="img-responsive inline" title="' + arPhoto.TITLE + '" alt="' + arPhoto.ALT + '" /><span class="zoom"></span></li>';
						ethumbs += '<li class="item"><img class="img-responsive inline" border="0" src="' + arPhoto.THUMB.src + '" title="' + arPhoto.TITLE + '" alt="' + arPhoto.ALT + '" /></li>';
					}
					else{
						slides += '<li class="col-md-3 item visible"><div><img src="' + arPhoto.PREVIEW.src + '" class="img-responsive inline" title="' + arPhoto.TITLE + '" alt="' + arPhoto.ALT + '" /></div><a href="' + arPhoto.DETAIL.SRC + '" class="fancy dark_block_animate" rel="gallery" target="_blank" title="' + arPhoto.TITLE + '"></a></li>';
					}
				}
			}
			$slider.find('.slides').html(slides);
			$slider.removeClass('flexslider-init');

			if(bTypeBig){
				var $ethumbs = $gallery.find('.ethumbs');
				if($ethumbs.length){
					if($.hasData($ethumbs[0])){
						$.removeData($ethumbs[0]);
						$ethumbs.find('.flex-control-nav').remove();
						$ethumbs.find('.flex-direction-nav').remove();
					}
					$ethumbs.find('.slides').html(ethumbs);
					$ethumbs.removeClass('flexslider-init');
				}
			}

			if(this.offers[index].ADDITIONAL_GALLERY.length){
				if(bHidden){
					$gallery.removeClass('hidden');
				}
				InitFlexSlider();
				var interval = setInterval(function(){
					if($slider.find('.slides .item').length && $slider.find('.slides .item').attr('style').indexOf('height') === -1){
						$(window).resize();
					}
					else{
						clearInterval(interval);
					}
				}, 100);
			}
			else{
				$gallery.addClass('hidden');
			}
		}
	}
};

window.JCCatalogElement.prototype.showMainPictPopup = function(e)
{
	var pictContent = '';

	pictContent = '<div style="text-align: center;"><img src="'+
		this.currentImg.src+
		'" width="'+this.currentImg.width+'" height="'+this.currentImg.height+'" name=""></div>';
	this.obPopupPict.setContent(pictContent);
	this.obPopupPict.show();
	return BX.PreventDefault(e);
};

window.JCCatalogElement.prototype.QuantityUp = function()
{
	var curValue = 0,
		boolSet = true,
		calcPrice;

	if (0 === this.errorCode && this.config.showQuantity && this.canBuy)
	{
		curValue = (this.isDblQuantity ? parseFloat(this.obQuantity.value) : parseInt(this.obQuantity.value, 10));
		if (!isNaN(curValue))
		{
			curValue += this.stepQuantity;
			if (this.checkQuantity)
			{
				if (curValue > this.maxQuantity)
				{
					boolSet = false;
				}
			}

			if (boolSet)
			{
				if (this.isDblQuantity)
				{
					curValue = Math.round(curValue*this.precisionFactor)/this.precisionFactor;
				}
				this.obQuantity.value = curValue;
			}
		}
	}
};

window.JCCatalogElement.prototype.QuantityDown = function()
{
	var curValue = 0,
		boolSet = true,
		calcPrice;

	if (0 === this.errorCode && this.config.showQuantity && this.canBuy)
	{
		curValue = (this.isDblQuantity ? parseFloat(this.obQuantity.value) : parseInt(this.obQuantity.value, 10));
		if (!isNaN(curValue))
		{
			curValue -= this.stepQuantity;
			if (curValue < this.stepQuantity)
			{
				boolSet = false;
			}
			if (boolSet)
			{
				if (this.isDblQuantity)
				{
					curValue = Math.round(curValue*this.precisionFactor)/this.precisionFactor;
				}
				this.obQuantity.value = curValue;
			}
		}
	}
};

window.JCCatalogElement.prototype.QuantityChange = function()
{
	var curValue = 0,
		calcPrice,
		intCount,
		count;

	if (0 === this.errorCode && this.config.showQuantity)
	{
		if (this.canBuy)
		{
			curValue = (this.isDblQuantity ? parseFloat(this.obQuantity.value) : parseInt(this.obQuantity.value, 10));
			if (!isNaN(curValue))
			{
				if (this.checkQuantity)
				{
					if (curValue > this.maxQuantity)
					{
						curValue = this.maxQuantity;
					}
				}
				if (curValue < this.stepQuantity)
				{
					curValue = this.stepQuantity;
				}
				else
				{
					count = Math.round((curValue*this.precisionFactor)/this.stepQuantity)/this.precisionFactor;
					intCount = parseInt(count, 10);
					if (isNaN(intCount))
					{
						intCount = 1;
						count = 1.1;
					}
					if (count > intCount)
					{
						curValue = (intCount <= 1 ? this.stepQuantity : intCount*this.stepQuantity);
						curValue = Math.round(curValue*this.precisionFactor)/this.precisionFactor;
					}
				}
				this.obQuantity.value = curValue;
			}
			else
			{
				this.obQuantity.value = this.stepQuantity;
			}
		}
		else
		{
			this.obQuantity.value = this.stepQuantity;
		}
	}
};

window.JCCatalogElement.prototype.QuantitySet = function(index)
{
	var basisPrice = '',
		strLimit;
	if (this.errorCode === 0)
	{
		this.canBuy = this.offers[index].CAN_BUY;

		this.currentPriceMode = this.offers[index].ITEM_PRICE_MODE;
		this.currentPrices = this.offers[index].ITEM_PRICES;
		this.currentPriceSelected = this.offers[index].ITEM_PRICE_SELECTED;
		this.currentQuantityRanges = this.offers[index].ITEM_QUANTITY_RANGES;
		this.currentQuantityRangeSelected = this.offers[index].ITEM_QUANTITY_RANGE_SELECTED;

		if (this.canBuy)
		{
			if (!!this.obBasketActions)
			{
				BX.style(this.obBasketActions, 'display', '');
			}
			if (!!this.obNotAvail)
			{
				BX.style(this.obNotAvail, 'display', 'none');
			}
		}
		else
		{
			if (!!this.obBasketActions)
			{
				//BX.style(this.obBasketActions, 'display', 'none');
				BX.style(this.obBasketActions, 'opacity', '0');
				BX.style(BX.findParent(BX(this.obQuantity), { 'class':'counter_block' }), 'display', 'none');
			}
			if (!!this.obNotAvail)
			{
				BX.style(this.obNotAvail, 'display', '');
			}
		}
		if (this.config.showQuantity)
		{
			this.isDblQuantity = this.offers[index].QUANTITY_FLOAT;
			this.checkQuantity = this.offers[index].CHECK_QUANTITY;
			if (this.isDblQuantity)
			{
				this.maxQuantity = parseFloat(this.offers[index].MAX_QUANTITY);
				this.stepQuantity = Math.round(parseFloat(this.offers[index].STEP_QUANTITY)*this.precisionFactor)/this.precisionFactor;
			}
			else
			{
				this.maxQuantity = parseInt(this.offers[index].MAX_QUANTITY, 10);
				this.stepQuantity = parseInt(this.offers[index].STEP_QUANTITY, 10);
			}
			/*this.obQuantity.value = this.stepQuantity;
			this.obQuantity.disabled = !this.canBuy;*/
			if (!!this.obMeasure)
			{
				if (!!this.offers[index].MEASURE)
				{
					BX.adjust(this.obMeasure, { html : this.offers[index].MEASURE});
				}
				else
				{
					BX.adjust(this.obMeasure, { html : ''});
				}
			}
			if (!!this.obQuantityLimit.all)
			{
				if (!this.checkQuantity)
				{
					BX.adjust(this.obQuantityLimit.value, { html: '' });
					BX.adjust(this.obQuantityLimit.all, { style: {display: 'none'} });
				}
				else
				{
					strLimit = this.offers[index].MAX_QUANTITY;
					if (!!this.offers[index].MEASURE)
					{
						strLimit += (' '+this.offers[index].MEASURE);
					}
					BX.adjust(this.obQuantityLimit.value, { html: strLimit});
					BX.adjust(this.obQuantityLimit.all, { style: {display: ''} });
				}
			}
			if (!!this.obBasisPrice)
			{
				if (!!this.offers[index].BASIS_PRICE)
				{
					basisPrice = BX.message('BASIS_PRICE_MESSAGE');
					basisPrice = basisPrice.replace(
						'#PRICE#',
						BX.Currency.currencyFormat(this.offers[index].BASIS_PRICE.DISCOUNT_VALUE, this.offers[index].BASIS_PRICE.CURRENCY, true)
					);
					basisPrice = basisPrice.replace('#MEASURE#', this.offers[index].MEASURE);
					BX.adjust(this.obBasisPrice, { style: { display: '' }, html: basisPrice });
				}
				else
				{
					BX.adjust(this.obBasisPrice, { style: { display: 'none' }, html: '' });
				}
			}
		}
		this.currentBasisPrice = this.offers[index].BASIS_PRICE;
	}
};

window.JCCatalogElement.prototype.SelectOfferProp = function()
{
	var i = 0,
		strTreeValue = '',
		arTreeItem = [],
		RowItems = null,
		target = BX.proxy_context;
	if(typeof target.options !== 'undefined' && typeof target.options[target.selectedIndex] !== 'undefined')
		target = target.options[target.selectedIndex];
	if (!!target && target.hasAttribute('data-treevalue'))
	{
		strTreeValue = target.getAttribute('data-treevalue');
		propModes = target.getAttribute('data-showtype');
		arTreeItem = strTreeValue.split('_');

		this.SearchOfferPropIndex(arTreeItem[0], arTreeItem[1]);
		RowItems = BX.findChildren(target.parentNode, {tagName: this.skuVisualParams[propModes.toUpperCase()].TAG}, false);
		if (!!RowItems && 0 < RowItems.length)
		{
			for (i = 0; i < RowItems.length; i++)
			{
				value = RowItems[i].getAttribute('data-onevalue');

				// for SELECTBOXES
				if(propModes == 'TEXT'){
					if (value === arTreeItem[1]){
						RowItems[i].setAttribute('selected', 'selected');
					}else{
						RowItems[i].removeAttribute('selected');
					}
				}else{
					if (value === arTreeItem[1]){
						$(RowItems[i]).addClass(this.skuVisualParams[propModes.toUpperCase()].ACTIVE_CLASS);
					}else{
						$(RowItems[i]).removeClass(this.skuVisualParams[propModes.toUpperCase()].ACTIVE_CLASS);
					}
				}
			}
		}
	}
};

window.JCCatalogElement.prototype.SearchOfferPropIndex = function(strPropID, strPropValue)
{
	var strName = '',
		arShowValues = false,
		arCanBuyValues = [],
		allValues = [],
		index = -1,
		i, j,
		arFilter = {},
		tmpFilter = [];

	for (i = 0; i < this.treeProps.length; i++)
	{
		if (this.treeProps[i].ID === strPropID)
		{
			index = i;
			break;
		}
	}
	if (-1 < index)
	{
		for (i = 0; i < index; i++)
		{
			strName = 'PROP_'+this.treeProps[i].ID;
			arFilter[strName] = this.selectedValues[strName];
		}
		strName = 'PROP_'+this.treeProps[index].ID;
		arFilter[strName] = strPropValue;

		for (i = index+1; i < this.treeProps.length; i++)
		{
			strName = 'PROP_'+this.treeProps[i].ID;
			arShowValues = this.GetRowValues(arFilter, strName);

			if (!arShowValues)
			{
				break;
			}
			allValues = [];
			if (this.config.showAbsent)
			{
				arCanBuyValues = [];
				tmpFilter = [];
				tmpFilter = BX.clone(arFilter, true);
				for (j = 0; j < arShowValues.length; j++)
				{
					tmpFilter[strName] = arShowValues[j];
					allValues[allValues.length] = arShowValues[j];
					if (this.GetCanBuy(tmpFilter))
					{
						arCanBuyValues[arCanBuyValues.length] = arShowValues[j];
					}
				}
			}
			else
			{
				arCanBuyValues = arShowValues;
			}

			if (this.selectedValues[strName] && BX.util.in_array(this.selectedValues[strName], arCanBuyValues))
			{
				arFilter[strName] = this.selectedValues[strName];
			}
			else
			{
				if (this.config.showAbsent)
				{
					arFilter[strName] = (arCanBuyValues.length ? arCanBuyValues[0] : allValues[0]);
				}
				else
				{
					arFilter[strName] = arCanBuyValues[0];
				}
			}

			this.UpdateRow(i, arFilter[strName], arShowValues, arCanBuyValues);
		}
		this.selectedValues = arFilter;

		this.ChangeInfo();
	}
};

window.JCCatalogElement.prototype.RowLeft = function()
{
	var strTreeValue = '',
		index = -1,
		i,
		target = BX.proxy_context;
	if (!!target && target.hasAttribute('data-treevalue'))
	{
		strTreeValue = target.getAttribute('data-treevalue');
		for (i = 0; i < this.treeProps.length; i++)
		{
			if (this.treeProps[i].ID === strTreeValue)
			{
				index = i;
				break;
			}
		}
		if (-1 < index && this.treeRowShowSize < this.showCount[index])
		{
			if (0 > this.showStart[index])
			{
				this.showStart[index]++;
				BX.adjust(this.obTreeRows[index].LIST, { style: { marginLeft: this.showStart[index]*20+'%' }});
				//BX.adjust(this.obTreeRows[index].RIGHT, { style: this.treeEnableArrow });
			}

			/*if (0 <= this.showStart[index])
			{
				BX.adjust(this.obTreeRows[index].LEFT, { style: this.treeDisableArrow });
			}*/
		}
	}
};

window.JCCatalogElement.prototype.RowRight = function()
{
	var strTreeValue = '',
		index = -1,
		i,
		target = BX.proxy_context;
	if (!!target && target.hasAttribute('data-treevalue'))
	{
		strTreeValue = target.getAttribute('data-treevalue');
		for (i = 0; i < this.treeProps.length; i++)
		{
			if (this.treeProps[i].ID === strTreeValue)
			{
				index = i;
				break;
			}
		}
		if (-1 < index && this.treeRowShowSize < this.showCount[index])
		{
			if ((this.treeRowShowSize - this.showStart[index]) < this.showCount[index])
			{
				this.showStart[index]--;
				BX.adjust(this.obTreeRows[index].LIST, { style: { marginLeft: this.showStart[index]*20+'%' }});
				//BX.adjust(this.obTreeRows[index].LEFT, { style: this.treeEnableArrow });
			}

			/*if ((this.treeRowShowSize - this.showStart[index]) >= this.showCount[index])
			{
				BX.adjust(this.obTreeRows[index].RIGHT, { style: this.treeDisableArrow });
			}*/
		}
	}
};

window.JCCatalogElement.prototype.UpdateRow = function(intNumber, activeID, showID, canBuyID)
{
	var i = 0,
		showI = 0,
		value = '',
		countShow = 0,
		strNewLen = '',
		obData = {},
		obDataCont = {},
		RowItems = null,
		pictMode = false,
		extShowMode = false,
		isCurrent = false,
		selectIndex = 0,
		obLeft = this.treeEnableArrow,
		obRight = this.treeEnableArrow,
		currentShowStart = 0;

	if (-1 < intNumber && intNumber < this.obTreeRows.length)
	{
		propMode = this.treeProps[intNumber].DISPLAY_TYPE;
		RowItems = BX.findChildren(this.obTreeRows[intNumber].LIST, {tagName: this.skuVisualParams[propMode].TAG}, false);
		if (!!RowItems && 0 < RowItems.length)
		{
			selectMode = ('SELECT' === this.treeProps[intNumber].DISPLAY_TYPE);
			countShow = showID.length;
			obData = {
				style: {},
				props: {
					disabled: '',
					selected: '',
				},
			};
			obDataCont = {
				style: {},
			};

			for (i = 0; i < RowItems.length; i++){
				value = RowItems[i].getAttribute('data-onevalue');
				isCurrent = (value === activeID);

				if (BX.util.in_array(value, canBuyID)){
					obData.props.className = (isCurrent ? this.skuVisualParams[propMode].ACTIVE_CLASS : '');

				}else{
					obData.props.className = (isCurrent ? this.skuVisualParams[propMode].ACTIVE_CLASS+' '+this.skuVisualParams[propMode].HIDE_CLASS : this.skuVisualParams[propMode].HIDE_CLASS);
					// obData.props.className = (isCurrent ? this.skuVisualParams[propMode].ACTIVE_CLASS : '');
				}

				if(selectMode){
					obData.props.disabled = 'disabled';
					obData.props.selected = (isCurrent ? 'selected' : '');
				}else{
					obData.style.display = 'none';
				}

				if (BX.util.in_array(value, showID)){
					if(selectMode){
						obData.props.disabled = '';
					}else{
						obData.style.display = '';
					}
					if (isCurrent){
						selectIndex = showI;
					}
					if(value != 0)
						showI++;
				}
				BX.adjust(RowItems[i], obData);
			}

			if(!showI)
				obDataCont.style.display = 'none';
			else
				obDataCont.style.display = '';
			BX.adjust(this.obTreeRows[intNumber].CONT, obDataCont);

			if(selectMode){
				if($(this.obTreeRows[intNumber].LIST).parent().hasClass('ik_select'))
					$(this.obTreeRows[intNumber].LIST).ikSelect('reset');
			}

			this.showCount[intNumber] = countShow;
			this.showStart[intNumber] = currentShowStart;
		}
	}
};

window.JCCatalogElement.prototype.GetRowValues = function(arFilter, index)
{
	var arValues = [],
		i = 0,
		j = 0,
		boolSearch = false,
		boolOneSearch = true;

	if (0 === arFilter.length)
	{
		for (i = 0; i < this.offers.length; i++)
		{
			if (!BX.util.in_array(this.offers[i].TREE[index], arValues))
			{
				arValues[arValues.length] = this.offers[i].TREE[index];
			}
		}
		boolSearch = true;
	}
	else
	{
		for (i = 0; i < this.offers.length; i++)
		{
			boolOneSearch = true;
			for (j in arFilter)
			{
				if (arFilter[j] !== this.offers[i].TREE[j])
				{
					boolOneSearch = false;
					break;
				}
			}
			if (boolOneSearch)
			{
				if (!BX.util.in_array(this.offers[i].TREE[index], arValues))
				{
					arValues[arValues.length] = this.offers[i].TREE[index];
				}
				boolSearch = true;
			}
		}
	}
	return (boolSearch ? arValues : false);
};

window.JCCatalogElement.prototype.GetCanBuy = function(arFilter)
{
	var i = 0,
		j = 0,
		boolOneSearch = true,
		boolSearch = false;

	for (i = 0; i < this.offers.length; i++)
	{
		boolOneSearch = true;
		for (j in arFilter)
		{
			if (arFilter[j] !== this.offers[i].TREE[j])
			{
				boolOneSearch = false;
				break;
			}
		}
		if (boolOneSearch)
		{
			if (this.offers[i].CAN_BUY)
			{
				boolSearch = true;
				break;
			}
		}
	}
	return boolSearch;
};

window.JCCatalogElement.prototype.SetCurrent = function()
{
	var i = 0,
		j = 0,
		strName = '',
		arShowValues = false,
		arCanBuyValues = [],
		arFilter = {},
		tmpFilter = [],
		current = this.offers[this.offerNum].TREE;

	for (i = 0; i < this.treeProps.length; i++)
	{
		strName = 'PROP_'+this.treeProps[i].ID;
		arShowValues = this.GetRowValues(arFilter, strName);
		if (!arShowValues)
		{
			break;
		}
		if (BX.util.in_array(current[strName], arShowValues))
		{
			arFilter[strName] = current[strName];
		}
		else
		{
			arFilter[strName] = arShowValues[0];
			this.offerNum = 0;
		}
		if (this.config.showAbsent)
		{
			arCanBuyValues = [];
			tmpFilter = [];
			tmpFilter = BX.clone(arFilter, true);
			for (j = 0; j < arShowValues.length; j++)
			{
				tmpFilter[strName] = arShowValues[j];
				if (this.GetCanBuy(tmpFilter))
				{
					arCanBuyValues[arCanBuyValues.length] = arShowValues[j];
				}
			}
		}
		else
		{
			arCanBuyValues = arShowValues;
		}

		this.UpdateRow(i, arFilter[strName], arShowValues, arCanBuyValues);
	}

	this.selectedValues = arFilter;
	this.ChangeInfo();
};

window.JCCatalogElement.prototype.ChangeInfo = function()
{
	var index = -1,
		i = 0,
		j = 0,
		RowItems=null,
		boolOneSearch = true;

	for (i = 0; i < this.offers.length; i++)
	{
		boolOneSearch = true;
		for (j in this.selectedValues)
		{
			if (this.selectedValues[j] !== this.offers[i].TREE[j])
			{
				boolOneSearch = false;
				break;
			}
		}
		if (boolOneSearch)
		{
			index = i;
			break;
		}
	}

	if(this.treeProps){

		for(var i in this.treeProps)
		{
			if(this.treeProps[i].SHOW_MODE == 'PICT')
			{
				var cont = $('#'+this.visual.ID+'_prop_'+this.treeProps[i].ID+'_cont'),
					color = cont.find('li[data-treevalue="'+this.treeProps[i].ID+'_'+this.selectedValues['PROP_'+this.treeProps[i].ID]+'"] i').attr('title'),
					arColor = [];
				if(color){
					var separateIndex = color.indexOf(':');

					if(separateIndex !== -1){
						var titleProp = color.substring(0, separateIndex);
						var titleColor = color.substring(separateIndex + 1);

						if(titleColor.length > 0){
							cont.find('.bx_item_section_name>span').html(titleProp+':<span class="val">'+titleColor+'</span>');
						}
					}
				}

			}
		}
	}

	if (-1 < index)
	{
		for (i = 0; i < this.offers.length; i++)
		{

			if (this.config.showOfferGroup && this.offers[i].OFFER_GROUP)
			{
				if (i !== index)
				{
					if(!!BX(this.visual.OFFER_GROUP+this.offers[i].ID))
						BX.adjust(BX(this.visual.OFFER_GROUP+this.offers[i].ID), { style: {display: 'none'} });
				}
			}
			/*set slider*/
			/*if (!!this.sliders[i].ID)
			{
				if (i === index)
				{
					this.sliders[i].START = 0;
					if(this.sliders[i].CONT){

						RowItems = $(this.sliders[i].CONT).find("li");
						this.SliderImages=RowItems.length;
						if(this.SliderImages>1){
							BX.adjust(this.sliders[i].CONT, {style: { display: ''}});
						}else{
							BX.adjust(this.sliders[i].CONT, {style: { display: 'none'}});
						}
					}
					BX.adjust(this.sliders[i].CONT_M, {style: { display: ''}});
				}
				else
				{
					if(this.sliders[i].CONT)
						BX.adjust(this.sliders[i].CONT, {style: { display: 'none'}});
					BX.adjust(this.sliders[i].CONT_M, {style: { display: 'none'}});
				}
			}*/
		}

		if (this.config.showOfferGroup && this.offers[index].OFFER_GROUP)
		{
			if(!!BX(this.visual.OFFER_GROUP+this.offers[index].ID))
				BX.adjust(BX(this.visual.OFFER_GROUP+this.offers[index].ID), { style: {display: ''} });
		}
		if (0 < this.offers[index].SLIDER_COUNT)
		{
			this.SetMainPict(this.offers[index].ID, this.offers[index].SLIDER[0].ID);
		}
		else
		{
			this.SetMainPictFromItem(index);
		}
		this.SetAdditionalGallery(index);

		/*set slider images start*/
		this.SetSliderPict(this.offers[index], this.offers[index].SLIDER, this.config);
		/*set slider images end*/

		/*set mobile slider images start*/
		this.SetSliderPictMobile(this.offers[index], this.offers[index].SLIDER, this.config);
		/*set mobile slider images end*/

		if (this.config.showSkuProps && !!this.obSkuProps)
		{
			var html ='',
				display_type = this.offers[index].TYPE_PROP;
			if (!this.offers[index].DISPLAY_PROPERTIES || this.offers[index].DISPLAY_PROPERTIES.length === 0)
			{
				if(display_type == "TABLE")
					BX.adjust(this.obSkuProps, {style: {display: 'none'}, html: ''});
				else
					$(this.obSkuProps).find('.sku_block_prop').remove();
			}
			else
			{
				if(display_type != "TABLE")
					$(this.obSkuProps).find('.sku_block_prop').remove();

				for(var i in this.offers[index].DISPLAY_PROPERTIES)
				{
					var class_block = ((this.offers[index].DISPLAY_PROPERTIES[i].HINT && this.offers[index].DISPLAY_PROPERTIES[i].SHOW_HINTS == "Y") ? ' whint1' : ''),
						hint_block = ((this.offers[index].DISPLAY_PROPERTIES[i].HINT && this.offers[index].DISPLAY_PROPERTIES[i].SHOW_HINTS=="Y") ? '<div class="hint"><span class="icon"><i>?</i></span><div class="tooltip">' + this.offers[index].DISPLAY_PROPERTIES[i].HINT + '</div></div>' : '');

					if(display_type == "TABLE")
						html += '<tr><td class="char_name"><span class="'+class_block+'">'+hint_block+'<span>'+this.offers[index].DISPLAY_PROPERTIES[i].NAME+'</span></span></td><td class="char_value"><span>'+this.offers[index].DISPLAY_PROPERTIES[i].VALUE+'</span></td></tr>';
					else
					{
						html = '<div class="char sku_block_prop"><div class="char_name"><span class="'+class_block+'">'+hint_block+'<span>'+this.offers[index].DISPLAY_PROPERTIES[i].NAME+'</span></span></div><div class="char_value"><span>'+this.offers[index].DISPLAY_PROPERTIES[i].VALUE+'</span></div></div>';
						$(this.obSkuProps).append(html);
					}
				}

				if(display_type == "TABLE")
					BX.adjust(this.obSkuProps, {style: {display: ''}, html: html});
			}
		}
		if (this.config.showSkuProps && !!this.obSkuArticleProps)
		{
			if ('DISPLAY_PROPERTIES_CODE' in this.offers[index])
			{
				if ('ARTICLE' in this.offers[index].DISPLAY_PROPERTIES_CODE)
				{
					if(this.offers[index].DISPLAY_PROPERTIES_CODE.ARTICLE.VALUE)
						BX.adjust(this.obSkuArticleProps, {style: {display: ''}, html: this.offers[index].DISPLAY_PROPERTIES_CODE.ARTICLE.VALUE_FORMAT});

				}
				else if(this.offers[index].SHOW_ARTICLE_SKU == 'Y' && this.offers[index].ARTICLE_SKU)
					BX.adjust(this.obSkuArticleProps, {style: {display: ''}, html: this.offers[index].ARTICLE_SKU});
				else
					BX.adjust(this.obSkuArticleProps, {style: {display: 'none'}, html: ''});
			}
			else if(this.offers[index].SHOW_ARTICLE_SKU == 'Y' && this.offers[index].ARTICLE_SKU)
			{
				BX.adjust(this.obSkuArticleProps, {style: {display: ''}, html: this.offers[index].ARTICLE_SKU});
			}
			else
			{
				BX.adjust(this.obSkuArticleProps, {style: {display: 'none'}, html: ''});
			}
		}

		setLocationSKU(this.offers[index].ID, this.config.offerID);

		$(this.obBasketActions).closest('.counter_wrapp').addClass('hidden_block');

		this.offerNum = index;
		this.QuantitySet(this.offerNum);
		this.setStoreBlock(this.offers[index].ID);
		this.setQuantityStore(this.offers[index].MAX_QUANTITY, this.offers[index].AVAILIABLE.TEXT);

		this.incViewedCounter();
		BX.onCustomEvent('onCatalogStoreProductChange', [this.offers[this.offerNum].ID]);
		$(this.obPict).parent().data('id', this.offers[index].ID);

		var arPriceItem = this.offers[index].PRICE;
		if(this.offers[index].ITEM_PRICE_MODE == 'Q' && this.offers[index].ITEM_PRICES && this.offers[index].USE_PRICE_COUNT)
		{
			if(this.offers[index].USE_PRICE_COUNT && this.offers[index].PRICE_MATRIX)
				this.checkPriceRange(this.offers[index].CONFIG.MIN_QUANTITY_BUY);
			arPriceItem = this.currentPrices[this.currentPriceSelected];

			arPriceItem.DISCOUNT_VALUE = arPriceItem.PRICE;
			arPriceItem.PRINT_DISCOUNT_VALUE = getCurrentPrice(arPriceItem.PRICE, arPriceItem.CURRENCY, arPriceItem.PRINT_PRICE);
			arPriceItem.VALUE = arPriceItem.BASE_PRICE;
			arPriceItem.PRINT_VALUE = getCurrentPrice(arPriceItem.BASE_PRICE, arPriceItem.CURRENCY, arPriceItem.PRINT_BASE_PRICE);
		}

		setViewedProduct(this.offers[index].ID, {
			'PRODUCT_ID': this.offers[index].PRODUCT_ID,
			'IBLOCK_ID': this.offers[index].IBLOCK_ID,
			'NAME': this.offers[index].NAME,
			'DETAIL_PAGE_URL': this.offers[index].URL,
			//'PICTURE_ID': this.offers[index].PREVIEW_PICTURE ? this.offers[index].PREVIEW_PICTURE.ID : (this.offers[index].SLIDER_COUNT ? this.offers[index].SLIDER[0].ID : false),
			'PICTURE_ID': this.offers[index].PREVIEW_PICTURE ? this.offers[index].PREVIEW_PICTURE.ID : (this.offers[index].PARENT_PICTURE ? this.offers[index].PARENT_PICTURE.ID : (this.offers[index].SLIDER_COUNT ? this.offers[index].SLIDER[0].ID : false)),
			'CATALOG_MEASURE_NAME': this.offers[index].MEASURE,
			'MIN_PRICE': arPriceItem,
			'CAN_BUY': this.offers[index].CAN_BUY ? 'Y' : 'N',
			'IS_OFFER': 'Y',
			'WITH_OFFERS': 'N'
		});

		var obj=this.offers[index],
			th=$(this.obProduct),
			_th = this;

		if(typeof arBasketAspro !=="undefined"){
			this.setActualDataBlock(th, obj);
		}else{
			if(typeof window.frameCacheVars !== "undefined"){
				BX.addCustomEvent("onFrameDataReceived", function(){
					_th.setActualDataBlock(th, obj);
				});
			}
		}

		/*quantity discount start*/

		if($(this.obProduct).find('.quantity_block .values').length)
			$(this.obProduct).find('.quantity_block .values .item span.value').text(this.offers[index].MAX_QUANTITY).css({'opacity':'1'});

		if(this.offers[index].SHOW_DISCOUNT_TIME_EACH_SKU == 'Y')
			initCountdownTime($(this.obProduct), this.offers[index].DISCOUNT_ACTIVE);

		/*quantity discount end*/

		if(arNextOptions['THEME']['CHANGE_TITLE_ITEM'] == 'Y')
		{
			$('h1').html(this.offers[index].NAME);
			document.title = $('h1').html()+''+this.offers[index].POSTFIX;
			ItemObj.TITLE = this.offers[index].NAME;
			ItemObj.WINDOW_TITLE = this.offers[index].NAME+''+this.offers[index].POSTFIX;
		}

		$('.catalog_detail input[data-sid="PRODUCT_NAME"]').attr('value', $('h1').text());
	}
};

window.JCCatalogElement.prototype.checkPriceRange = function(quantity)
{
	if (typeof quantity === 'undefined'|| this.currentPriceMode != 'Q')
		return;

	var range, found = false;
	for (var i in this.currentQuantityRanges)
	{
		if (this.currentQuantityRanges.hasOwnProperty(i))
		{
			range = this.currentQuantityRanges[i];

			if (
				parseInt(quantity) >= parseInt(range.SORT_FROM)
				&& (
					range.SORT_TO == 'INF'
					|| parseInt(quantity) <= parseInt(range.SORT_TO)
				)
			)
			{
				found = true;
				this.currentQuantityRangeSelected = range.HASH;
				break;
			}
		}
	}

	if (!found && (range = this.getMinPriceRange()))
	{
		this.currentQuantityRangeSelected = range.HASH;
	}

	for (var k in this.currentPrices)
	{
		if (this.currentPrices.hasOwnProperty(k))
		{
			if (this.currentPrices[k].QUANTITY_HASH == this.currentQuantityRangeSelected)
			{
				this.currentPriceSelected = k;
				break;
			}
		}
	}
};

window.JCCatalogElement.prototype.getMinPriceRange = function()
{
	var range;

	for (var i in this.currentQuantityRanges)
	{
		if (this.currentQuantityRanges.hasOwnProperty(i))
		{
			if (
				!range
				|| parseInt(this.currentQuantityRanges[i].SORT_FROM) < parseInt(range.SORT_FROM)
			)
			{
				range = this.currentQuantityRanges[i];
			}
		}
	}

	return range;
}

/*set blocks start*/
window.JCCatalogElement.prototype.setActualDataBlock = function(th, obj)
{
	/*like block start*/
	this.setLikeBlock(th, '.like_icons .wish_item', obj, 'DELAY');
	this.setLikeBlock(th, '.like_icons .compare_item',obj, 'COMPARE');
	/*like block end*/

	/*buy block start*/
	this.setBuyBlock(th, obj);
	/*buy block end*/
}
/*set blocks end*/

/*set slider offers*/
window.JCCatalogElement.prototype.SetSliderPict = function(obj, slider, config)
{
	var container=$('.wrapp_thumbs'),
		slideHtml='';
		countPhoto=obj.SLIDER_COUNT;
		container.find('.thumbs').css({
			'max-width':Math.ceil(((countPhoto <= 4 ? countPhoto : 4) * 64) - 10)
		});

		slideHtml='<ul class="slides_block">';
		for(var i in slider){
			if(typeof(slider[i]) == 'object'){
				slideHtml+='<li data-big="'+slider[i].BIG.src+'">'+
				'<span class="cnt"><img border="0" src="'+slider[i].THUMB.src+'" alt="'+slider[i].ALT+'" title="'+slider[i].TITLE+'" /></span>'+
				'</li>';
			}
		}
		slideHtml+='</ul>';


		container.find('.thumbs').html(slideHtml);
	if(countPhoto>1){
		container.show();

		if(container.find('.thumbs_navigation').length){
			container.find('.thumbs_navigation').remove();
		}
		container.find('.thumbs').append('<span class="thumbs_navigation custom_flex"></span>');

		/* init flexslider start */
		container.find('.thumbs').removeData("flexslider");
		container.find('.thumbs').flexslider({
			animation: "slide",
			selector: ".slides_block > li",
			slideshow: false,
			animationSpeed: 600,
			directionNav: true,
			controlNav: false,
			pauseOnHover: true,
			itemWidth: 54,
			itemMargin: 10,
			animationLoop: true,
			controlsContainer: ".thumbs_navigation",
		});
		/* init flexslider end */
		container.find('.thumbs .slides_block li').first().addClass('current');

		var pict=$(this.obPict);
		container.find('.thumbs').delegate('li:not(.current):not(.flex-nav-next):not(.flex-nav-prev)', 'click', function(e){
			var srcSmall='',
				srcBig='',
				width='',
				height=''
				index=$(this).index();
			if(typeof slider[index] !== 'undefined')
			{
				if('SMALL' in slider[index]){
					srcSmall = slider[index].SMALL.src;
				}else if ('SRC' in slider[index]) {
					srcSmall = slider[index].SRC
				};
				if('BIG' in slider[index]){
					srcBig = slider[index].BIG.src;
				}
				if('WIDTH' in slider[index]){
					width = slider[index].WIDTH;
				}
				if('HEIGHT' in slider[index]){
					height = slider[index].HEIGHT;
				}
			}

			$(this).addClass('current').siblings().removeClass('current').parents('.item_slider').find('.slides li').fadeOut(333);
			$(this).parents('.item_slider').find('.slides li').eq(index).addClass('current').stop().fadeIn(333);


			if(srcSmall){
				BX.adjust(pict[0], { props: { src: srcSmall } });
			}
			pict.attr('data-large','');

			if(srcBig){
				if(config.mainPictureMode === 'POPUP'){
					pict.parent().attr('href',srcBig);
				}
				if(config.mainPictureMode === 'MAGNIFIER'){
					pict.attr('data-large',srcBig);
					pict.attr('xoriginal',srcBig);
				}
				pict.parent().attr('title',slider[index].TITLE);
				pict.parent().attr('alt',slider[index].ALT);
				pict.attr('title',slider[index].TITLE);
				pict.attr('alt',slider[index].ALT);
			}
		});

	}else{
		container.hide();
	}
}

/*set mobile slider offers*/
window.JCCatalogElement.prototype.SetSliderPictMobile = function(obj, slider)
{
	var container=$('.item_slider.flex'),
		slideHtml='';
		countPhoto=obj.SLIDER_COUNT;

	slideHtml='<ul class="slides">';
	if(!slider.length){
		slideHtml+='<li data-value="">'+
			'<span data-fancybox-group="item_slider" class="fancy" title="'+obj.NAME+'"><img border="0" src="'+obj.NO_PHOTO.SRC+'" alt="'+obj.NAME+'" title="'+obj.NAME+'" /></span>'+
			'</li>';
	}else{
		for(var i in slider){
			if(typeof(slider[i]) == 'object'){
				slideHtml+='<li data-value="'+obj.ID+'_'+slider[i].ID+'">'+
				'<a href="'+slider[i].BIG.src+'" data-fancybox-group="item_slider" class="fancy popup_link" title="'+slider[i].TITLE+'"><img border="0" src="'+slider[i].SMALL.src+'" alt="'+slider[i].ALT+'" title="'+slider[i].TITLE+'" /><div class="zoom"></div></a>'+
				'</li>';
			}
		}
	}
	slideHtml+='</ul>';

	container.html(slideHtml);

	/* init flexslider start */
	container.removeData("flexslider");
	container.flexslider({
		animation: "slide",
		slideshow: false,
		slideshowSpeed: 10000,
		animationSpeed: 600,
		directionNav: false,
		pauseOnHover: true,
		animationLoop: false,
	});
	/* init flexslider end */
}

/*set compare/wish*/
window.JCCatalogElement.prototype.setLikeBlock = function(th, className, obj, type)
{
	var block=th;
	if(type=="DELAY"){
		if(obj.CAN_BUY){
			block.find(className).css('display','block');
		}else{
			block.find(className).hide();
		}
	}
	block.find(className).attr('data-item', obj.ID);

	if(arBasketAspro[type]){
		block.find(className).removeClass('added');
		block.find(className).find('.value').css('display','block');
		block.find(className).find('.value.added').hide();

		if(arBasketAspro[type][obj.ID]!==undefined){
			block.find(className).addClass('added');
			block.find(className).find('.value').hide();
			block.find(className).find('.value.added').css('display','block');
		}
	}
}

/*set buy*/
window.JCCatalogElement.prototype.setBuyBlock = function(th, obj)
{
	var buyBlock=th.find('.offer_buy_block'),
		input_value = obj.CONFIG.MIN_QUANTITY_BUY;

	if(buyBlock.find('.counter_wrapp .counter_block').length){
		buyBlock.find('.counter_wrapp .counter_block').attr('data-item', obj.ID);
	}

	if(this.offers[this.offerNum].offer_set_quantity)
		input_value = this.offers[this.offerNum].offer_set_quantity;

	var $calculate = buyBlock.closest('.catalog_detail').find('.calculate-delivery');
	if($calculate.length){
		$calculate.each(function(){
			var $calculateSpan = $(this).find('span[data-event=jqm]').first();

			if($calculateSpan.length){
				var $clone = $calculateSpan.clone();
				$clone.attr('data-param-product_id', obj.ID).attr('data-param-quantity', input_value).removeClass('clicked');
				$clone.insertAfter($calculateSpan).on('click', function(){
					if(!jQuery.browser.mobile){
						$(this).parent().addClass('loadings');
					}
				});
				$calculateSpan.remove();
			}

			if($(this).hasClass('with_preview')){
				$(this).removeClass('inited');

				if(this.timerInitCalculateDelivery){
					clearTimeout(this.timerInitCalculateDelivery);
				}

				var that = this;
				this.timerInitCalculateDelivery = setTimeout(function(){
					initCalculatePreview();
					that.timerInitCalculateDelivery = false;
				}, 1000);
			}
		});

		if(
			this.offers[this.offerNum].ACTION === 'ADD' &&
			this.offers[this.offerNum].CAN_BUY === 'Y'
		){
			$calculate.show();
		}
		else{
			$calculate.hide();
		}
	}

	if(th.find('.cheaper_form').length)
	{
		var cheaper_form = th.find('.cheaper_form span');
		cheaper_form.data('autoload-product_name', obj.NAME);
		cheaper_form.data('autoload-product_id', obj.ID);
	}

	if((obj.CONFIG.OPTIONS.USE_PRODUCT_QUANTITY_DETAIL && obj.CONFIG.ACTION == "ADD") && obj.CAN_BUY){
		var max=(obj.CONFIG.MAX_QUANTITY_BUY>0 ? "data-max='"+obj.CONFIG.MAX_QUANTITY_BUY+"'" : ""),
			counterHtml='<span class="minus">-</span>'+
				'<input type="text" class="text" name="'+obj.PRODUCT_QUANTITY_VARIABLE+'" value="'+input_value+'" />'+
				'<span class="plus" '+max+'>+</span>';
		if(arBasketAspro["BASKET"] && arBasketAspro["BASKET"][obj.ID]!==undefined){
			if(buyBlock.find('.counter_wrapp .counter_block').length){
				buyBlock.find('.counter_wrapp .counter_block').hide();
			}else{
				buyBlock.find('.counter_wrapp').prepend('<div class="counter_block big_basket" data-item="'+obj.ID+'"></div>');
				buyBlock.find('.counter_wrapp .counter_block').html(counterHtml).hide();
			}
		}else{
			if(buyBlock.find('.counter_wrapp .counter_block').length){
				buyBlock.find('.counter_wrapp .counter_block').html(counterHtml).show();
			}else{
				buyBlock.find('.counter_wrapp').prepend('<div class="counter_block big_basket" data-item="'+obj.ID+'"></div>');
				buyBlock.find('.counter_wrapp .counter_block').html(counterHtml);
			}
		}
	}else{
		if(buyBlock.find('.counter_wrapp .counter_block').length){
			buyBlock.find('.counter_wrapp .counter_block').hide();
		}
	}

	var className=((obj.CONFIG.ACTION == "ORDER") || !obj.CAN_BUY || !obj.CONFIG.OPTIONS.USE_PRODUCT_QUANTITY_DETAIL || (obj.CONFIG.ACTION == "SUBSCRIBE" && obj.CATALOG_SUBSCRIBE == "Y") ? "wide" : "" ),
		buyBlockBtn=$('<div class="button_block"></div>');

	if(buyBlock.find('.counter_wrapp').find('.button_block').length){
		if(arBasketAspro["BASKET"] && arBasketAspro["BASKET"][obj.ID]!==undefined){
			buyBlock.find('.counter_wrapp').find('.button_block').addClass('wide').html(obj.HTML);
			markProductAddBasket(obj.ID);
		}else{
			if(className){
				buyBlock.find('.counter_wrapp').find('.button_block').addClass('wide').html(obj.HTML);
				if(typeof arBasketAspro !=="undefined"){
					if(arBasketAspro["SUBSCRIBE"] && arBasketAspro["SUBSCRIBE"][obj.ID]!==undefined){
						markProductSubscribe(obj.ID);
					}
				}
			}else{
				buyBlock.find('.counter_wrapp').find('.button_block').removeClass('wide').html(obj.HTML);
			}
		}
	}else{
		buyBlock.find('.counter_wrapp').append('<div class="button_block '+className+'">'+obj.HTML+'</div>');
		if(arBasketAspro["BASKET"] && arBasketAspro["BASKET"][obj.ID]!==undefined)
			markProductAddBasket(obj.ID);
		if(arBasketAspro["SUBSCRIBE"] && arBasketAspro["SUBSCRIBE"][obj.ID]!==undefined)
			markProductSubscribe(obj.ID);
	}

	if(obj.CONFIG.ACTION !== "NOTHING"){
		if(obj.CONFIG.ACTION == "ADD" && obj.CAN_BUY && obj.SHOW_ONE_CLICK_BUY!="N"){
			var ocb='<span class="transparent btn-lg type_block btn btn-default white one_click transition_bg" data-offers="Y" data-item="'+obj.ID+'" data-iblockID="'+obj.IBLOCK_ID+'" data-quantity="'+obj.CONFIG.MIN_QUANTITY_BUY+'" data-props="'+obj.OFFER_PROPS+'" onclick="oneClickBuy('+obj.ID+', '+obj.IBLOCK_ID+', this)">'+
				'<span>'+obj.ONE_CLICK_BUY+'</span>'+
				'</span>';
			if(buyBlock.find('.wrapp_one_click').length){
				buyBlock.find('.wrapp_one_click').html(ocb);
			}else{
				buyBlock.append('<div class="wrapp_one_click">'+ocb+'</div>');
			}
		}else{
			if(buyBlock.find('.wrapp_one_click').length){
				buyBlock.find('.wrapp_one_click').remove();
			}
		}
	}else{
		if(buyBlock.find('.wrapp_one_click').length){
			buyBlock.find('.wrapp_one_click').remove();
		}
	}

	buyBlock.fadeIn();

	buyBlock.find('.counter_wrapp .counter_block input').data('product', 'ob'+this.obProduct.id);
	this.setPriceAction('', 'Y');

	if(typeof obNextPredictions === 'object'){
		obNextPredictions.showAll();
	}
}

/*set store block*/
window.JCCatalogElement.prototype.setStoreBlock = function(id)
{
	if(typeof setElementStore === 'function'){
		setElementStore('', id);
	}
	else{
		// this func is not exists yet, wait onFrameDataReceived
		if(typeof window.frameCacheVars !== "undefined"){
			BX.addCustomEvent("onFrameDataReceived", function (json){
				if(typeof setElementStore === 'function'){
					setElementStore('', id);
				}
			});
		}
	}
}

/*set store quantity*/
window.JCCatalogElement.prototype.setQuantityStore = function(quantity, text)
{
	if(parseFloat(quantity)>0){
		$(this.storeQuanity).find('.icon').removeClass('order').addClass('stock');
	}else{
		$(this.storeQuanity).find('.icon').removeClass('stock').addClass('order');
	}
	$(this.storeQuanity).find('.icon + span').html(text);
	if(!$(".stores_tab").length){
		$('.item-stock .store_view').removeClass('store_view');
	}
}

/*get compare sku*/
window.JCCatalogElement.prototype.CompareCountResult = function(result)
{
	if(result.COMPARE_COUNT){
		for(var i in result.ITEMS){
			if(result.ITEMS[i]==this.offers[this.offerNum].ID){
				this.offers[this.offerNum].COMPARE_ACTIVE=true;
				break;
			}else{
				this.offers[this.offerNum].COMPARE_ACTIVE=false;
			}
		}
		if(this.offers[this.offerNum].COMPARE_ACTIVE){
			$(this.obCompare).addClass('added');
			$(this.obCompare).find('.value:not(.added)').hide();
			$(this.obCompare).find('.value.added').css('display','block');
		}else{
			$(this.obCompare).removeClass('added');
			$(this.obCompare).find('.value.added').hide();
			$(this.obCompare).find('.value:not(.added)').css('display','block');
		}
	}
}

/*get item info*/
window.JCCatalogElement.prototype.ItemInfoResult = function(result)
{
	if(result.HTML){
		$(this.obBasketActions).html(result.HTML);
		$(this.obBasketActions).show();
		this.obAddToBasketBtn = BX(this.visual.BUY_ID);
		this.obBasketBtn = BX(this.visual.BASKET_LINK);
		this.obSubscribeBtn = BX(this.visual.SUBSCRIBE_ID);
		this.obSubscribedBtn = BX(this.visual.SUBSCRIBED_ID);
		BX.bind(this.obAddToBasketBtn, 'click', BX.delegate(this.Add2Basket, this));
		$(this.obBasketActions).removeClass('wide');
		this.ajax_type_item=result.BUYMISSINGGOODS;
		if(result.BUYMISSINGGOODS!="ADD" && !this.canBuy){
			$(this.obBasketActions).addClass('wide');
		}else{
			$(this.obQuantity).css('display','');
		}
		if(result.ONE_CLICK_HTML){
			$('.wrapp_one_click').html(result.ONE_CLICK_HTML);
		}

	}
	//if(this.canBuy){
		basketParams = {
			ajax_action: 'Y'
		};
		BX.ajax.loadJSON(
			arNextOptions['SITE_DIR']+'ajax/get_basket_count.php',
			basketParams,
			BX.delegate(this.BasketCountResult, this)
		);
	//}
}

/*get basket items*/
window.JCCatalogElement.prototype.BasketCountResult = function(result)
{
	//if(result.TOTAL_COUNT){
		for(var i in result.ITEMS){
			if(result.ITEMS[i].PRODUCT_ID==this.offers[this.offerNum].ID){
				this.offers[this.offerNum].BASKET_ACTIVE=true;
				break;
			}else{
				this.offers[this.offerNum].BASKET_ACTIVE=false;
			}
		}
		for(var i in result.SUBSCRIBE_ITEMS){
			if(result.SUBSCRIBE_ITEMS[i].PRODUCT_ID==this.offers[this.offerNum].ID){
				this.offers[this.offerNum].SUBSCRIBE_ACTIVE=true;
				break;
			}else{
				this.offers[this.offerNum].SUBSCRIBE_ACTIVE=false;
			}
		}

		this.BasketStateRefresh();
	//}
}

window.JCCatalogElement.prototype.BasketStateRefresh = function(buy_basket)
{
	if(this.offers[this.offerNum].SUBSCRIBE_ACTIVE){
		$(this.obBasketActions).addClass('wide');
		$(this.obSubscribeBtn).hide();
		$(this.obSubscribedBtn).show();
	}else{
		$(this.obBasketActions).addClass('wide');
		$(this.obSubscribedBtn).hide();
		$(this.obSubscribeBtn).show();
	}

	if(this.offers[this.offerNum].BASKET_ACTIVE){
		$(this.obAddToBasketBtn).hide();
		$(this.obQuantity).closest('.counter_wrapp').find('.counter_block').hide();
		$(this.obBasketBtn).show();
		$(this.obBasketActions).addClass('wide');
	}else{
		$(this.obBasketActions).removeClass('wide');
		$(this.obBasketBtn).hide();
		if(this.ajax_type_item=="ADD" || this.canBuy)
			$(this.obQuantity).closest('.counter_wrapp').find('.counter_block').show();
		$(this.obAddToBasketBtn).show();
	}
	if(!this.canBuy){
		$(this.obBasketActions).addClass('wide');
	}
	if(this.canBuy){
		$('.one_click').removeClass('hidden_block').css('opacity', 1);
	}
	BX.style(this.obBasketActions, 'opacity', '1');
	$(this.obBasketActions).closest('.counter_wrapp').removeClass('hidden_block').css('opacity',1);

	if(buy_basket!== 'undefined' && buy_basket=="Y"){
		if($("#basket_line .basket_fly").length && $(window).outerWidth()>768)
		{
			// preAnimateBasketFly($("#basket_line .basket_fly"), 200, 333);
			basketFly('open');
		}
		else if($("#basket_line .cart").length)
		{
			if($("#basket_line .cart").is(".empty_cart"))
			{
				$("#basket_line .cart").removeClass("empty_cart").find(".cart_wrapp a.basket_link").removeAttr("href").addClass("cart-call");
				touchBasket('.cart:not(.empty_cart) .basket_block .link');
			}
			reloadTopBasket('add', $('#basket_line'), 200, 2000, 'Y');
			/*if($(window).outerWidth() > 520){
				//if(arNextOptions['THEME']['SHOW_BASKET_ONADDTOCART'] !== 'N'){
					preAnimateBasketPopup('', $('.card_popup_frame'), 0, 200);
				//}
			};*/
		}
		animateBasketLine(200);
	}
}

window.JCCatalogElement.prototype.setPriceAction = function(change, sku)
{
	var measure = this.offers[this.offerNum].MEASURE && this.offers[this.offerNum].SHOW_MEASURE=="Y" ? this.offers[this.offerNum].MEASURE : '';
	var product = $(this.obProduct),
		check_quantity = '',
		is_sku = (typeof sku !== 'undefined' && sku == 'Y');

	this.offers[this.offerNum].offer_set_quantity = this.offers[this.offerNum].CONFIG.MIN_QUANTITY_BUY;
	if($(product).find('input[name=quantity]').length)
		this.offers[this.offerNum].offer_set_quantity = $(product).find('input[name=quantity]').val();

	if($(product).find('.price.discount').length)
		$(product).find('.price.discount').html('');
	if($(product).find('.sale_block:not(.matrix)').length)
		$(product).find('.sale_block:not(.matrix)').html('');

	if(this.offers[this.offerNum].USE_PRICE_COUNT && this.offers[this.offerNum].PRICE_MATRIX)
	{
		this.checkPriceRange(this.offers[this.offerNum].offer_set_quantity);
		this.setPriceMatrix(this.offers[this.offerNum].PRICE_MATRIX);
	}
	else
	{
		if('PRICES' in this.offers[this.offerNum])
			this.setPrice(this.offers[this.offerNum].PRICES, measure);
	}
	if(arNextOptions['THEME']['SHOW_TOTAL_SUMM'] == 'Y')
	{
		if(this.offers[this.offerNum].check_quantity)
			check_quantity = 'Y';
		else
		{
			var check_quantity = ((typeof change !== 'undefined' && change == 'Y') ? change : '');
			if(check_quantity)
				this.offers[this.offerNum].check_quantity = true;
		}
		if(typeof this.currentPrices[this.currentPriceSelected] !== 'undefined')
		{
			if(arNextOptions["THEME"]["SHOW_TOTAL_SUMM_TYPE"] == "ALWAYS")
				check_quantity = is_sku = '';

			setPriceItem(product, this.offers[this.offerNum].offer_set_quantity, this.currentPrices[this.currentPriceSelected].PRICE, check_quantity, is_sku);
		}
	}
}

window.JCCatalogElement.prototype.setPriceMatrix = function(sPriceMatrix)
{
	var prices = '';
	if (!!this.obPrice.price)
	{
		var measure = this.offers[this.offerNum].MEASURE && this.offers[this.offerNum].SHOW_MEASURE=="Y" ? this.offers[this.offerNum].MEASURE : '',
			strPrice = '';
		strPrice = getCurrentPrice(this.currentPrices[this.currentPriceSelected].PRICE, this.currentPrices[this.currentPriceSelected].CURRENCY, this.currentPrices[this.currentPriceSelected].PRINT_PRICE);
		if(measure)
			strPrice += '<span class="price_measure">/'+measure+'</span>';
		$(this.obProduct).find('.not_matrix').hide();
		$(this.obProduct).find('.with_matrix .price_value_block').html(strPrice);

		if (this.config.showOldPrice)
		{
			if(parseFloat(this.currentPrices[this.currentPriceSelected].BASE_PRICE) > parseFloat(this.currentPrices[this.currentPriceSelected].PRICE))
			{
				$(this.obProduct).find('.with_matrix .discount').html(getCurrentPrice(this.currentPrices[this.currentPriceSelected].BASE_PRICE, this.currentPrices[this.currentPriceSelected].CURRENCY, this.currentPrices[this.currentPriceSelected].PRINT_BASE_PRICE));
				$(this.obProduct).find('.with_matrix .discount').css('display', 'inline-block');
			}
			else
			{
				$(this.obProduct).find('.with_matrix .discount').html('');
				$(this.obProduct).find('.with_matrix .discount').css('display', 'none');
			}
		}
		else
		{
			$(this.obProduct).find('.with_matrix .discount').html('');
			$(this.obProduct).find('.with_matrix .discount').css('display', 'none');
		}

		if(this.currentPrices[this.currentPriceSelected].PERCENT > 0)
		{
			if(this.config.showPercentNumber)
			{
				if(this.currentPrices[this.currentPriceSelected].PERCENT > 0 && this.currentPrices[this.currentPriceSelected].PERCENT < 100)
				{
					if(!$(this.obProduct).find('.with_matrix .sale_block .sale_wrapper .value').length)
						$('<div class="value"></div>').insertBefore($(this.obProduct).find('.with_matrix .sale_block .sale_wrapper .text'));

					$(this.obProduct).find('.with_matrix .sale_block .sale_wrapper .value').html('-<span>'+this.currentPrices[this.currentPriceSelected].PERCENT+'</span>%');
				}
				else
				{
					if($(this.obProduct).find('.with_matrix .sale_block .sale_wrapper .value').length)
						$(this.obProduct).find('.with_matrix .sale_block .sale_wrapper .value').remove();
				}
			}
		}

		$(this.obProduct).find('.with_matrix .sale_block .text .values_wrapper').html(getCurrentPrice(this.currentPrices[this.currentPriceSelected].DISCOUNT, this.currentPrices[this.currentPriceSelected].CURRENCY, this.currentPrices[this.currentPriceSelected].PRINT_DISCOUNT));
		if(this.config.showPercent && parseFloat(this.currentPrices[this.currentPriceSelected].DISCOUNT)>0)
			$(this.obProduct).find('.with_matrix .sale_block').show();
		else
			$(this.obProduct).find('.with_matrix .sale_block').hide();
		$(this.obProduct).find('.with_matrix').show();
		BX.adjust(this.obPrice.price, {html: sPriceMatrix});

		var eventdata = {product: $(this.obProduct), measure: measure, config: this.config, offer: this.offers[this.offerNum], obPrice: this.currentPrices[this.currentPriceSelected]};
		BX.onCustomEvent('onAsproSkuSetPriceMatrix', [eventdata])
	}
}

window.JCCatalogElement.prototype.setPrice = function(obPrices, measure)
{
	var prices = '';
	if (!!this.obPrice.price)
	{
		var measure = this.offers[this.offerNum].MEASURE && this.offers[this.offerNum].SHOW_MEASURE=="Y" ? this.offers[this.offerNum].MEASURE : '',
			product = $(this.obProduct),
			obPrices = this.offers[this.offerNum].PRICES;
		if(typeof(obPrices) == 'object')
		{
			var strPrice = '',
				count = Object.keys(obPrices).length,
				arStikePrices = [];

			if(arNextOptions['THEME']['DISCOUNT_PRICE'])
			{
				arStikePrices = arNextOptions['THEME']['DISCOUNT_PRICE'].split(',');
			}

			strPrice = '<div class="offers_price_wrapper">';
			$(this.obProduct).find('.with_matrix').hide();
			$(this.obProduct).find('.not_matrix').show();
			for(var j in obPrices)
			{
				if(obPrices[j] && obPrices[j].VALUE > 0)
				{
					if('GROUP_NAME' in obPrices[j])
					{
						if(count > 1)
						{
							strPrice += '<div class="offers_price_title">';
							strPrice += obPrices[j].GROUP_NAME;
							strPrice += '</div>';
						}
					}
					strPrice += '<div class="offers_price'+(arStikePrices ? (BX.util.in_array(obPrices[j].PRICE_ID, arStikePrices) ? ' strike_block' : '') : '')+'">';
						strPrice += '<span class="values_wrapper">'+getCurrentPrice(obPrices[j].DISCOUNT_VALUE, obPrices[j].CURRENCY, obPrices[j].PRINT_DISCOUNT_VALUE)+'</span>';
						if(measure)
							strPrice += '<span class="price_measure">/'+measure+'</span>';

					strPrice += '</div>';
					if (obPrices[j].DISCOUNT_VALUE !== obPrices[j].VALUE)
					{
						if(this.config.showOldPrice)
						{
							strPrice += '<div class="offers_price_old">';
								strPrice += '<span class="values_wrapper">'+getCurrentPrice(obPrices[j].VALUE, obPrices[j].CURRENCY, obPrices[j].PRINT_VALUE)+'</span>';
							strPrice += '</div>';
						}
						if(this.config.showPercent)
						{
							if(!this.config.showPercentNumber || (this.config.showPercentNumber && (obPrices[j].DISCOUNT_DIFF_PERCENT <= 0 && obPrices[j].DISCOUNT_DIFF_PERCENT >= 100)))
							{
								strPrice += '<div class="sale_block matrix"><div class="sale_wrapper">';
									strPrice += '<span class="title">'+BX.message('ITEM_ECONOMY')+'</span>';
									strPrice += '<div class="text">';
										strPrice += '<span class="values_wrapper">'+getCurrentPrice(obPrices[j].DISCOUNT_DIFF, obPrices[j].CURRENCY, obPrices[j].PRINT_DISCOUNT_DIFF)+'</span>';
									strPrice += '</div>';
								strPrice += '<div class="clearfix"></div></div></div>';
							}
							else
							{
								strPrice += '<div class="sale_block matrix"><div class="sale_wrapper">';
									strPrice += '<div class="value">-<span>'+obPrices[j].DISCOUNT_DIFF_PERCENT+'</span>%</div>';
									strPrice += '<div class="text">';
										strPrice += '<span class="title">'+BX.message('ITEM_ECONOMY')+'</span> ';
										strPrice += '<span class="values_wrapper">'+getCurrentPrice(obPrices[j].DISCOUNT_DIFF, obPrices[j].CURRENCY, obPrices[j].PRINT_DISCOUNT_DIFF)+'</span>';
									strPrice += '</div>';
								strPrice += '<div class="clearfix"></div></div></div>';
							}
						}
					}
					else
					{
						if (this.config.showOldPrice)
						{
							if (!!this.obPrice.full)
							{
								BX.adjust(this.obPrice.full, {style: {display: 'none'}, html: ''});
							}
							if (!!this.obPrice.discount)
							{
								BX.adjust(this.obPrice.discount, {style: {display: 'none'}, html: ''});
							}
						}
					}
					$('.prices_block .cost.prices').show();
				}
				else
				{
					$('.prices_block .cost.prices').hide();
				}
			}
			if (this.config.showPercent)
			{
				if (!!this.obPrice.percent)
				{
					BX.adjust(this.obPrice.percent, {style: {display: 'none'}, html: ''});
				}
				$(this.obPrice.full).closest('.cost').find('.sale_block:not(.matrix)').hide();
				$(this.obPrice.full).closest('.cost').find('.sale_block:not(.matrix) .value').html('');
				$(this.obPrice.full).closest('.cost').find('.sale_block:not(.matrix) .text span').html('');
			}
			strPrice += '</div>';
			BX.adjust(this.obPrice.price, {html: strPrice});

			$(this.obPrice.full).hide().html('');
			if(this.showPercent)
				$(this.obPrice.full).closest('.cost').find('.sale_block').hide();

			var eventdata = {product: product, measure: measure, config: this.config, offer: this.offers[this.offerNum], obPrices: obPrices};
			BX.onCustomEvent('onAsproSkuSetPrice', [eventdata])
		}
	}
};

window.JCCatalogElement.prototype.Compare = function()
{
	var compareParams, compareLink;
	if($(this.obCompare).find('.added').is(':visible')){
		compareLink = this.compareData.compareUrlDel;
		this.compareData.Added = false;
	}else{
		compareLink = this.compareData.compareUrl;
		this.compareData.Added = true;
	}
	if (!!compareLink){
		switch (this.productType){
			case 1://product
			case 2://set
				compareLink = compareLink.replace('#ID#', this.product.id.toString());
				break;
			case 3://sku
				compareLink = compareLink.replace('#ID#', this.offers[this.offerNum].ID);
				break;
		}
		compareParams = {
			ajax_action: 'Y'
		};
		BX.ajax.loadJSON(
			compareLink,
			compareParams,
			BX.proxy(this.CompareResult, this)
		);
	}
};

window.JCCatalogElement.prototype.CompareResult = function(result)
{
	var popupContent, popupButtons, popupTitle;

	if (typeof result !== 'object')
	{
		return false;
	}
	if (result.STATUS === 'OK')
	{
		BX.onCustomEvent('OnCompareChange');
		if(!this.compareData.Added){
			$(this.obCompare).removeClass('added');
			$(this.obCompare).find('.added').hide();
			$(this.obCompare).find('.value:not(.added)').css('display','block');
		}
		else{
			$(this.obCompare).addClass('added');
			$(this.obCompare).find('.value:not(.added)').hide();
			$(this.obCompare).find('.added').css('display','block');
		}
		jsAjaxUtil.InsertDataToNode(arNextOptions['SITE_DIR'] + 'ajax/show_compare_preview_top.php', 'compare_line', false);
	}
	else
	{
		console.log(BX.message('ADD_ERROR_COMPARE'));
	}
	return false;
};

window.JCCatalogElement.prototype.CompareRedirect = function()
{
	if (!!this.compareData.comparePath)
	{
		location.href = this.compareData.comparePath;
	}
	else
	{
		this.obPopupWin.close();
	}
};

window.JCCatalogElement.prototype.InitBasketUrl = function()
{
	var product_url='';
	this.basketUrl = (this.basketMode === 'ADD' ? this.basketData.add_url : this.basketData.buy_url);
	switch (this.productType)
	{
		case 1://product
		case 2://set
			this.basketUrl = this.basketUrl.replace('#ID#', this.product.id.toString());
			product_url=this.product.id.toString();
			break;
		case 3://sku
			this.basketUrl = this.basketUrl.replace('#ID#', this.offers[this.offerNum].ID);
			product_url=this.offers[this.offerNum].URL;
			break;
	}
	this.basketParams = {
		'ajax_basket': 'Y'
	};
	if (this.config.showQuantity)
	{
		this.basketParams[this.basketData.quantity] = this.obQuantity.value;
	}
	if (!!this.basketData.sku_props)
	{
		this.basketParams[this.basketData.sku_props_var] = this.basketData.sku_props;
	}
	if (!!product_url)
	{
		this.basketParams["REQUEST_URI"] = product_url;
	}
};

window.JCCatalogElement.prototype.FillBasketProps = function()
{
	if (!this.visual.BASKET_PROP_DIV)
	{
		return;
	}
	var
		i = 0,
		propCollection = null,
		foundValues = false,
		obBasketProps = null;
	if (this.basketData.useProps && !this.basketData.emptyProps)
	{
		if (!!this.obPopupWin && !!this.obPopupWin.contentContainer)
		{
			obBasketProps = this.obPopupWin.contentContainer;
		}
	}
	else
	{
		obBasketProps = BX(this.visual.BASKET_PROP_DIV);
	}
	if (!!obBasketProps)
	{
		propCollection = obBasketProps.getElementsByTagName('select');
		if (!!propCollection && !!propCollection.length)
		{
			for (i = 0; i < propCollection.length; i++)
			{
				if (!propCollection[i].disabled)
				{
					switch(propCollection[i].type.toLowerCase())
					{
						case 'select-one':
							this.basketParams[propCollection[i].name] = propCollection[i].value;
							foundValues = true;
							break;
						default:
							break;
					}
				}
			}
		}
		propCollection = obBasketProps.getElementsByTagName('input');
		if (!!propCollection && !!propCollection.length)
		{
			for (i = 0; i < propCollection.length; i++)
			{
				if (!propCollection[i].disabled)
				{
					switch(propCollection[i].type.toLowerCase())
					{
						case 'hidden':
							this.basketParams[propCollection[i].name] = propCollection[i].value;
							foundValues = true;
							break;
						case 'radio':
							if (propCollection[i].checked)
							{
								this.basketParams[propCollection[i].name] = propCollection[i].value;
								foundValues = true;
							}
							break;
						default:
							break;
					}
				}
			}
		}
	}
	if (!foundValues)
	{
		this.basketParams[this.basketData.props] = [];
		this.basketParams[this.basketData.props][0] = 0;
	}
};

window.JCCatalogElement.prototype.SendToBasket = function()
{
	if (!this.canBuy)
	{
		return;
	}
	this.InitBasketUrl();
	this.FillBasketProps();
	BX.ajax.loadJSON(
		this.basketUrl,
		this.basketParams,
		BX.proxy(this.BasketResult, this)
	);
};

window.JCCatalogElement.prototype.Add2Basket = function()
{
	this.basketMode = 'ADD';
	this.Basket();
};

window.JCCatalogElement.prototype.BuyBasket = function()
{
	this.basketMode = 'BUY';
	this.Basket();
};

window.JCCatalogElement.prototype.Basket = function()
{
	var contentBasketProps = '';
	if (!this.canBuy)
	{
		return;
	}
	this.SendToBasket();
};

window.JCCatalogElement.prototype.BasketResult = function(arResult)
{
	var popupContent, popupButtons, popupTitle, productPict;
	if (!!this.obPopupWin)
	{
		this.obPopupWin.close();
	}
	if (typeof arResult !== 'object')
	{
		return false;
	}
	if (arResult.STATUS === 'OK' && this.basketMode === 'BUY')
	{
		this.BasketRedirect();
	}
	else
	{
		// this.InitPopupWindow();
		popupTitle = {
			content: BX.create('div', {
				style: { marginRight: '30px', whiteSpace: 'nowrap' },
				text: (arResult.STATUS === 'OK' ? BX.message('TITLE_SUCCESSFUL') : BX.message('TITLE_ERROR'))
			})
		};
		if (arResult.STATUS === 'OK')
		{
			BX.onCustomEvent('OnBasketChange');
			this.offers[this.offerNum].BASKET_ACTIVE=true;
			this.BasketStateRefresh("Y");
		}
		else
		{
			console.log(BX.message('ADD_ERROR_BASKET'));
		}
	}
	return false;
};

window.JCCatalogElement.prototype.BasketRedirect = function()
{
	location.href = (!!this.basketData.basketUrl ? this.basketData.basketUrl : BX.message('BASKET_URL'));
};

window.JCCatalogElement.prototype.InitPopupWindow = function()
{
	if (!!this.obPopupWin)
	{
		return;
	}
	this.obPopupWin = BX.PopupWindowManager.create('CatalogElementBasket_'+this.visual.ID, null, {
		autoHide: false,
		offsetLeft: 0,
		offsetTop: 0,
		overlay : true,
		closeByEsc: true,
		titleBar: true,
		closeIcon: {top: '10px', right: '10px'}
	});
};

window.JCCatalogElement.prototype.onPopupWindowShow = function(popup)
{
	BX.bind(document, 'mouseover', BX.proxy(this.popupWindowClick, this));
};

window.JCCatalogElement.prototype.onPopupWindowClose = function(popup, event)
{
	BX.unbind(document, 'click', BX.proxy(this.popupWindowClick, this));
};

window.JCCatalogElement.prototype.popupWindowClick = function()
{
	if (!!this.obPopupPict && typeof (this.obPopupPict) === 'object')
	{
		if (this.obPopupPict.isShown())
		{
			this.obPopupPict.close();
		}
	}
};

window.JCCatalogElement.prototype.incViewedCounter = function()
{
	if (this.currentIsSet && !this.updateViewedCount)
	{

		switch (this.productType)
		{
			case 1:
			case 2:
				this.viewedCounter.params.PRODUCT_ID = this.product.id;
				this.viewedCounter.params.PARENT_ID = this.product.id;
				break;
			case 3:
				this.viewedCounter.params.PARENT_ID = this.product.id;
				this.viewedCounter.params.PRODUCT_ID = this.offers[this.offerNum].ID;
				break;
			default:
				return;
		}
		this.viewedCounter.params.SITE_ID = BX.message('SITE_ID');
		this.updateViewedCount = true;
		BX.ajax.post(
			this.viewedCounter.path,
			this.viewedCounter.params,
			BX.delegate(function(){ this.updateViewedCount = false; }, this)
		);
	}
};

window.JCCatalogElement.prototype.allowViewedCount = function(update)
{
	update = !!update;
	this.currentIsSet = true;
	if (update)
	{
		this.incViewedCounter();
	}
};
})(window);

/* End */
;
; /* Start:"a:4:{s:4:"full";s:109:"/local/templates/aspro_next/components/bitrix/sale.prediction.product.detail/main/script.min.js?1653434934337";s:6:"source";s:91:"/local/templates/aspro_next/components/bitrix/sale.prediction.product.detail/main/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function bx_sale_prediction_product_detail_load(a,t,e){t=t||{},e=e||{},BX.ajax({url:"/bitrix/components/bitrix/sale.prediction.product.detail/ajax.php",method:"POST",data:BX.merge(t,e),dataType:"html",processData:!1,start:!0,onsuccess:function(t){var e=BX.processHTML(t);BX(a).innerHTML=e.HTML,BX.ajax.processScripts(e.SCRIPT)}})}window;
/* End */
;
; /* Start:"a:4:{s:4:"full";s:98:"/local/templates/aspro_next/components/bitrix/sale.gift.product/main/script.min.js?165343493432510";s:6:"source";s:78:"/local/templates/aspro_next/components/bitrix/sale.gift.product/main/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function bx_sale_gift_product_load(t,e,i){e=e||{},i=i||{},BX.ajax({url:"/bitrix/components/bitrix/sale.gift.product/ajax.php",method:"POST",data:BX.merge(e,i),dataType:"html",processData:!1,start:!0,onsuccess:function(e){var i=BX.processHTML(e);BX(t).innerHTML=i.HTML,BX.ajax.processScripts(i.SCRIPT),initCountdown()}})}!function(t){if(t.JCCatalogSectionOnlyElement||(t.JCCatalogSectionOnlyElement=function(t){"object"==typeof t&&(this.params=t,this.obProduct=null,this.set_quantity=1,this.currentPriceMode="",this.currentPrices=[],this.currentPriceSelected=0,this.currentQuantityRanges=[],this.currentQuantityRangeSelected=0,this.params.MESS&&(this.mess=this.params.MESS),this.init())},t.JCCatalogSectionOnlyElement.prototype={init:function(){this.obProduct=BX(this.params.ID),this.obProduct&&($(this.obProduct).find(".counter_wrapp .counter_block input").data("product","ob"+this.obProduct.id+"el"),this.currentPriceMode=this.params.ITEM_PRICE_MODE,this.currentPrices=this.params.ITEM_PRICES,this.currentQuantityRanges=this.params.ITEM_QUANTITY_RANGES)},setPriceAction:function(){this.set_quantity=this.params.MIN_QUANTITY_BUY,$(this.obProduct).find("input[name=quantity]").length&&(this.set_quantity=$(this.obProduct).find("input[name=quantity]").val()),this.checkPriceRange(this.set_quantity),$(this.obProduct).find(".not_matrix").hide(),$(this.obProduct).find(".with_matrix .price_value_block").html(getCurrentPrice(this.currentPrices[this.currentPriceSelected].PRICE,this.currentPrices[this.currentPriceSelected].CURRENCY,this.currentPrices[this.currentPriceSelected].PRINT_PRICE)),$(this.obProduct).find(".with_matrix .discount")&&$(this.obProduct).find(".with_matrix .discount").html(getCurrentPrice(this.currentPrices[this.currentPriceSelected].BASE_PRICE,this.currentPrices[this.currentPriceSelected].CURRENCY,this.currentPrices[this.currentPriceSelected].PRINT_BASE_PRICE)),"Y"==this.params.SHOW_DISCOUNT_PERCENT_NUMBER&&(this.currentPrices[this.currentPriceSelected].PERCENT>0&&this.currentPrices[this.currentPriceSelected].PERCENT<100?($(this.obProduct).find(".with_matrix .sale_block .sale_wrapper .value").length||$('<div class="value"></div>').insertBefore($(this.obProduct).find(".with_matrix .sale_block .sale_wrapper .text")),$(this.obProduct).find(".with_matrix .sale_block .sale_wrapper .value").html("-<span>"+this.currentPrices[this.currentPriceSelected].PERCENT+"</span>%")):$(this.obProduct).find(".with_matrix .sale_block .sale_wrapper .value").length&&$(this.obProduct).find(".with_matrix .sale_block .sale_wrapper .value").remove()),$(this.obProduct).find(".with_matrix .sale_block .text .values_wrapper").html(getCurrentPrice(this.currentPrices[this.currentPriceSelected].DISCOUNT,this.currentPrices[this.currentPriceSelected].CURRENCY,this.currentPrices[this.currentPriceSelected].PRINT_DISCOUNT)),$(this.obProduct).find(".with_matrix").show(),"Y"==arNextOptions.THEME.SHOW_TOTAL_SUMM&&setPriceItem($(this.obProduct),this.set_quantity,this.currentPrices[this.currentPriceSelected].PRICE)},checkPriceRange:function(t){if(void 0!==t&&"Q"==this.currentPriceMode){var e,i=!1;for(var s in this.currentQuantityRanges)if(this.currentQuantityRanges.hasOwnProperty(s)&&(e=this.currentQuantityRanges[s],parseInt(t)>=parseInt(e.SORT_FROM)&&("INF"==e.SORT_TO||parseInt(t)<=parseInt(e.SORT_TO)))){i=!0,this.currentQuantityRangeSelected=e.HASH;break}!i&&(e=this.getMinPriceRange())&&(this.currentQuantityRangeSelected=e.HASH);for(var r in this.currentPrices)if(this.currentPrices.hasOwnProperty(r)&&this.currentPrices[r].QUANTITY_HASH==this.currentQuantityRangeSelected){this.currentPriceSelected=r;break}}},getMinPriceRange:function(){var t;for(var e in this.currentQuantityRanges)this.currentQuantityRanges.hasOwnProperty(e)&&(!t||parseInt(this.currentQuantityRanges[e].SORT_FROM)<parseInt(t.SORT_FROM))&&(t=this.currentQuantityRanges[e]);return t}}),!t.JCSaleGiftProduct){var e=function(t){e.superclass.constructor.apply(this,arguments),this.nameNode=BX.create("span",{props:{className:"bx_medium bx_bt_button",id:this.id},text:t.text}),this.buttonNode=BX.create("span",{attrs:{className:t.ownerClass},style:{marginBottom:"0",borderBottom:"0 none transparent"},children:[this.nameNode],events:this.contextEvents}),BX.browser.IsIE()&&this.buttonNode.setAttribute("hideFocus","hidefocus")};BX.extend(e,BX.PopupWindowButton),t.JCSaleGiftProduct=function(t){if(this.skuVisualParams={SELECT:{TAG_BIND:"select",TAG:"option",ACTIVE_CLASS:"active",HIDE_CLASS:"hidden",EVENT:"change"},LI:{TAG_BIND:"li",TAG:"li",ACTIVE_CLASS:"active",HIDE_CLASS:"missing",EVENT:"click"}},this.productType=0,this.showQuantity=!0,this.showAbsent=!0,this.secondPict=!1,this.showOldPrice=!1,this.showPercent=!1,this.showSkuProps=!1,this.showPercentNumber=!1,this.offerShowPreviewPictureProps=!1,this.visual={ID:"",PICT_ID:"",SECOND_PICT_ID:"",QUANTITY_ID:"",QUANTITY_UP_ID:"",QUANTITY_DOWN_ID:"",PRICE_ID:"",DSC_PERC:"",SECOND_DSC_PERC:"",DISPLAY_PROP_DIV:"",BASKET_PROP_DIV:""},this.product={checkQuantity:!1,maxQuantity:0,stepQuantity:1,isDblQuantity:!1,canBuy:!0,canSubscription:!0,name:"",pict:{},id:0,addUrl:"",buyUrl:""},this.basketData={useProps:!1,emptyProps:!1,quantity:"quantity",props:"prop",basketUrl:""},this.defaultPict={pict:null,secondPict:null},this.checkQuantity=!1,this.maxQuantity=0,this.stepQuantity=1,this.isDblQuantity=!1,this.canBuy=!0,this.canSubscription=!0,this.precision=6,this.precisionFactor=Math.pow(10,this.precision),this.currentPriceMode="",this.currentPrices=[],this.currentPriceSelected=0,this.currentQuantityRanges=[],this.currentQuantityRangeSelected=0,this.offers=[],this.offerNum=0,this.treeProps=[],this.obTreeRows=[],this.showCount=[],this.showStart=[],this.selectedValues={},this.obProduct=null,this.obQuantity=null,this.obQuantityUp=null,this.obQuantityDown=null,this.obPict=null,this.obSecondPict=null,this.obPrice=null,this.obTree=null,this.obBuyBtn=null,this.obDscPerc=null,this.obSecondDscPerc=null,this.obSkuProps=null,this.obMeasure=null,this.obPopupWin=null,this.basketUrl="",this.basketParams={},this.treeRowShowSize=5,this.treeEnableArrow={display:"",cursor:"pointer",opacity:1},this.treeDisableArrow={display:"",cursor:"default",opacity:.2},this.lastElement=!1,this.containerHeight=0,this.errorCode=0,"object"==typeof t){switch(this.productType=parseInt(t.PRODUCT_TYPE,10),this.showQuantity=t.SHOW_QUANTITY,this.showAbsent=t.SHOW_ABSENT,this.secondPict=!!t.SECOND_PICT,this.showOldPrice=!!t.SHOW_OLD_PRICE,this.showPercent=!!t.SHOW_DISCOUNT_PERCENT,this.showSkuProps=!!t.SHOW_SKU_PROPS,this.showPercentNumber="Y"==t.SHOW_DISCOUNT_PERCENT_NUMBER,this.offerShowPreviewPictureProps=t.OFFER_SHOW_PREVIEW_PICTURE_PROPS,this.visual=t.VISUAL,this.productType){case 1:case 2:t.PRODUCT&&"object"==typeof t.PRODUCT?(this.showQuantity&&(this.product.checkQuantity=t.PRODUCT.CHECK_QUANTITY,this.product.isDblQuantity=t.PRODUCT.QUANTITY_FLOAT,this.product.checkQuantity&&(this.product.maxQuantity=this.product.isDblQuantity?parseFloat(t.PRODUCT.MAX_QUANTITY):parseInt(t.PRODUCT.MAX_QUANTITY,10)),this.product.stepQuantity=this.product.isDblQuantity?parseFloat(t.PRODUCT.STEP_QUANTITY):parseInt(t.PRODUCT.STEP_QUANTITY,10),this.checkQuantity=this.product.checkQuantity,this.isDblQuantity=this.product.isDblQuantity,this.maxQuantity=this.product.maxQuantity,this.stepQuantity=this.product.stepQuantity,this.isDblQuantity&&(this.stepQuantity=Math.round(this.stepQuantity*this.precisionFactor)/this.precisionFactor)),this.product.canBuy=t.PRODUCT.CAN_BUY,this.product.canSubscription=t.PRODUCT.SUBSCRIPTION,this.canBuy=this.product.canBuy,this.canSubscription=this.product.canSubscription,this.product.name=t.PRODUCT.NAME,this.product.pict=t.PRODUCT.PICT,this.product.id=t.PRODUCT.ID,t.PRODUCT.ADD_URL&&(this.product.addUrl=t.PRODUCT.ADD_URL),t.PRODUCT.BUY_URL&&(this.product.buyUrl=t.PRODUCT.BUY_URL),t.BASKET&&"object"==typeof t.BASKET&&(this.basketData.useProps=!!t.BASKET.ADD_PROPS,this.basketData.emptyProps=!!t.BASKET.EMPTY_PROPS)):this.errorCode=-1;break;case 3:t.OFFERS&&BX.type.isArray(t.OFFERS)?(t.PRODUCT&&"object"==typeof t.PRODUCT&&(this.product.name=t.PRODUCT.NAME,this.product.id=t.PRODUCT.ID),this.offers=t.OFFERS,this.offerNum=0,t.OFFER_SELECTED&&(this.offerNum=parseInt(t.OFFER_SELECTED,10)),isNaN(this.offerNum)&&(this.offerNum=0),t.TREE_PROPS&&(this.treeProps=t.TREE_PROPS),t.DEFAULT_PICTURE&&(this.defaultPict.pict=t.DEFAULT_PICTURE.PICTURE,this.defaultPict.secondPict=t.DEFAULT_PICTURE.PICTURE_SECOND)):this.errorCode=-1;break;default:this.errorCode=-1}t.BASKET&&"object"==typeof t.BASKET&&(t.BASKET.QUANTITY&&(this.basketData.quantity=t.BASKET.QUANTITY),t.BASKET.PROPS&&(this.basketData.props=t.BASKET.PROPS),t.BASKET.BASKET_URL&&(this.basketData.basketUrl=t.BASKET.BASKET_URL)),this.lastElement=!!t.LAST_ELEMENT&&"Y"===t.LAST_ELEMENT}0===this.errorCode&&BX.ready(BX.delegate(this.Init,this))},t.JCSaleGiftProduct.prototype.Init=function(){var t=0,e="",i=null;if(this.obProduct=BX(this.visual.ID),this.obProduct||(this.errorCode=-1),this.obPict=BX(this.visual.PICT_ID),this.obPict||(this.errorCode=-2),this.secondPict&&this.visual.SECOND_PICT_ID&&(this.obSecondPict=BX(this.visual.SECOND_PICT_ID)),this.storeQuanity=BX(this.visual.STORE_QUANTITY),this.obPrice=BX(this.visual.PRICE_ID),this.obPriceOld=BX(this.visual.PRICE_OLD_ID),this.obPrice||(this.errorCode=-16),this.showQuantity&&this.visual.QUANTITY_ID&&(this.obQuantity=BX(this.visual.QUANTITY_ID),this.visual.QUANTITY_UP_ID&&(this.obQuantityUp=BX(this.visual.QUANTITY_UP_ID)),this.visual.QUANTITY_DOWN_ID&&(this.obQuantityDown=BX(this.visual.QUANTITY_DOWN_ID))),3===this.productType){if(this.visual.TREE_ID)for(this.obTree=BX(this.visual.TREE_ID),this.obTree||(this.errorCode=-256),e=this.visual.TREE_ITEM_ID,t=0;t<this.treeProps.length;t++)if(this.obTreeRows[t]={LIST:BX(e+this.treeProps[t].ID+"_list"),CONT:BX(e+this.treeProps[t].ID+"_cont")},!this.obTreeRows[t].LIST||!this.obTreeRows[t].CONT){this.errorCode=-512;break}this.visual.QUANTITY_MEASURE&&(this.obMeasure=BX(this.visual.QUANTITY_MEASURE))}if(this.visual.BUY_ID&&(this.obBuyBtn=BX(this.visual.BUY_ID)),this.showPercent&&(this.visual.DSC_PERC&&(this.obDscPerc=BX(this.visual.DSC_PERC)),this.secondPict&&this.visual.SECOND_DSC_PERC&&(this.obSecondDscPerc=BX(this.visual.SECOND_DSC_PERC))),this.showSkuProps&&this.visual.DISPLAY_PROP_DIV&&(this.obSkuProps=BX(this.visual.DISPLAY_PROP_DIV)),0===this.errorCode){switch(this.showQuantity&&(this.obQuantityUp&&BX.bind(this.obQuantityUp,"click",BX.delegate(this.QuantityUp,this)),this.obQuantityDown&&BX.bind(this.obQuantityDown,"click",BX.delegate(this.QuantityDown,this)),this.obQuantity&&BX.bind(this.obQuantity,"change",BX.delegate(this.QuantityChange,this))),this.productType){case 1:break;case 3:for(var s in this.skuVisualParams){if((i=BX.findChildren(this.obTree,{tagName:this.skuVisualParams[s].TAG_BIND},!0))&&0<i.length)for(t=0;t<i.length;t++)$(i[t]).on(this.skuVisualParams[s].EVENT,BX.delegate(this.SelectOfferProp,this))}this.SetCurrent()}this.obBuyBtn&&BX.bind(this.obBuyBtn,"click",BX.delegate(this.Basket,this))}},t.JCSaleGiftProduct.prototype.checkHeight=function(){this.containerHeight=parseInt(this.obProduct.parentNode.offsetHeight,10),isNaN(this.containerHeight)&&(this.containerHeight=0)},t.JCSaleGiftProduct.prototype.setHeight=function(){0<this.containerHeight&&BX.adjust(this.obProduct.parentNode,{style:{height:this.containerHeight+"px"}})},t.JCSaleGiftProduct.prototype.clearHeight=function(){BX.adjust(this.obProduct.parentNode,{style:{height:"auto"}})},t.JCSaleGiftProduct.prototype.QuantityUp=function(){var t=0,e=!0;0===this.errorCode&&this.showQuantity&&this.canBuy&&(t=this.isDblQuantity?parseFloat(this.obQuantity.value):parseInt(this.obQuantity.value,10),isNaN(t)||(t+=this.stepQuantity,this.checkQuantity&&t>this.maxQuantity&&(e=!1),e&&(this.isDblQuantity&&(t=Math.round(t*this.precisionFactor)/this.precisionFactor),this.obQuantity.value=t)))},t.JCSaleGiftProduct.prototype.QuantityDown=function(){var t=0,e=!0;0===this.errorCode&&this.showQuantity&&this.canBuy&&(t=this.isDblQuantity?parseFloat(this.obQuantity.value):parseInt(this.obQuantity.value,10),isNaN(t)||((t-=this.stepQuantity)<this.stepQuantity&&(e=!1),e&&(this.isDblQuantity&&(t=Math.round(t*this.precisionFactor)/this.precisionFactor),this.obQuantity.value=t)))},t.JCSaleGiftProduct.prototype.QuantityChange=function(){var t=0,e=!0;0===this.errorCode&&this.showQuantity&&(this.canBuy?(t=this.isDblQuantity?parseFloat(this.obQuantity.value):parseInt(this.obQuantity.value,10),isNaN(t)?this.obQuantity.value=this.stepQuantity:(this.checkQuantity&&(t>this.maxQuantity?(e=!1,t=this.maxQuantity):t<this.stepQuantity&&(e=!1,t=this.stepQuantity)),e||(this.obQuantity.value=t))):this.obQuantity.value=this.stepQuantity)},t.JCSaleGiftProduct.prototype.QuantitySet=function(t){0===this.errorCode&&(this.canBuy=this.offers[t].CAN_BUY,this.currentPriceMode=this.offers[t].ITEM_PRICE_MODE,this.currentPrices=this.offers[t].ITEM_PRICES,this.currentPriceSelected=this.offers[t].ITEM_PRICE_SELECTED,this.currentQuantityRanges=this.offers[t].ITEM_QUANTITY_RANGES,this.currentQuantityRangeSelected=this.offers[t].ITEM_QUANTITY_RANGE_SELECTED,this.canBuy?(this.obBasketActions&&BX.style(this.obBasketActions,"display",""),this.obNotAvail&&BX.style(this.obNotAvail,"display","none")):(this.obBasketActions&&(BX.style(this.obBasketActions,"opacity","0"),BX.style(BX.findParent(BX(this.obQuantity),{class:"counter_block"}),"display","none")),this.obNotAvail&&BX.style(this.obNotAvail,"display","")),this.showQuantity&&(this.isDblQuantity=this.offers[t].QUANTITY_FLOAT,this.checkQuantity=this.offers[t].CHECK_QUANTITY,this.isDblQuantity?(this.maxQuantity=parseFloat(this.offers[t].MAX_QUANTITY),this.stepQuantity=Math.round(parseFloat(this.offers[t].STEP_QUANTITY)*this.precisionFactor)/this.precisionFactor):(this.maxQuantity=parseInt(this.offers[t].MAX_QUANTITY,10),this.stepQuantity=parseInt(this.offers[t].STEP_QUANTITY,10)),this.obQuantity&&(this.obQuantity.value=this.defaultCount,this.obQuantity.disabled=!this.canBuy),this.obMeasure&&(this.offers[t].MEASURE?BX.adjust(this.obMeasure,{html:this.offers[t].MEASURE}):BX.adjust(this.obMeasure,{html:""}))),this.currentBasisPrice=this.offers[t].BASIS_PRICE)},t.JCSaleGiftProduct.prototype.SelectOfferProp=function(){var t=0,e="",i="",s=[],r=null,o=BX.proxy_context;if(o&&o.hasAttribute("data-treevalue")&&(i=o.getAttribute("data-treevalue"),propModes=o.getAttribute("data-showtype"),s=i.split("_"),this.SearchOfferPropIndex(s[0],s[1])&&(r=BX.findChildren(o.parentNode,{tagName:this.skuVisualParams[propModes.toUpperCase()].TAG},!1))&&0<r.length))for(t=0;t<r.length;t++)e=r[t].getAttribute("data-onevalue"),"TEXT"==propModes?e===s[1]?r[t].setAttribute("selected","selected"):r[t].removeAttribute("selected"):e===s[1]?$(r[t]).addClass(this.skuVisualParams[propModes.toUpperCase()].ACTIVE_CLASS):$(r[t]).removeClass(this.skuVisualParams[propModes.toUpperCase()].ACTIVE_CLASS)},t.JCSaleGiftProduct.prototype.SearchOfferPropIndex=function(t,e){var i,s,r="",o=!1,a=[],n=-1,h={},u=[];for(i=0;i<this.treeProps.length;i++)if(this.treeProps[i].ID===t){n=i;break}if(-1<n){for(i=0;i<n;i++)h[r="PROP_"+this.treeProps[i].ID]=this.selectedValues[r];if(r="PROP_"+this.treeProps[n].ID,!(o=this.GetRowValues(h,r)))return!1;if(!BX.util.in_array(e,o))return!1;for(h[r]=e,i=n+1;i<this.treeProps.length;i++){if(r="PROP_"+this.treeProps[i].ID,!(o=this.GetRowValues(h,r)))return!1;if(this.showAbsent)for(a=[],u=[],u=BX.clone(h,!0),s=0;s<o.length;s++)u[r]=o[s],this.GetCanBuy(u)&&(a[a.length]=o[s]);else a=o;this.selectedValues[r]&&BX.util.in_array(this.selectedValues[r],a)?h[r]=this.selectedValues[r]:h[r]=a[0],this.UpdateRow(i,h[r],o,a)}this.selectedValues=h,this.ChangeInfo()}return!0},t.JCSaleGiftProduct.prototype.RowLeft=function(){var t=0,e="",i=-1,s=BX.proxy_context;if(s&&s.hasAttribute("data-treevalue")){for(e=s.getAttribute("data-treevalue"),t=0;t<this.treeProps.length;t++)if(this.treeProps[t].ID===e){i=t;break}-1<i&&this.treeRowShowSize<this.showCount[i]&&(0>this.showStart[i]&&(this.showStart[i]++,BX.adjust(this.obTreeRows[i].LIST,{style:{marginLeft:20*this.showStart[i]+"%"}}),BX.adjust(this.obTreeRows[i].RIGHT,{style:this.treeEnableArrow})),0<=this.showStart[i]&&BX.adjust(this.obTreeRows[i].LEFT,{style:this.treeDisableArrow}))}},t.JCSaleGiftProduct.prototype.RowRight=function(){var t=0,e="",i=-1,s=BX.proxy_context;if(s&&s.hasAttribute("data-treevalue")){for(e=s.getAttribute("data-treevalue"),t=0;t<this.treeProps.length;t++)if(this.treeProps[t].ID===e){i=t;break}-1<i&&this.treeRowShowSize<this.showCount[i]&&(this.treeRowShowSize-this.showStart[i]<this.showCount[i]&&(this.showStart[i]--,BX.adjust(this.obTreeRows[i].LIST,{style:{marginLeft:20*this.showStart[i]+"%"}}),BX.adjust(this.obTreeRows[i].LEFT,{style:this.treeEnableArrow})),this.treeRowShowSize-this.showStart[i]>=this.showCount[i]&&BX.adjust(this.obTreeRows[i].RIGHT,{style:this.treeDisableArrow}))}},t.JCSaleGiftProduct.prototype.UpdateRowsImages=function(){if("object"==typeof this.offerShowPreviewPictureProps&&this.offerShowPreviewPictureProps.length){var t=this.selectedValues;for(var e in this.obTreeRows)if(BX.util.in_array(this.treeProps[e].CODE,this.offerShowPreviewPictureProps)){var i=BX.findChildren(this.obTreeRows[e].LIST,{tagName:"LI"},!1);if(i&&0<i.length)for(var s in i){var r=BX.findChild(i[s],{className:"cnt_item"},!0,!1);if(r){var o=i[s].getAttribute("data-onevalue");if(0!=o){var a=r.style.backgroundImage,n=r.getAttribute("data-obgi");n||(n=a,r.setAttribute("data-obgi",n));var h=!1,u=BX.clone(t,!0);u["PROP_"+this.treeProps[e].ID]=o;for(var c in this.offers){h=!0;for(var l in u)if(u[l]!==this.offers[c].TREE[l]){h=!1;break}if(h){if("object"==typeof this.offers[c].PREVIEW_PICTURE_FIELD&&this.offers[c].PREVIEW_PICTURE_FIELD.SRC){var p='url("'+this.offers[c].PREVIEW_PICTURE_FIELD.SRC+'")';a!==p&&(r.style.backgroundImage=p,BX.addClass(r,"pp"))}else h=!1;break}}!h&&n&&a!==n&&(r.style.backgroundImage=n,BX.removeClass(r,"pp"))}}}}}},t.JCSaleGiftProduct.prototype.UpdateRow=function(t,e,i,s){var r=0,o=0,a="",n=0,h={},u=!1,c=(this.treeEnableArrow,this.treeEnableArrow,null);if(-1<t&&t<this.obTreeRows.length&&(propMode=this.treeProps[t].DISPLAY_TYPE,(c=BX.findChildren(this.obTreeRows[t].LIST,{tagName:this.skuVisualParams[propMode].TAG},!1))&&0<c.length)){for(selectMode="SELECT"===this.treeProps[t].DISPLAY_TYPE,n=i.length,h={style:{},props:{disabled:"",selected:""}},r=0;r<c.length;r++)u=(a=c[r].getAttribute("data-onevalue"))===e&&0!=a,BX.util.in_array(a,s)?h.props.className=u?this.skuVisualParams[propMode].ACTIVE_CLASS:"":h.props.className=u?this.skuVisualParams[propMode].ACTIVE_CLASS+" "+this.skuVisualParams[propMode].HIDE_CLASS:this.skuVisualParams[propMode].HIDE_CLASS,selectMode?(h.props.disabled="disabled",h.props.selected=u?"selected":""):h.style.display="none",BX.util.in_array(a,i)&&(selectMode?h.props.disabled="":h.style.display="",u&&o,o++),BX.adjust(c[r],h);selectMode&&$(this.obTreeRows[t].LIST).parent().hasClass("ik_select")&&$(this.obTreeRows[t].LIST).ikSelect("reset"),this.showCount[t]=n,this.showStart[t]=0}},t.JCSaleGiftProduct.prototype.GetRowValues=function(t,e){var i,s=0,r=[],o=!1,a=!0;if(0===t.length){for(s=0;s<this.offers.length;s++)BX.util.in_array(this.offers[s].TREE[e],r)||(r[r.length]=this.offers[s].TREE[e]);o=!0}else for(s=0;s<this.offers.length;s++){a=!0;for(i in t)if(t[i]!==this.offers[s].TREE[i]){a=!1;break}a&&(BX.util.in_array(this.offers[s].TREE[e],r)||(r[r.length]=this.offers[s].TREE[e]),o=!0)}return!!o&&r},t.JCSaleGiftProduct.prototype.GetCanBuy=function(t){var e,i=0,s=!1,r=!0;for(i=0;i<this.offers.length;i++){r=!0;for(e in t)if(t[e]!==this.offers[i].TREE[e]){r=!1;break}if(r&&this.offers[i].CAN_BUY){s=!0;break}}return s},t.JCSaleGiftProduct.prototype.SetCurrent=function(){var t=0,e=0,i=[],s="",r=!1,o={},a=[],n=this.offers[this.offerNum].TREE;for(t=0;t<this.treeProps.length&&(s="PROP_"+this.treeProps[t].ID,r=this.GetRowValues(o,s));t++){if(BX.util.in_array(n[s],r)?o[s]=n[s]:(o[s]=r[0],this.offerNum=0),this.showAbsent)for(i=[],a=[],a=BX.clone(o,!0),e=0;e<r.length;e++)a[s]=r[e],this.GetCanBuy(a)&&(i[i.length]=r[e]);else i=r;this.UpdateRow(t,o[s],r,i)}this.selectedValues=o,this.ChangeInfo()},t.JCSaleGiftProduct.prototype.ChangeInfo=function(){var e,i=0,s=-1,r={},o=!0;for(i=0;i<this.offers.length;i++){o=!0;for(e in this.selectedValues)if(this.selectedValues[e]!==this.offers[i].TREE[e]){o=!1;break}if(o){s=i;break}}if(this.treeProps&&this.UpdateRowsImages(),-1<s){if(this.obPict){r={attrs:{}};this.offers[s].PREVIEW_PICTURE?r.attrs.src=this.offers[s].PREVIEW_PICTURE.SRC:r.attrs.src=this.defaultPict.pict.SRC,BX.adjust(BX.findChild(this.obPict,{tag:"img"}),r)}this.showSkuProps&&this.obSkuProps&&(0===this.offers[s].DISPLAY_PROPERTIES.length?BX.adjust(this.obSkuProps,{style:{display:"none"},html:""}):BX.adjust(this.obSkuProps,{style:{display:""},html:this.offers[s].DISPLAY_PROPERTIES})),this.setQuantityStore(this.offers[s].MAX_QUANTITY,this.offers[s].AVAILIABLE.TEXT),this.offerNum=s,this.QuantitySet(this.offerNum),$(this.obProduct).find(".quantity_block .values").length&&$(this.obProduct).find(".quantity_block .values .item span").text(this.offers[s].MAX_QUANTITY).css({opacity:"1"});var a=this.offers[s],n=$(this.obProduct),h=this;"undefined"!=typeof arBasketAspro?this.setActualDataBlock(n,a):void 0!==t.frameCacheVars&&BX.addCustomEvent("onFrameDataReceived",function(){h.setActualDataBlock(n,a)})}},t.JCSaleGiftProduct.prototype.setActualDataBlock=function(t,e){this.setLikeBlock(t,".like_icons .wish_item_button",e,"DELAY"),this.setLikeBlock(t,".like_icons .compare_item_button",e,"COMPARE"),this.setBuyBlock(t,e)},t.JCSaleGiftProduct.prototype.setLikeBlock=function(t,e,i,s){var r=t;"DELAY"==s&&(i.CAN_BUY?r.find(e).css("display","block"):r.find(e).hide()),r.find(e).attr("data-item",i.ID),r.find(e).find("span").attr("data-item",i.ID),arBasketAspro[s]&&(r.find(e).find(".to").removeClass("added").css("display","block"),r.find(e).find(".in").hide(),void 0!==arBasketAspro[s][i.ID]&&(r.find(e).find(".to").hide(),r.find(e).find(".in").css("display","block")))},t.JCSaleGiftProduct.prototype.setBuyBlock=function(t,e){var i=t.find(".offer_buy_block"),s=e.CONFIG.MIN_QUANTITY_BUY;if(i.find(".counter_wrapp .counter_block").length&&i.find(".counter_wrapp .counter_block").attr("data-item",e.ID),this.offers[this.offerNum].offer_set_quantity&&(s=this.offers[this.offerNum].offer_set_quantity),e.CONFIG.OPTIONS.USE_PRODUCT_QUANTITY_DETAIL&&"ADD"==e.CONFIG.ACTION&&e.CAN_BUY){var r=e.CONFIG.MAX_QUANTITY_BUY>0?"data-max='"+e.CONFIG.MAX_QUANTITY_BUY+"'":"",o='<span class="minus">-</span><input type="text" class="text" name="'+e.PRODUCT_QUANTITY_VARIABLE+'" value="'+s+'" /><span class="plus" '+r+">+</span>";arBasketAspro.BASKET&&void 0!==arBasketAspro.BASKET[e.ID]?i.find(".counter_wrapp .counter_block").length?i.find(".counter_wrapp .counter_block").hide():(i.find(".counter_wrapp").prepend('<div class="counter_block" data-item="'+e.ID+'"></div>'),i.find(".counter_wrapp .counter_block").html(o).hide()):i.find(".counter_wrapp .counter_block").length?i.find(".counter_wrapp .counter_block").html(o).show():(i.find(".counter_wrapp").prepend('<div class="counter_block" data-item="'+e.ID+'"></div>'),i.find(".counter_wrapp .counter_block").html(o))}else i.find(".counter_wrapp .counter_block").length&&i.find(".counter_wrapp .counter_block").hide();var a="ORDER"==e.CONFIG.ACTION||!e.CAN_BUY||!e.CONFIG.OPTIONS.USE_PRODUCT_QUANTITY_DETAIL||"SUBSCRIBE"==e.CONFIG.ACTION&&"Y"==e.CATALOG_SUBSCRIBE?"wide":"";$('<div class="button_block"></div>');if(i.find(".counter_wrapp").find(".button_block").length?arBasketAspro.BASKET&&void 0!==arBasketAspro.BASKET[e.ID]?(i.find(".counter_wrapp").find(".button_block").addClass("wide").html(e.HTML),markProductAddBasket(e.ID)):a?(i.find(".counter_wrapp").find(".button_block").addClass("wide").html(e.HTML),arBasketAspro.SUBSCRIBE&&void 0!==arBasketAspro.SUBSCRIBE[e.ID]&&markProductSubscribe(e.ID)):i.find(".counter_wrapp").find(".button_block").removeClass("wide").html(e.HTML):(i.find(".counter_wrapp").append('<div class="button_block '+a+'">'+e.HTML+"</div>"),arBasketAspro.BASKET&&void 0!==arBasketAspro.BASKET[e.ID]&&markProductAddBasket(e.ID),arBasketAspro.SUBSCRIBE&&void 0!==arBasketAspro.SUBSCRIBE[e.ID]&&markProductSubscribe(e.ID)),"NOTHING"!==e.CONFIG.ACTION)if("ADD"==e.CONFIG.ACTION&&e.CAN_BUY&&"N"!=e.SHOW_ONE_CLICK_BUY){var n='<span class="transparent big_btn type_block button one_click" data-offers="Y" data-item="'+e.ID+'" data-iblockID="'+e.IBLOCK_ID+'" data-quantity="'+e.CONFIG.MIN_QUANTITY_BUY+'" data-props="'+e.OFFER_PROPS+'" onclick="oneClickBuy('+e.ID+", "+e.IBLOCK_ID+', this)"><span>'+e.ONE_CLICK_BUY+"</span></span>";i.find(".wrapp_one_click").length?i.find(".wrapp_one_click").html(n):i.append('<div class="wrapp_one_click">'+n+"</div>")}else i.find(".wrapp_one_click").length&&i.find(".wrapp_one_click").remove();else i.find(".wrapp_one_click").length&&i.find(".wrapp_one_click").remove();i.fadeIn(),i.find(".counter_wrapp .counter_block input").data("product","ob"+this.obProduct.id),this.setPriceAction("","Y"),"Y"==arNextOptions.THEME.CHANGE_TITLE_ITEM&&$(this.obProduct).find(".item-title a").text(e.NAME)},t.JCSaleGiftProduct.prototype.setPriceAction=function(t,e){$(this.obProduct);(this.setPrice(),"Y"==arNextOptions.THEME.SHOW_TOTAL_SUMM)&&(this.offers[this.offerNum].check_quantity||(void 0!==t&&"Y"==t?t:"")&&(this.offers[this.offerNum].check_quantity=!0))},t.JCSaleGiftProduct.prototype.setPrice=function(t,e){var i;if(this.obPrice){e=this.offers[this.offerNum].MEASURE&&"Y"==this.offers[this.offerNum].SHOW_MEASURE?this.offers[this.offerNum].MEASURE:"";var s=$(this.obProduct),r=this.offers[this.offerNum].PRICE;this.offers[this.offerNum].offer_set_quantity=this.offers[this.offerNum].CONFIG.MIN_QUANTITY_BUY,$(s).find("input[name=quantity]").length&&(this.offers[this.offerNum].offer_set_quantity=$(s).find("input[name=quantity]").val()),i='<span class="values_wrapper">'+getCurrentPrice(r.VALUE,r.CURRENCY,r.PRINT_VALUE)+"</span>",BX.adjust($(this.obPrice).closest(".cost").find(".price.discount")[0],{html:i}),newPrice='<span class="values_wrapper">'+getCurrentPrice(r.DISCOUNT_VALUE,r.CURRENCY,r.PRINT_DISCOUNT_VALUE)+"</span>",e&&(newPrice+="/"+e),BX.adjust(this.obPrice,{html:newPrice}),r.DISCOUNT_VALUE!==r.VALUE&&this.showOldPrice&&r.DISCOUNT_VALUE>0?(price_value=BX.Currency.currencyFormat(r.VALUE*this.offers[this.offerNum].offer_set_quantity,r.CURRENCY),price_value_old=BX.Currency.currencyFormat(r.VALUE,r.CURRENCY),$(this.obPriceOld).find("strike").show().html('<span class="values_wrapper">'+r.PRINT_VALUE.replace(price_value_old,price_value)+"</span>"),this.showPercent&&r.DISCOUNT_VALUE&&($(this.obPriceOld).closest(".cost").find(".sale_block").show(),$(this.obPriceOld).closest(".cost").find(".value").html(r.DISCOUNT_DIFF_PERCENT_RAW),$(this.obPriceOld).closest(".cost").find(".text span").html(BX.Currency.currencyFormat(r.DISCOUNT_DIFF,r.CURRENCY,!0)))):($(this.obPriceOld).find("strike").hide().html(""),this.showPercent&&$(this.obPrice).closest(".cost").find(".sale_block").hide());var o={product:s,measure:e,config:this.config,offer:this.offers[this.offerNum],obPrice:r};BX.onCustomEvent("onAsproSkuSetPrice",[o])}},t.JCSaleGiftProduct.prototype.setQuantityStore=function(t,e){parseFloat(t)>0?$(this.storeQuanity).find(".icon").removeClass("order").addClass("stock"):$(this.storeQuanity).find(".icon").removeClass("stock").addClass("order"),$(this.storeQuanity).find(".icon + span").html(e)},t.JCSaleGiftProduct.prototype.InitBasketUrl=function(){switch(this.productType){case 1:case 2:this.basketUrl=this.product.addUrl;break;case 3:this.basketUrl=this.offers[this.offerNum].ADD_URL}this.basketParams={ajax_basket:"Y"},this.showQuantity&&(this.basketParams[this.basketData.quantity]=this.obQuantity.value)},t.JCSaleGiftProduct.prototype.FillBasketProps=function(){if(this.visual.BASKET_PROP_DIV){var t=0,e=null,i=!1,s=null;if(this.basketData.useProps&&!this.basketData.emptyProps?this.obPopupWin&&this.obPopupWin.contentContainer&&(s=this.obPopupWin.contentContainer):s=BX(this.visual.BASKET_PROP_DIV),s){if((e=s.getElementsByTagName("select"))&&e.length)for(t=0;t<e.length;t++)if(!e[t].disabled)switch(e[t].type.toLowerCase()){case"select-one":this.basketParams[e[t].name]=e[t].value,i=!0}if((e=s.getElementsByTagName("input"))&&e.length)for(t=0;t<e.length;t++)if(!e[t].disabled)switch(e[t].type.toLowerCase()){case"hidden":this.basketParams[e[t].name]=e[t].value,i=!0;break;case"radio":e[t].checked&&(this.basketParams[e[t].name]=e[t].value,i=!0)}i||(this.basketParams[this.basketData.props]=[],this.basketParams[this.basketData.props][0]=0)}}},t.JCSaleGiftProduct.prototype.SendToBasket=function(){this.canBuy&&(this.InitBasketUrl(),this.FillBasketProps(),BX.ajax.loadJSON(this.basketUrl,this.basketParams,BX.delegate(this.BasketResult,this)))},t.JCSaleGiftProduct.prototype.Basket=function(){var t="";if(this.canBuy)switch(this.productType){case 1:case 2:this.basketData.useProps&&!this.basketData.emptyProps?(this.InitPopupWindow(),this.obPopupWin.setTitleBar({content:BX.create("div",{style:{marginRight:"30px",whiteSpace:"nowrap"},text:BX.message("CVP_TITLE_BASKET_PROPS")})}),BX(this.visual.BASKET_PROP_DIV)&&(t=BX(this.visual.BASKET_PROP_DIV).innerHTML),this.obPopupWin.setContent(t),this.obPopupWin.setButtons([new e({ownerClass:this.obProduct.parentNode.parentNode.parentNode.className,text:BX.message("CVP_BTN_MESSAGE_SEND_PROPS"),events:{click:BX.delegate(this.SendToBasket,this)}})]),this.obPopupWin.show()):this.SendToBasket();break;case 3:this.SendToBasket()}},t.JCSaleGiftProduct.prototype.BasketResult=function(t){var i,s="",r="",o="",a=[];if(this.obPopupWin&&this.obPopupWin.close(),"object"!=typeof t)return!1;if(i="OK"===t.STATUS){switch(BX.onCustomEvent("OnBasketChange"),r=this.product.name,this.productType){case 1:case 2:o=this.product.pict.SRC;break;case 3:o=this.offers[this.offerNum].PREVIEW_PICTURE?this.offers[this.offerNum].PREVIEW_PICTURE.SRC:this.defaultPict.pict.SRC}s='<div style="width: 96%; margin: 10px 2%; text-align: center;"><img src="'+o+'" height="130" style="max-height:130px"><p>'+r+"</p></div>",a=[new e({ownerClass:this.obProduct.parentNode.parentNode.parentNode.className,text:BX.message("CVP_BTN_MESSAGE_BASKET_REDIRECT"),events:{click:BX.delegate(function(){location.href=this.basketData.basketUrl?this.basketData.basketUrl:BX.message("CVP_BASKET_URL")},this)}})]}else s=t.MESSAGE?t.MESSAGE:BX.message("CVP_BASKET_UNKNOWN_ERROR"),a=[new e({ownerClass:this.obProduct.parentNode.parentNode.parentNode.className,text:BX.message("CVP_BTN_MESSAGE_CLOSE"),events:{click:BX.delegate(this.obPopupWin.close,this.obPopupWin)}})];this.InitPopupWindow(),this.obPopupWin.setTitleBar({content:BX.create("div",{style:{marginRight:"30px",whiteSpace:"nowrap"},text:i?BX.message("CVP_TITLE_SUCCESSFUL"):BX.message("CVP_TITLE_ERROR")})}),this.obPopupWin.setContent(s),this.obPopupWin.setButtons(a),this.obPopupWin.show()},t.JCSaleGiftProduct.prototype.InitPopupWindow=function(){this.obPopupWin||(this.obPopupWin=BX.PopupWindowManager.create("CatalogSectionBasket_"+this.visual.ID,null,{autoHide:!1,offsetLeft:0,offsetTop:0,overlay:!0,closeByEsc:!0,titleBar:!0,closeIcon:{top:"10px",right:"10px"}}))}}}(window),BX.addCustomEvent("onSlideInit",function(t){try{if(ignoreResize.push(!0),t)if(t.slider.hasClass("tab")){var e=1*$(".bx_item_list_you_looked_horizontal.detail .all_wrapp .flex-viewport").height()+20,i=0;$(document).find(".bx_item_list_you_looked_horizontal.detail .footer_button").length&&($(document).find(".bx_item_list_you_looked_horizontal.detail .footer_button").css("height","auto"),i=$(document).find(".bx_item_list_you_looked_horizontal.detail .footer_button").height(),$(document).find(".bx_item_list_you_looked_horizontal.detail .footer_button").css("height",""));var s=e+i+50;$(".bx_item_list_you_looked_horizontal.detail .slides").equalize({children:".item-title"}),$(".bx_item_list_you_looked_horizontal.detail .slides").equalize({children:".item_info"}),$(".bx_item_list_you_looked_horizontal.detail .slides").equalize({children:".catalog_item"}),$(".bx_item_list_you_looked_horizontal.detail .all_wrapp .content_inner").attr("data-unhover",e),$(".bx_item_list_you_looked_horizontal.detail .all_wrapp .content_inner").attr("data-hover",s),$(".bx_item_list_you_looked_horizontal.detail .all_wrapp").height(e),$(".bx_item_list_you_looked_horizontal.detail .all_wrapp .content_inner").addClass("absolute")}}catch(t){}finally{ignoreResize.pop()}});
/* End */
;
; /* Start:"a:4:{s:4:"full";s:103:"/local/templates/aspro_next/components/bitrix/sale.gift.main.products/main/script.min.js?16534349342564";s:6:"source";s:84:"/local/templates/aspro_next/components/bitrix/sale.gift.main.products/main/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
BX.namespace("BX.Sale"),BX.Sale.GiftMainProductsClass=function(){var t=function(t){this.ajaxUrl="/bitrix/components/bitrix/sale.gift.main.products/ajax.php",this.contextAjaxData=t.contextAjaxData||{},this.mainProductState=t.mainProductState||null,this.injectId=t.injectId||null,this.isGift=!!t.isGift,this.productId=t.productId,this.offerId=t.offerId,this.offers=t.offers||[],this.setEvents(),document.location.hash.match(/as_gift/g)&&(this.isGift?this.enableGift():this.raiseNonGiftEvent()),BX.bindDelegate(BX(this.injectId),"click",{tagName:"a"},BX.proxy(this.clickNavLink,this))};return t.prototype.clickNavLink=function(t){return this.onPageNavigationByLink(BX.proxy_context)?BX.PreventDefault(t):void 0},t.prototype.setEvents=function(){BX.addCustomEvent("onCatalogStoreProductChange",BX.proxy(this.onCatalogStoreProductChange,this)),BX.addCustomEvent("onAddToBasketMainProduct",BX.proxy(this.onAddToBasketMainProduct,this))},t.prototype.unsubscribeEvents=function(){BX.removeCustomEvent("onCatalogStoreProductChange",BX.proxy(this.onCatalogStoreProductChange,this))},t.prototype.onAddToBasketMainProduct=function(t){this.enableGift()},t.prototype.onCatalogStoreProductChange=function(t){t!=this.offerId&&$(this.injectId).length&&BX.ajax({url:this.ajaxUrl,method:"POST",data:BX.merge(this.contextAjaxData,{offerId:t,mainProductState:this.mainProductState,SITE_ID:BX.message("SITE_ID")}),dataType:"html",processData:!1,start:!0,onsuccess:BX.delegate(function(e){this.offerId=t;var i=BX.processHTML(e);return i.HTML?(this.unsubscribeEvents(),BX(this.injectId).innerHTML=i.HTML,void BX.ajax.processScripts(i.SCRIPT)):void(document.location.hash.match(/as_gift/g)&&(this.isGift?this.raiseGiftEvent():this.raiseNonGiftEvent()))},this)})},t.prototype.onPageNavigationByLink=function(t){var e=BX.delegate(function(t){return BX.type.isElementNode(t)&&t.href?t.href.indexOf(this.ajaxUrl)>=0?!0:-1!==t.href.indexOf("PAGEN_"):!1},this);return e(t)?(BX.ajax({url:t.href,method:"POST",data:BX.merge(this.contextAjaxData,{SITE_ID:BX.message("SITE_ID")}),dataType:"html",processData:!1,start:!0,onsuccess:BX.delegate(function(t){var e=BX.processHTML(t);e.HTML&&(this.unsubscribeEvents(),BX(this.injectId).innerHTML=e.HTML,BX.ajax.processScripts(e.SCRIPT))},this)}),!0):!1},t.prototype.enableGift=function(){this.isGift=!0,this.raiseGiftEvent()},t.prototype.raiseGiftEvent=function(){BX.onCustomEvent("onSaleProductIsGift",[this.productId,this.offerId])},t.prototype.raiseNonGiftEvent=function(){BX.onCustomEvent("onSaleProductIsNotGift",[this.productId,this.offerId])},t}();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:68:"/local/templates/aspro_next/js/jquery.history.min.js?165343493421571";s:6:"source";s:48:"/local/templates/aspro_next/js/jquery.history.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
window.JSON||(window.JSON={}),function(){function f(a){return a<10?"0"+a:a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";return e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g,e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)d=rep[c],typeof d=="string"&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));return e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g,e}}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var JSON=window.JSON,cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}(),function(a,b){"use strict";var c=a.History=a.History||{},d=a.jQuery;if(typeof c.Adapter!="undefined")throw new Error("History.js Adapter has already been loaded...");c.Adapter={bind:function(a,b,c){d(a).bind(b,c)},trigger:function(a,b,c){d(a).trigger(b,c)},extractEventData:function(a,c,d){var e=c&&c.originalEvent&&c.originalEvent[a]||d&&d[a]||b;return e},onDomLoad:function(a){d(a)}},typeof c.init!="undefined"&&c.init()}(window),function(a,b){"use strict";var c=a.document,d=a.setTimeout||d,e=a.clearTimeout||e,f=a.setInterval||f,g=a.History=a.History||{};if(typeof g.initHtml4!="undefined")throw new Error("History.js HTML4 Support has already been loaded...");g.initHtml4=function(){if(typeof g.initHtml4.initialized!="undefined")return!1;g.initHtml4.initialized=!0,g.enabled=!0,g.savedHashes=[],g.isLastHash=function(a){var b=g.getHashByIndex(),c;return c=a===b,c},g.saveHash=function(a){return g.isLastHash(a)?!1:(g.savedHashes.push(a),!0)},g.getHashByIndex=function(a){var b=null;return typeof a=="undefined"?b=g.savedHashes[g.savedHashes.length-1]:a<0?b=g.savedHashes[g.savedHashes.length+a]:b=g.savedHashes[a],b},g.discardedHashes={},g.discardedStates={},g.discardState=function(a,b,c){var d=g.getHashByState(a),e;return e={discardedState:a,backState:c,forwardState:b},g.discardedStates[d]=e,!0},g.discardHash=function(a,b,c){var d={discardedHash:a,backState:c,forwardState:b};return g.discardedHashes[a]=d,!0},g.discardedState=function(a){var b=g.getHashByState(a),c;return c=g.discardedStates[b]||!1,c},g.discardedHash=function(a){var b=g.discardedHashes[a]||!1;return b},g.recycleState=function(a){var b=g.getHashByState(a);return g.discardedState(a)&&delete g.discardedStates[b],!0},g.emulated.hashChange&&(g.hashChangeInit=function(){g.checkerFunction=null;var b="",d,e,h,i;return g.isInternetExplorer()?(d="historyjs-iframe",e=c.createElement("iframe"),e.setAttribute("id",d),e.style.display="none",c.body.appendChild(e),e.contentWindow.document.open(),e.contentWindow.document.close(),h="",i=!1,g.checkerFunction=function(){if(i)return!1;i=!0;var c=g.getHash()||"",d=g.unescapeHash(e.contentWindow.document.location.hash)||"";return c!==b?(b=c,d!==c&&(h=d=c,e.contentWindow.document.open(),e.contentWindow.document.close(),e.contentWindow.document.location.hash=g.escapeHash(c)),g.Adapter.trigger(a,"hashchange")):d!==h&&(h=d,g.setHash(d,!1)),i=!1,!0}):g.checkerFunction=function(){var c=g.getHash();return c!==b&&(b=c,g.Adapter.trigger(a,"hashchange")),!0},g.intervalList.push(f(g.checkerFunction,g.options.hashChangeInterval)),!0},g.Adapter.onDomLoad(g.hashChangeInit)),g.emulated.pushState&&(g.onHashChange=function(b){var d=b&&b.newURL||c.location.href,e=g.getHashByUrl(d),f=null,h=null,i=null,j;return g.isLastHash(e)?(g.busy(!1),!1):(g.doubleCheckComplete(),g.saveHash(e),e&&g.isTraditionalAnchor(e)?(g.Adapter.trigger(a,"anchorchange"),g.busy(!1),!1):(f=g.extractState(g.getFullUrl(e||c.location.href,!1),!0),g.isLastSavedState(f)?(g.busy(!1),!1):(h=g.getHashByState(f),j=g.discardedState(f),j?(g.getHashByIndex(-2)===g.getHashByState(j.forwardState)?g.back(!1):g.forward(!1),!1):(g.pushState(f.data,f.title,f.url,!1),!0))))},g.Adapter.bind(a,"hashchange",g.onHashChange),g.pushState=function(b,d,e,f){if(g.getHashByUrl(e))throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(f!==!1&&g.busy())return g.pushQueue({scope:g,callback:g.pushState,args:arguments,queue:f}),!1;g.busy(!0);var h=g.createStateObject(b,d,e),i=g.getHashByState(h),j=g.getState(!1),k=g.getHashByState(j),l=g.getHash();return g.storeState(h),g.expectedStateId=h.id,g.recycleState(h),g.setTitle(h),i===k?(g.busy(!1),!1):i!==l&&i!==g.getShortUrl(c.location.href)?(g.setHash(i,!1),!1):(g.saveState(h),g.Adapter.trigger(a,"statechange"),g.busy(!1),!0)},g.replaceState=function(a,b,c,d){if(g.getHashByUrl(c))throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(d!==!1&&g.busy())return g.pushQueue({scope:g,callback:g.replaceState,args:arguments,queue:d}),!1;g.busy(!0);var e=g.createStateObject(a,b,c),f=g.getState(!1),h=g.getStateByIndex(-2);return g.discardState(f,e,h),g.pushState(e.data,e.title,e.url,!1),!0}),g.emulated.pushState&&g.getHash()&&!g.emulated.hashChange&&g.Adapter.onDomLoad(function(){g.Adapter.trigger(a,"hashchange")})},typeof g.init!="undefined"&&g.init()}(window),function(a,b){"use strict";var c=a.console||b,d=a.document,e=a.navigator,f=a.sessionStorage||!1,g=a.setTimeout,h=a.clearTimeout,i=a.setInterval,j=a.clearInterval,k=a.JSON,l=a.alert,m=a.History=a.History||{},n=a.history;k.stringify=k.stringify||k.encode,k.parse=k.parse||k.decode;if(typeof m.init!="undefined")throw new Error("History.js Core has already been loaded...");m.init=function(){return typeof m.Adapter=="undefined"?!1:(typeof m.initCore!="undefined"&&m.initCore(),typeof m.initHtml4!="undefined"&&m.initHtml4(),!0)},m.initCore=function(){if(typeof m.initCore.initialized!="undefined")return!1;m.initCore.initialized=!0,m.options=m.options||{},m.options.hashChangeInterval=m.options.hashChangeInterval||100,m.options.safariPollInterval=m.options.safariPollInterval||500,m.options.doubleCheckInterval=m.options.doubleCheckInterval||500,m.options.storeInterval=m.options.storeInterval||1e3,m.options.busyDelay=m.options.busyDelay||250,m.options.debug=m.options.debug||!1,m.options.initialTitle=m.options.initialTitle||d.title,m.intervalList=[],m.clearAllIntervals=function(){var a,b=m.intervalList;if(typeof b!="undefined"&&b!==null){for(a=0;a<b.length;a++)j(b[a]);m.intervalList=null}},m.debug=function(){(m.options.debug||!1)&&m.log.apply(m,arguments)},m.log=function(){var a=typeof c!="undefined"&&typeof c.log!="undefined"&&typeof c.log.apply!="undefined",b=d.getElementById("log"),e,f,g,h,i;a?(h=Array.prototype.slice.call(arguments),e=h.shift(),typeof c.debug!="undefined"?c.debug.apply(c,[e,h]):c.log.apply(c,[e,h])):e="\n"+arguments[0]+"\n";for(f=1,g=arguments.length;f<g;++f){i=arguments[f];if(typeof i=="object"&&typeof k!="undefined")try{i=k.stringify(i)}catch(j){}e+="\n"+i+"\n"}return b?(b.value+=e+"\n-----\n",b.scrollTop=b.scrollHeight-b.clientHeight):a||l(e),!0},m.getInternetExplorerMajorVersion=function(){var a=m.getInternetExplorerMajorVersion.cached=typeof m.getInternetExplorerMajorVersion.cached!="undefined"?m.getInternetExplorerMajorVersion.cached:function(){var a=3,b=d.createElement("div"),c=b.getElementsByTagName("i");while((b.innerHTML="<!--[if gt IE "+ ++a+"]><i></i><![endif]-->")&&c[0]);return a>4?a:!1}();return a},m.isInternetExplorer=function(){var a=m.isInternetExplorer.cached=typeof m.isInternetExplorer.cached!="undefined"?m.isInternetExplorer.cached:Boolean(m.getInternetExplorerMajorVersion());return a},m.emulated={pushState:!Boolean(a.history&&a.history.pushState&&a.history.replaceState&&!/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(e.userAgent)&&!/AppleWebKit\/5([0-2]|3[0-2])/i.test(e.userAgent)),hashChange:Boolean(!("onhashchange"in a||"onhashchange"in d)||m.isInternetExplorer()&&m.getInternetExplorerMajorVersion()<8)},m.enabled=!m.emulated.pushState,m.bugs={setHash:Boolean(!m.emulated.pushState&&e.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(e.userAgent)),safariPoll:Boolean(!m.emulated.pushState&&e.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(e.userAgent)),ieDoubleCheck:Boolean(m.isInternetExplorer()&&m.getInternetExplorerMajorVersion()<8),hashEscape:Boolean(m.isInternetExplorer()&&m.getInternetExplorerMajorVersion()<7)},m.isEmptyObject=function(a){for(var b in a)return!1;return!0},m.cloneObject=function(a){var b,c;return a?(b=k.stringify(a),c=k.parse(b)):c={},c},m.getRootUrl=function(){var a=d.location.protocol+"//"+(d.location.hostname||d.location.host);if(d.location.port||!1)a+=":"+d.location.port;return a+="/",a},m.getBaseHref=function(){var a=d.getElementsByTagName("base"),b=null,c="";return a.length===1&&(b=a[0],c=b.href.replace(/[^\/]+$/,"")),c=c.replace(/\/+$/,""),c&&(c+="/"),c},m.getBaseUrl=function(){var a=m.getBaseHref()||m.getBasePageUrl()||m.getRootUrl();return a},m.getPageUrl=function(){var a=m.getState(!1,!1),b=(a||{}).url||d.location.href,c;return c=b.replace(/\/+$/,"").replace(/[^\/]+$/,function(a,b,c){return/\./.test(a)?a:a+"/"}),c},m.getBasePageUrl=function(){var a=d.location.href.replace(/[#\?].*/,"").replace(/[^\/]+$/,function(a,b,c){return/[^\/]$/.test(a)?"":a}).replace(/\/+$/,"")+"/";return a},m.getFullUrl=function(a,b){var c=a,d=a.substring(0,1);return b=typeof b=="undefined"?!0:b,/[a-z]+\:\/\//.test(a)||(d==="/"?c=m.getRootUrl()+a.replace(/^\/+/,""):d==="#"?c=m.getPageUrl().replace(/#.*/,"")+a:d==="?"?c=m.getPageUrl().replace(/[\?#].*/,"")+a:b?c=m.getBaseUrl()+a.replace(/^(\.\/)+/,""):c=m.getBasePageUrl()+a.replace(/^(\.\/)+/,"")),c.replace(/\#$/,"")},m.getShortUrl=function(a){var b=a,c=m.getBaseUrl(),d=m.getRootUrl();return m.emulated.pushState&&(b=b.replace(c,"")),b=b.replace(d,"/"),m.isTraditionalAnchor(b)&&(b="./"+b),b=b.replace(/^(\.\/)+/g,"./").replace(/\#$/,""),b},m.store={},m.idToState=m.idToState||{},m.stateToId=m.stateToId||{},m.urlToId=m.urlToId||{},m.storedStates=m.storedStates||[],m.savedStates=m.savedStates||[],m.normalizeStore=function(){m.store.idToState=m.store.idToState||{},m.store.urlToId=m.store.urlToId||{},m.store.stateToId=m.store.stateToId||{}},m.getState=function(a,b){typeof a=="undefined"&&(a=!0),typeof b=="undefined"&&(b=!0);var c=m.getLastSavedState();return!c&&b&&(c=m.createStateObject()),a&&(c=m.cloneObject(c),c.url=c.cleanUrl||c.url),c},m.getIdByState=function(a){var b=m.extractId(a.url),c;if(!b){c=m.getStateString(a);if(typeof m.stateToId[c]!="undefined")b=m.stateToId[c];else if(typeof m.store.stateToId[c]!="undefined")b=m.store.stateToId[c];else{for(;;){b=(new Date).getTime()+String(Math.random()).replace(/\D/g,"");if(typeof m.idToState[b]=="undefined"&&typeof m.store.idToState[b]=="undefined")break}m.stateToId[c]=b,m.idToState[b]=a}}return b},m.normalizeState=function(a){var b,c;if(!a||typeof a!="object")a={};if(typeof a.normalized!="undefined")return a;if(!a.data||typeof a.data!="object")a.data={};b={},b.normalized=!0,b.title=a.title||"",b.url=m.getFullUrl(m.unescapeString(a.url||d.location.href)),b.hash=m.getShortUrl(b.url),b.data=m.cloneObject(a.data),b.id=m.getIdByState(b),b.cleanUrl=b.url.replace(/\??\&_suid.*/,""),b.url=b.cleanUrl,c=!m.isEmptyObject(b.data);if(b.title||c)b.hash=m.getShortUrl(b.url).replace(/\??\&_suid.*/,""),/\?/.test(b.hash)||(b.hash+="?"),b.hash+="&_suid="+b.id;return b.hashedUrl=m.getFullUrl(b.hash),(m.emulated.pushState||m.bugs.safariPoll)&&m.hasUrlDuplicate(b)&&(b.url=b.hashedUrl),b},m.createStateObject=function(a,b,c){var d={data:a,title:b,url:c};return d=m.normalizeState(d),d},m.getStateById=function(a){a=String(a);var c=m.idToState[a]||m.store.idToState[a]||b;return c},m.getStateString=function(a){var b,c,d;return b=m.normalizeState(a),c={data:b.data,title:a.title,url:a.url},d=k.stringify(c),d},m.getStateId=function(a){var b,c;return b=m.normalizeState(a),c=b.id,c},m.getHashByState=function(a){var b,c;return b=m.normalizeState(a),c=b.hash,c},m.extractId=function(a){var b,c,d;return c=/(.*)\&_suid=([0-9]+)$/.exec(a),d=c?c[1]||a:a,b=c?String(c[2]||""):"",b||!1},m.isTraditionalAnchor=function(a){var b=!/[\/\?\.]/.test(a);return b},m.extractState=function(a,b){var c=null,d,e;return b=b||!1,d=m.extractId(a),d&&(c=m.getStateById(d)),c||(e=m.getFullUrl(a),d=m.getIdByUrl(e)||!1,d&&(c=m.getStateById(d)),!c&&b&&!m.isTraditionalAnchor(a)&&(c=m.createStateObject(null,null,e))),c},m.getIdByUrl=function(a){var c=m.urlToId[a]||m.store.urlToId[a]||b;return c},m.getLastSavedState=function(){return m.savedStates[m.savedStates.length-1]||b},m.getLastStoredState=function(){return m.storedStates[m.storedStates.length-1]||b},m.hasUrlDuplicate=function(a){var b=!1,c;return c=m.extractState(a.url),b=c&&c.id!==a.id,b},m.storeState=function(a){return m.urlToId[a.url]=a.id,m.storedStates.push(m.cloneObject(a)),a},m.isLastSavedState=function(a){var b=!1,c,d,e;return m.savedStates.length&&(c=a.id,d=m.getLastSavedState(),e=d.id,b=c===e),b},m.saveState=function(a){return m.isLastSavedState(a)?!1:(m.savedStates.push(m.cloneObject(a)),!0)},m.getStateByIndex=function(a){var b=null;return typeof a=="undefined"?b=m.savedStates[m.savedStates.length-1]:a<0?b=m.savedStates[m.savedStates.length+a]:b=m.savedStates[a],b},m.getHash=function(){var a=m.unescapeHash(d.location.hash);return a},m.unescapeString=function(b){var c=b,d;for(;;){d=a.unescape(c);if(d===c)break;c=d}return c},m.unescapeHash=function(a){var b=m.normalizeHash(a);return b=m.unescapeString(b),b},m.normalizeHash=function(a){var b=a.replace(/[^#]*#/,"").replace(/#.*/,"");return b},m.setHash=function(a,b){var c,e,f;return b!==!1&&m.busy()?(m.pushQueue({scope:m,callback:m.setHash,args:arguments,queue:b}),!1):(c=m.escapeHash(a),m.busy(!0),e=m.extractState(a,!0),e&&!m.emulated.pushState?m.pushState(e.data,e.title,e.url,!1):d.location.hash!==c&&(m.bugs.setHash?(f=m.getPageUrl(),m.pushState(null,null,f+"#"+c,!1)):d.location.hash=c),m)},m.escapeHash=function(b){var c=m.normalizeHash(b);return c=a.escape(c),m.bugs.hashEscape||(c=c.replace(/\%21/g,"!").replace(/\%26/g,"&").replace(/\%3D/g,"=").replace(/\%3F/g,"?")),c},m.getHashByUrl=function(a){var b=String(a).replace(/([^#]*)#?([^#]*)#?(.*)/,"$2");return b=m.unescapeHash(b),b},m.setTitle=function(a){var b=a.title,c;b||(c=m.getStateByIndex(0),c&&c.url===a.url&&(b=c.title||m.options.initialTitle));try{d.getElementsByTagName("title")[0].innerHTML=b.replace("<","&lt;").replace(">","&gt;").replace(" & "," &amp; ")}catch(e){}return d.title=b,m},m.queues=[],m.busy=function(a){typeof a!="undefined"?m.busy.flag=a:typeof m.busy.flag=="undefined"&&(m.busy.flag=!1);if(!m.busy.flag){h(m.busy.timeout);var b=function(){var a,c,d;if(m.busy.flag)return;for(a=m.queues.length-1;a>=0;--a){c=m.queues[a];if(c.length===0)continue;d=c.shift(),m.fireQueueItem(d),m.busy.timeout=g(b,m.options.busyDelay)}};m.busy.timeout=g(b,m.options.busyDelay)}return m.busy.flag},m.busy.flag=!1,m.fireQueueItem=function(a){return a.callback.apply(a.scope||m,a.args||[])},m.pushQueue=function(a){return m.queues[a.queue||0]=m.queues[a.queue||0]||[],m.queues[a.queue||0].push(a),m},m.queue=function(a,b){return typeof a=="function"&&(a={callback:a}),typeof b!="undefined"&&(a.queue=b),m.busy()?m.pushQueue(a):m.fireQueueItem(a),m},m.clearQueue=function(){return m.busy.flag=!1,m.queues=[],m},m.stateChanged=!1,m.doubleChecker=!1,m.doubleCheckComplete=function(){return m.stateChanged=!0,m.doubleCheckClear(),m},m.doubleCheckClear=function(){return m.doubleChecker&&(h(m.doubleChecker),m.doubleChecker=!1),m},m.doubleCheck=function(a){return m.stateChanged=!1,m.doubleCheckClear(),m.bugs.ieDoubleCheck&&(m.doubleChecker=g(function(){return m.doubleCheckClear(),m.stateChanged||a(),!0},m.options.doubleCheckInterval)),m},m.safariStatePoll=function(){var b=m.extractState(d.location.href),c;if(!m.isLastSavedState(b))c=b;else return;return c||(c=m.createStateObject()),m.Adapter.trigger(a,"popstate"),m},m.back=function(a){return a!==!1&&m.busy()?(m.pushQueue({scope:m,callback:m.back,args:arguments,queue:a}),!1):(m.busy(!0),m.doubleCheck(function(){m.back(!1)}),n.go(-1),!0)},m.forward=function(a){return a!==!1&&m.busy()?(m.pushQueue({scope:m,callback:m.forward,args:arguments,queue:a}),!1):(m.busy(!0),m.doubleCheck(function(){m.forward(!1)}),n.go(1),!0)},m.go=function(a,b){var c;if(a>0)for(c=1;c<=a;++c)m.forward(b);else{if(!(a<0))throw new Error("History.go: History.go requires a positive or negative integer passed.");for(c=-1;c>=a;--c)m.back(b)}return m};if(m.emulated.pushState){var o=function(){};m.pushState=m.pushState||o,m.replaceState=m.replaceState||o}else m.onPopState=function(b,c){var e=!1,f=!1,g,h;return m.doubleCheckComplete(),g=m.getHash(),g?(h=m.extractState(g||d.location.href,!0),h?m.replaceState(h.data,h.title,h.url,!1):(m.Adapter.trigger(a,"anchorchange"),m.busy(!1)),m.expectedStateId=!1,!1):(e=m.Adapter.extractEventData("state",b,c)||!1,e?f=m.getStateById(e):m.expectedStateId?f=m.getStateById(m.expectedStateId):f=m.extractState(d.location.href),f||(f=m.createStateObject(null,null,d.location.href)),m.expectedStateId=!1,m.isLastSavedState(f)?(m.busy(!1),!1):(m.storeState(f),m.saveState(f),m.setTitle(f),m.Adapter.trigger(a,"statechange"),m.busy(!1),!0))},m.Adapter.bind(a,"popstate",m.onPopState),m.pushState=function(b,c,d,e){if(m.getHashByUrl(d)&&m.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(e!==!1&&m.busy())return m.pushQueue({scope:m,callback:m.pushState,args:arguments,queue:e}),!1;m.busy(!0);var f=m.createStateObject(b,c,d);return m.isLastSavedState(f)?m.busy(!1):(m.storeState(f),m.expectedStateId=f.id,n.pushState(f.id,f.title,f.url),m.Adapter.trigger(a,"popstate")),!0},m.replaceState=function(b,c,d,e){if(m.getHashByUrl(d)&&m.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(e!==!1&&m.busy())return m.pushQueue({scope:m,callback:m.replaceState,args:arguments,queue:e}),!1;m.busy(!0);var f=m.createStateObject(b,c,d);return m.isLastSavedState(f)?m.busy(!1):(m.storeState(f),m.expectedStateId=f.id,n.replaceState(f.id,f.title,f.url),m.Adapter.trigger(a,"popstate")),!0};if(f){try{m.store=k.parse(f.getItem("History.store"))||{}}catch(p){m.store={}}m.normalizeStore()}else m.store={},m.normalizeStore();m.Adapter.bind(a,"beforeunload",m.clearAllIntervals),m.Adapter.bind(a,"unload",m.clearAllIntervals),m.saveState(m.storeState(m.extractState(d.location.href,!0))),f&&(m.onUnload=function(){var a,b;try{a=k.parse(f.getItem("History.store"))||{}}catch(c){a={}}a.idToState=a.idToState||{},a.urlToId=a.urlToId||{},a.stateToId=a.stateToId||{};for(b in m.idToState){if(!m.idToState.hasOwnProperty(b))continue;a.idToState[b]=m.idToState[b]}for(b in m.urlToId){if(!m.urlToId.hasOwnProperty(b))continue;a.urlToId[b]=m.urlToId[b]}for(b in m.stateToId){if(!m.stateToId.hasOwnProperty(b))continue;a.stateToId[b]=m.stateToId[b]}m.store=a,m.normalizeStore(),f.setItem("History.store",k.stringify(a))},m.intervalList.push(i(m.onUnload,m.options.storeInterval)),m.Adapter.bind(a,"beforeunload",m.onUnload),m.Adapter.bind(a,"unload",m.onUnload));if(!m.emulated.pushState){m.bugs.safariPoll&&m.intervalList.push(i(m.safariStatePoll,m.options.safariPollInterval));if(e.vendor==="Apple Computer, Inc."||(e.appCodeName||"")==="Mozilla")m.Adapter.bind(a,"hashchange",function(){m.Adapter.trigger(a,"popstate")}),m.getHash()&&m.Adapter.onDomLoad(function(){m.Adapter.trigger(a,"hashchange")})}},m.init()}(window)
/* End */
;; /* /local/templates/aspro_next/components/bitrix/catalog/main/script.min.js?16534349341260*/
; /* /local/templates/aspro_next/components/bitrix/catalog.element/main/script.js?1658831996114641*/
; /* /local/templates/aspro_next/components/bitrix/sale.prediction.product.detail/main/script.min.js?1653434934337*/
; /* /local/templates/aspro_next/components/bitrix/sale.gift.product/main/script.min.js?165343493432510*/
; /* /local/templates/aspro_next/components/bitrix/sale.gift.main.products/main/script.min.js?16534349342564*/
; /* /local/templates/aspro_next/js/jquery.history.min.js?165343493421571*/
