$(document).ready(function() {
	$('.drop-menu').click(function() {
		if($('.drop-menu ul').hasClass('active')) {
			$('.drop-menu ul').removeClass('active');
		}
		else {
			$('.drop-menu ul').addClass('active');
		}
	});
	$('.drop-menu').mouseover(function() {
		$('.drop-menu ul').addClass('active');
	});
	$('.drop-menu ul').mouseout(function() {
		$(this).removeClass('active');
	});
	$('.nav-item.dropdown').mouseover(function() {
		$(this).addClass('open');
	});
	$('.dropdown-menu').mouseout(function(){
		$('.nav-item').removeClass('open');
	});
	$('.navbar-toggler').click(function() {
		if($('.main-nav').hasClass('active')) {
			$('.main-nav').removeClass('active')
		}
		else {
			$('.main-nav').addClass('active')
		}
	});
	$('.sm-menu a').click(function() {
		$('.main-nav').removeClass('active')
	});
	//E-mail Ajax Send
	$(".formm").submit(function() { //Change
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "./catalog/view/javascript/mail.php", //Change
			data: th.serialize()
		}).done(function() {
			$("#thanks").modal('show');
			$("#createfarm").modal('hide');
			$("#consultation").modal('hide');
			setTimeout(function() {
				// Done Functions
				th.trigger("reset");
			}, 1000);
		});
		return false;
	});
	$(".formn").submit(function() { //Change
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "./catalog/view/javascript/mail.php", //Change
			data: th.serialize()
		}).done(function() {
			$("#thanks2").modal('show');
			$("#director1").modal('hide');
			$("#director2").modal('hide');
			$("#manager1").modal('hide');
			$("#manager2").modal('hide');
			$("#manager3").modal('hide');
			setTimeout(function() {
				// Done Functions
				th.trigger("reset");
			}, 1000);
		});
		return false;
	});
	jQuery(function($){
        $(".phone-input").mask("+7 (999) 999-99-99");
      });
});
