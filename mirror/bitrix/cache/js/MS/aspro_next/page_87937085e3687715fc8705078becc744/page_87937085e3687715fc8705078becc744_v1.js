
; /* Start:"a:4:{s:4:"full";s:90:"/local/templates/aspro_next/components/bitrix/news.detail/news/script.min.js?1653434934698";s:6:"source";s:72:"/local/templates/aspro_next/components/bitrix/news.detail/news/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
$(document).ready(function(){$(".docs-block .blocks").length&&$(".docs-block .blocks .inner-wrapper").sliceHeight({row:".blocks",item:".inner-wrapper"}),$(".projects.item-views").length&&($(".projects.item-views .item .image").sliceHeight({lineheight:-3}),$(".projects.item-views .item").sliceHeight()),$(".items-services .item").sliceHeight(),SetFixedAskBlock()}),BX.addCustomEvent("onSlideInit",function(e){try{if(ignoreResize.push(!0),e){var i=e.slider;i.hasClass("small_slider")&&$(".detail .small-gallery-block .item").sliceHeight({lineheight:-3}),i.hasClass("big_slider")&&$(".detail .big_slider .item").sliceHeight({lineheight:-3})}$(window).resize()}catch(s){}finally{ignoreResize.pop()}});
/* End */
;
; /* Start:"a:4:{s:4:"full";s:101:"/local/templates/aspro_next/components/bitrix/catalog.top/products_slider/script.min.js?1653434934469";s:6:"source";s:83:"/local/templates/aspro_next/components/bitrix/catalog.top/products_slider/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
$(document).ready(function(){$(".wrapper_block .content_inner .slides .item-title").sliceHeight({item:".catalog_item",row:".items"}),$(".wrapper_block .content_inner .slides .cost").sliceHeight({item:".catalog_item",row:".items"}),$(".wrapper_block .content_inner .slides .item_info").sliceHeight({item:".catalog_item",row:".items"}),$(".wrapper_block .content_inner .slides .catalog_item").sliceHeight({item:".catalog_item",row:".items",classNull:".footer_button"})});
/* End */
;; /* /local/templates/aspro_next/components/bitrix/news.detail/news/script.min.js?1653434934698*/
; /* /local/templates/aspro_next/components/bitrix/catalog.top/products_slider/script.min.js?1653434934469*/
