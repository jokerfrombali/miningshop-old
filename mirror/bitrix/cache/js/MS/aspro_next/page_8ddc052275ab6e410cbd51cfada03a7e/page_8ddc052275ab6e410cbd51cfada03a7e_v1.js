
; /* Start:"a:4:{s:4:"full";s:95:"/local/templates/aspro_next/components/bitrix/news.list/staff-items/script.min.js?1653434934610";s:6:"source";s:77:"/local/templates/aspro_next/components/bitrix/news.list/staff-items/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
$(document).ready(function(){$(".table .row.sid").length&&$(".row.sid").each(function(){$(this).find(".item:visible .properties").sliceHeight({fixWidth:2}),$(this).find(".item:visible .body-info").sliceHeight({fixWidth:2})}),$(".table.item-views .tabs a").length&&($(".table.item-views .tabs a").first().addClass("heightsliced"),$(".table.item-views .tabs a").on("click",function(){$(this).hasClass("heightsliced")||($(".table.item-views .tab-pane.active").find(".item .properties").sliceHeight(),$(".table.item-views .tab-pane.active").find(".item .text").sliceHeight(),$(this).addClass("heightsliced"))}))});
/* End */
;; /* /local/templates/aspro_next/components/bitrix/news.list/staff-items/script.min.js?1653434934610*/
