var 
layerPopup = 0, 
windowWidth = document.documentElement.clientWidth,
windowHeight = document.documentElement.clientHeight;



function cptStoriesHideAdv()
{
	
	var hideAdv = document.querySelector(".js-cpt-stories-hide-adv"),
		siteID = document.querySelector('.cpt-stories-site_id');

	if(hideAdv)
	{
		cptStoriesXMLrequest({
			'path':'/bitrix/tools/concept.stories/hide_adv.php',
			'data': {
				'siteID':siteID.value,
				'check':'Y',
				'USER_ID': hideAdv.getAttribute('data-user-id'),
			},
			'NODE':null,
			'HIDE_ADV':'Y'
		});
	}
}

(function(window){

	window.CptStories = function(arParams)
	{
		this.product = arParams;
		this.nodes = {};
		this.eventsCustom = {};
		this.intervalId = null;
		this.time = 5;
		this.start = 0;
		this.setForLocalStorage = {};
		this.error = 0;

		this.initConfig();


		if(this.product.SLIDER.ITEMS_CNT === '0')
			this.error = -100;

		if(this.error === 0)
			BX.ready(BX.delegate(this.init, this));
	};

	window.CptStories.prototype = 
	{
		initConfig: function(){

			/*this.product.SLIDER.SELECTED = parseInt(this.product.SLIDER.SELECTED,10);

			if(this.product.SLIDER.ITEMS.length>0)
			{
				for (var i = 0; i < this.product.SLIDER.ITEMS.length; i++) {
					this.product.SLIDER.ITEMS[i].SELECTED = parseInt(this.product.SLIDER.ITEMS[i].SELECTED);
				}
			}*/
		},

		initNodes: function(){

			if(this.product.NODE)
			{
				this.nodes.obStories = document.querySelector("#"+this.product.NODE);

				var clone = this.nodes.obStories.cloneNode(true);

				this.nodes.obStories.remove();

				document.body.appendChild(clone);
				
				this.nodes.obStories = clone;

				this.nodes.obWindow = this.nodes.obStories.querySelector(".js-cpt-stories-modal-guts");
				this.nodes.obCloseBtn = this.nodes.obStories.querySelector(".js-cpt-stories-close-button");
				this.nodes.obPauseBtn = this.nodes.obStories.querySelector(".js-cpt-stories-pause-button");

				this.nodes.obBtnNext = this.nodes.obStories.querySelectorAll(".js-cpt-stories-window-next");
				this.nodes.obBtnPrev = this.nodes.obStories.querySelectorAll(".js-cpt-stories-window-prev");

				this.nodes.obWrSlides = this.nodes.obStories.querySelector(".js-cpt-stories-slides");
				this.nodes.obSlides = this.nodes.obWrSlides.querySelectorAll(".js-cpt-stories-slide");
				
				this.nodes.obFrames = this.nodes.obWrSlides.querySelectorAll(".js-cpt-stories-frame");

				this.nodes.obOverlay = this.nodes.obStories.querySelector(".js-cpt-stories-modal-overlay");
				this.nodes.obOverlayUser = this.nodes.obStories.querySelector(".js-cpt-stories-modal-overlay-user");
				this.nodes.obShadow = this.nodes.obStories.querySelector(".js-cpt-stories-bg-shadow");


				this.nodes.obStoriesPreview = document.querySelector("#"+this.product.NODE_PREVIEW);

				this.nodes.obWrSlidesPreview = this.nodes.obStoriesPreview.querySelectorAll(".js-cpt-stories-preview-slide");


				this.nodes.obBtns = this.nodes.obWrSlides.querySelectorAll(".js-cpt-stories-frame-btn");
				this.nodes.obFrameTitles = this.nodes.obWrSlides.querySelectorAll(".js-cpt-stories-frame-title");
				this.nodes.obFrameSubTitles = this.nodes.obWrSlides.querySelectorAll(".js-cpt-stories-frame-subtitle");
				this.nodes.obFrameText = this.nodes.obWrSlides.querySelectorAll(".js-cpt-stories-frame-text");

				/*this.nodes.obVideos = this.nodes.obWrSlides.querySelectorAll(".js-cpt-stories-video");*/

			}

			if(this.product.IS_WG === 'Y')
			{
				this.nodes.obFixBlock = document.querySelector(".js-cpt-stories-fixblock");
				this.nodes.obHideFixBlockBtn = this.nodes.obFixBlock.querySelector(".js-cpt-stories-close-button");
			}
		},

		setFontsSize: function()
		{
			var curFSize = null,
				result = 0,
				ratio = 100,
				windowWidth = document.documentElement.clientWidth;


			if(windowWidth >= 1200)
			{
				ratio = 0;
			}
			else if(windowWidth >= 992 && windowWidth <= 1199)
			{
				ratio = 0;
			}
			else if(windowWidth >= 768 && windowWidth <= 991)
			{
				ratio = 10;
			}
			else
			{
				ratio = 15;
			}


			if(this.nodes.obBtns)
				for (var i = 0; i < this.nodes.obBtns.length; i++)
				{
					this.nodes.obBtns[i].style.fontSize='';
					curFSize = parseInt(window.getComputedStyle(this.nodes.obBtns[i]).fontSize);
					result = curFSize - (curFSize * ratio / 100);
					this.nodes.obBtns[i].style.fontSize=result+'px';
					this.nodes.obBtns[i].style.lineHeight=(result+4)+'px';
				}
				
			if(this.nodes.obFrameTitles)
				for (var i = 0; i < this.nodes.obFrameTitles.length; i++)
				{
					this.nodes.obFrameTitles[i].style.fontSize='';
					curFSize = parseInt(window.getComputedStyle(this.nodes.obFrameTitles[i]).fontSize);
					result = curFSize - (curFSize * ratio / 100);
					this.nodes.obFrameTitles[i].style.fontSize=result+'px';
					this.nodes.obFrameTitles[i].style.lineHeight=(result+4)+'px';
				}

			if(this.nodes.obFrameSubTitles)
				for (var i = 0; i < this.nodes.obFrameSubTitles.length; i++)
				{
					this.nodes.obFrameSubTitles[i].style.fontSize='';
					curFSize = parseInt(window.getComputedStyle(this.nodes.obFrameSubTitles[i]).fontSize);
					result = curFSize - (curFSize * ratio / 100);
					this.nodes.obFrameSubTitles[i].style.fontSize=result+'px';
					this.nodes.obFrameSubTitles[i].style.lineHeight=(result+6)+'px';
				}

			if(this.nodes.obFrameText)
				for (var i = 0; i < this.nodes.obFrameText.length; i++)
				{
					this.nodes.obFrameText[i].style.fontSize='';
					curFSize = parseInt(window.getComputedStyle(this.nodes.obFrameText[i]).fontSize);
					result = curFSize - (curFSize * ratio / 100);
					this.nodes.obFrameText[i].style.fontSize=result+'px';
					this.nodes.obFrameText[i].style.lineHeight=(result+4)+'px';
				}
		},

		bindAnaliticsBtns: function()
		{
			var that = this;
			for (var i = 0; i < this.nodes.obBtns.length; i++)
			{

				var slideID = null,
					frameID = null,
					nodeFrame = null;


				this.nodes.obBtns[i].addEventListener('click', function()
				{

					var target = event.target;

					if(target.closest(".js-cpt-stories-frame"))
					{
						
						nodeFrame = target.closest(".js-cpt-stories-frame");
						slideID = nodeFrame.getAttribute('data-story');
						frameID = nodeFrame.getAttribute('data-frame');

						if(that.product.SLIDER.ITEMS[slideID].ITEMS[frameID].ANALYTIC_BTN_CLICK)
							cptStoriesAddScript(that.product.SLIDER.ITEMS[slideID].ITEMS[frameID].ANALYTIC_BTN_CLICK);
					
					}

				});
				
			}
		},

		bindBtns: function()
		{
			var that = this;

			for (var i = 0; i < this.nodes.obBtns.length; i++)
			{
				this.nodes.obBtns[i].addEventListener('click', that.hidePopupStories.bind(that));
			}
		},

		bindPauseFromFrame: function()
		{
			var that = this;

		
			for (var i = 0; i < this.nodes.obFrames.length; i++)
			{
				this.nodes.obFrames[i].addEventListener("mousedown", that.pauseFrame.bind(that));
				this.nodes.obFrames[i].addEventListener("mouseup", that.playFrame.bind(that));
				this.nodes.obFrames[i].addEventListener("touchstart", that.pauseFrame.bind(that));
				this.nodes.obFrames[i].addEventListener("touchend", that.playFrame.bind(that));
			}
			
			
		},

		

		bindPrevNextBtns: function()
		{
			var that = this;

			if(this.nodes.obBtnNext)
			{
				for (var i = 0; i < this.nodes.obBtnNext.length; i++)
				{
					this.nodes.obBtnNext[i].addEventListener("click", function(e) 
					{
						e.preventDefault();
						that.next();
					});
					/*this.nodes.obBtnNext[i].addEventListener("mouseup", function(e) 
					{
						e.preventDefault();
						that.playFrame();
					});*/
					
				}
			}

			if(this.nodes.obBtnPrev)
			{

				for (var i = 0; i < this.nodes.obBtnPrev.length; i++)
				{
					this.nodes.obBtnPrev[i].addEventListener("click", function(e) 
					{
						e.preventDefault();
						that.prev();
					});
					/*this.nodes.obBtnPrev[i].addEventListener("mouseup", function(e) 
					{
						e.preventDefault();
						that.playFrame();
					});*/
				}
			}
		},

		bindShowPopupStories: function()
		{
			var that = this;

			if(this.nodes.obWrSlidesPreview)
			{
				for (var i = 0; i < this.nodes.obWrSlidesPreview.length; i++)
				{
					this.nodes.obWrSlidesPreview[i].addEventListener("click", that.showPopupStories.bind(that));
				}

			}
		},

		bindHidePopupStories: function()
		{
			var that = this;
			if(this.nodes.obCloseBtn)
				this.nodes.obCloseBtn.addEventListener('click', that.hidePopupStories.bind(that));

			if(this.nodes.obShadow)
				this.nodes.obShadow.addEventListener('click', that.hidePopupStories.bind(that));
		},

		bindTooglePlayPause: function()
		{
			var target = event.target;
			event.preventDefault();


			if(target.closest(".cpt-stories-pause"))
			{
				this.pauseFrame();
			}
			else if(target.closest(".cpt-stories-play"))
			{
				this.playFrame();
			}
		},

		showPopupStories: function()
		{
			var target = event.target, slide = null;

			if(slide = target.closest(".js-cpt-stories-preview-slide"))
		    {
				event.preventDefault();

				setBodyOverflowHidden();


				if(document.documentElement.clientWidth <= 576)
				{
					if(document.documentElement.requestFullScreen) {
					    document.documentElement.requestFullScreen();
					  } else if(document.documentElement.mozRequestFullScreen) {
					    document.documentElement.mozRequestFullScreen();
					  } else if(document.documentElement.webkitRequestFullScreen) {
					    document.documentElement.webkitRequestFullScreen();
					  }
				}
				


				this.product.SLIDER.SELECTED = slide.getAttribute('data-story');

				this.changeSlide();
				this.changeFrame();

				this.getCurrentStory();
				this.ComplitedFramesNav();
				this.startFrameNav();

				this.nodes.obStories.classList.remove('cpt-stories-d-none');



				if(this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].ANALYTICS_START_WATCH)
					cptStoriesAddScript(this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].ANALYTICS_START_WATCH);




			}

		},

		hidePopupStories: function()
		{

			if(document.documentElement.clientWidth <= 576)
			{
				if(document.cancelFullScreen)
					document.cancelFullScreen();

				else if(document.mozCancelFullScreen)
				    document.mozCancelFullScreen();

				else if(document.webkitCancelFullScreen)
					document.webkitCancelFullScreen();
			}


			this.setBtnPlay();
			this.nodes.obStories.classList.add('cpt-stories-d-none');
			clearInterval(this.intervalId);
			deleteBodyOverflowHidden();

		},

		bindEvents: function()
		{
			this.bindShowPopupStories();
			this.bindHidePopupStories();
			this.bindPrevNextBtns();
			this.bindPauseFromFrame();
			this.bindBtns();
			this.bindAnaliticsBtns();

			if(this.product.IS_WG === 'Y')
				this.bindHideFixBlockBtn();

			var that = this;
			if(this.nodes.obPauseBtn)
				this.nodes.obPauseBtn.addEventListener('click', that.bindTooglePlayPause.bind(that));
		},


		preViewSlides: function()
		{
			var data = JSON.parse(localStorage.getItem('cpt-stories-'+this.product.ID)),
				newDate = {};
			
			if(data)
			{

				if(Object.keys(data).length > 30)
				{
					localStorage.removeItem('cpt-stories-'+this.product.ID);
				}
				else
				{

					if(this.product.SLIDER.ITEMS)
					{
						for (var pair in this.product.SLIDER.ITEMS){

							if(this.product.SLIDER.ITEMS[pair].ITEMS_CNT === data[pair])
							{
								newDate[pair] = data[pair];
							}
						}
					}

					if(Object.keys(newDate).length > 0)
					{

						this.setForLocalStorage = newDate;

						for (var i = 0; i < this.nodes.obWrSlidesPreview.length; i++)
						{
							var dataStory = this.nodes.obWrSlidesPreview[i].getAttribute('data-story');

							for (var pair in this.setForLocalStorage){
								if(dataStory == pair)
									this.nodes.obWrSlidesPreview[i].classList.remove('cpt-stories-preview-slide-active');

							}
							// this.nodes.obWrSlidesPreview[data[i]].classList.remove('cpt-stories-preview-slide-active');
						}
					}
				}
			}
		},

		startWg: function(){
			this.product.WG_START_TIMER = parseFloat(this.product.WG_START_TIMER);
			var that = this,
				now = Date.now(),
				data = JSON.parse(localStorage.getItem('cpt-stories-timer'));
			
			if(data)
			{
				if(now>=data[0])
				{
					localStorage.removeItem('cpt-stories-timer');
				}
				else
				{
					that.product.WG_START_TIMER = data[0] - now;
				}
			}


			setTimeout(
				function()
				{
					that.nodes.obFixBlock.classList.add('cpt-stories-show');

					setTimeout(
					function()
					{
						var previmg = that.nodes.obFixBlock.querySelector('.js-cpt-stories-fixblock-img');
						if(previmg)
							previmg.classList.add('cpt-stories-animate-rotate');
					},1000
				);


				},that.product.WG_START_TIMER
			);
			
		},

		hideFixBlock: function()
		{
			this.nodes.obFixBlock.classList.remove('cpt-stories-show');

			this.product.WG_HIDDEN_TIMER = parseInt(this.product.WG_HIDDEN_TIMER);

			if(this.product.WG_HIDDEN_TIMER > 0)
			{
				var now = Date.now();
				localStorage.setItem('cpt-stories-timer', JSON.stringify([this.product.WG_HIDDEN_TIMER + now]));
			}
		},

		bindHideFixBlockBtn: function(){

			if(this.nodes.obHideFixBlockBtn)
			{
				var that = this;
				this.nodes.obHideFixBlockBtn.addEventListener('click', that.hideFixBlock.bind(that));
			}
			
		},

		init: function()
		{
			
			this.initNodes();
			this.preViewSlides();
			this.setupFrameParams();
			window.addEventListener("resize", {handleEvent: this.setupFrameParams, context: this});


			if(this.product.IS_WG === 'Y')
				this.startWg();

			this.changeSlide();
			this.changeFrame();

			this.bindEvents();

			this.getCurrentStory();

		},

		getCurrentStory: function(){
			this.getCurrentSlide();
			this.getCurrentFrame();
		},

		resetFrames: function(){
			var obFrameNavs = this.nodes.obStories.querySelectorAll(".js-cpt-stories-slide-progress-item[data-story='"+this.product.SLIDER_SELECTED+"']");

			for (var i = 0; i < obFrameNavs.length; i++)
			{
				obFrameNavs[i].style.width = '0%';
			}
		},


		ComplitedFramesNav: function(){

			this.resetFrames();

			var obFrameNavs = this.nodes.obStories.querySelectorAll(".js-cpt-stories-slide-progress-item[data-story='"+this.product.SLIDER_SELECTED+"']");

			for (var i = 0; i < obFrameNavs.length; i++)
			{
				if(parseInt(this.product.SLIDER.ITEMS[this.product.SLIDER_SELECTED].ITEMS[this.product.FRAME_SELECTED].INDEX) === i)
					break;

				obFrameNavs[i].style.width = '100%';
			}
		
		},

		setBtnPlay: function()
		{
			this.nodes.obPauseBtn.classList.add("cpt-stories-pause");
			this.nodes.obPauseBtn.classList.remove("cpt-stories-play");
		},

		setBtnPause: function()
		{
			this.nodes.obPauseBtn.classList.add("cpt-stories-play");
			this.nodes.obPauseBtn.classList.remove("cpt-stories-pause");
		},

		playFrame: function(){
			this.moveFrameNav();
			this.setBtnPlay();
		},

		pauseFrame: function(){

			if(this.intervalId)
			{
				clearInterval(this.intervalId);
				this.setBtnPause();
			}

		},

		moveFrameNav: function(){
			var that = this;
			var obFrameNav = this.nodes.obStories.querySelector(".js-cpt-stories-slide-progress-item[data-story='"+this.product.SLIDER_SELECTED+"'][data-frame='"+this.product.FRAME_SELECTED+"']");

			this.intervalId = setInterval(function(){
				obFrameNav.style.width = that.start+'%';
				that.start++;

				if(that.start > 100)
				{
					that.next();
				}
				
			}, that.time);
		},

		startFrameNav: function(){
			
			this.time = (parseFloat(this.product.CURRENT_FRAME.TIMER) * 1000) / 100;
			this.start = 0;

			if(this.intervalId)
				clearInterval(this.intervalId);

			this.moveFrameNav();
		},

		complitedFrameNav: function(){
			this.setBtnPlay();
			var obFrameNav = this.nodes.obStories.querySelector(".js-cpt-stories-slide-progress-item[data-story='"+this.product.SLIDER.SELECTED+"'][data-frame='"+this.product.SLIDER.ITEMS[this.product.SLIDER_SELECTED].SELECTED+"']");
			obFrameNav.style.width = '100%';
		},
		prevFrameNav: function(){
			this.setBtnPlay();
			var obFrameNav = this.nodes.obStories.querySelector(".js-cpt-stories-slide-progress-item[data-story='"+this.product.SLIDER.SELECTED+"'][data-frame='"+this.product.SLIDER.ITEMS[this.product.SLIDER_SELECTED].SELECTED+"']");
			obFrameNav.style.width = '0%';
		},

		setupSlideParams: function()
		{
			var that = this, prepareHeight = -65;
			this.nodes.obSlides.forEach(function(item) {
				item.style.width = that.product.frameWidth+'px';
				item.style.height = that.product.frameHeigth+'px';
			});

			if(document.documentElement.clientWidth < 576)
				prepareHeight = 0
			


			this.nodes.obFrames.forEach(function(item) {
				item.style.width = that.product.frameWidth+'px';
				item.style.height = (that.product.frameHeigth + prepareHeight)+'px';
			});


			this.changeSlide();
			this.cptStoriesResponsive();
			this.setFontSize();
		},
		setFontSize: function ()
		{
			/*var titles = this.nodes.obStories.querySelectorAll('.cpt-stories-frame-title'),
			subtitles = this.nodes.obStories.querySelectorAll('.cpt-stories-frame-subtitle'),
			texts = this.nodes.obStories.querySelectorAll('.cpt-stories-frame-text'),
			btns = this.nodes.obStories.querySelectorAll('.cpt-stories-frame-btn');

			if(titles)
			{
				for (var i = 0; i < titles.length; i++) {
					console.log(titles[i]);
				}
			}
			if(subtitles)
			{
				for (var i = 0; i < subtitles.length; i++) {
				
				}
			}
			if(texts)
			{
				for (var i = 0; i < texts.length; i++) {
				
				}
			}
			if(btns)
			{
				for (var i = 0; i < btns.length; i++) {
				
				}
			}*/
			
		},

		cptStoriesResponsive: function ()
		{
			
			if(this.product.frameWidth >= 750)
			{
				cssClass='cpt-stories-frame-xl';
			}
			else if(this.product.frameWidth >= 600 && this.product.frameWidth <= 749)
			{
				cssClass='cpt-stories-frame-lg';
			}
			else if(this.product.frameWidth >= 400 && this.product.frameWidth <= 599)
			{
				cssClass='cpt-stories-frame-md';
			}
			else
			{
				cssClass='cpt-stories-frame-sm';
			}

			this.nodes.obStories.classList.remove('cpt-stories-frame-xl', 'cpt-stories-frame-lg', 'cpt-stories-frame-md', 'cpt-stories-frame-sm');
			this.nodes.obStories.classList.add(cssClass);

		
		},

		setupFrameParams: function()
		{
			windowWidth = document.documentElement.clientWidth,
			windowHeight = document.documentElement.clientHeight;
			

			if(windowHeight>900)
				windowHeight = 900;
			
				var that = this;

				if(this.context)
					that = this.context;

				if(windowWidth<576)
				{
					that.product.frameWidth = parseInt(windowWidth, 10);
				}
				else
				{
					that.product.frameWidth = parseInt(windowHeight * that.product.CONFIG.RATIO, 10);
				}

				that.product.frameHeigth = parseInt(windowHeight, 10);

				that.nodes.obWindow.style.width = that.product.frameWidth+'px';
				that.nodes.obWindow.style.height = that.product.frameHeigth+'px';

				that.changeFrame();
				that.setupSlideParams();
				that.setFontsSize();

		},

		changeSlide: function()
		{

			var translateX = this.product.frameWidth * parseInt(this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].INDEX);
			this.nodes.obWrSlides.style.transform = "translate3d(-" + translateX + "px, 0px, 0px)";

		},

		changeFrame: function()
		{
			var obWrFrames = this.nodes.obStories.querySelector(".js-cpt-stories-slide[data-story='"+this.product.SLIDER.SELECTED+"'] .js-cpt-stories-frames");

			var translateX = this.product.frameWidth * parseInt(this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].ITEMS[this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].SELECTED].INDEX);
			obWrFrames.style.transform = "translate3d(-" + translateX + "px, 0px, 0px)";


			this.setBg();

		},

		hasNextSlide: function()
		{
			return (this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].NEXT_ID)?true:false;
		},

		hasPrevSlide: function()
		{
			return (this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].PREV_ID && this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].PREV_ID != this.product.SLIDER.SELECTED)?true:false;
		},

		hasNextFrame: function()
		{
			var curFrameSelected = this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].SELECTED;
			return (this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].ITEMS[curFrameSelected].NEXT_ID)?true:false;
		},

		hasPrevFrame: function()
		{
			var curFrameSelected = this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].SELECTED;
			return (this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].ITEMS[curFrameSelected].PREV_ID && this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].ITEMS[curFrameSelected].PREV_ID != curFrameSelected)?true:false;
		},

		resetStories:function()
		{
			this.product.SLIDER.SELECTED = this.product.SLIDER.FIRST_SELECTED;

			if(this.product.SLIDER.ITEMS.length>0)
			{
				for (var i = 0; i < this.product.SLIDER.ITEMS.length; i++) {
					this.product.SLIDER.ITEMS[i].SELECTED = this.product.SLIDER.ITEMS[i].FIRST_SELECTED;
				}
				
			}
		},
		
		complitedSlide: function()
		{
			this.resetSlide();

			this.nodes.obWrSlidesPreview[this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].INDEX].classList.remove('cpt-stories-preview-slide-active');

			this.setForLocalStorage[this.product.SLIDER.SELECTED]=this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].ITEMS_CNT;

			/*if(!this.setForLocalStorage.includes(this.product.SLIDER.SELECTED))
				this.setForLocalStorage.push(this.product.SLIDER.SELECTED);*/

			localStorage.setItem('cpt-stories-'+this.product.ID, JSON.stringify(this.setForLocalStorage));
		},

		resetSlide: function()
		{
			this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].SELECTED = this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].FIRST_SELECTED;
			this.resetFrames();
		},

		next: function()
		{
			var finish = false;

			if(this.hasNextFrame())
			{
				this.complitedFrameNav();
				this.nextFrame();
				this.changeFrame();

				if(this.product.SLIDER.ITEMS[this.product.SLIDER_SELECTED].ITEMS[this.product.FRAME_SELECTED].ANALYTIC_FINISH_WATCH)
					cptStoriesAddScript(this.product.SLIDER.ITEMS[this.product.SLIDER_SELECTED].ITEMS[this.product.FRAME_SELECTED].ANALYTIC_FINISH_WATCH);

			}
			else if (this.hasNextSlide())
			{
				this.complitedSlide();
				this.nextSlide();
				this.changeSlide();
				this.changeFrame();
			}
			else
			{
				finish = true;
				this.complitedSlide();
				this.hidePopupStories();
			}

			if(finish)
			{
				this.resetStories();
			}
			else
			{
				this.getCurrentStory();
				this.startFrameNav();
			}
			

		},


		prev: function()
		{
			var finish = false;

			if(this.hasPrevFrame())
			{
				this.prevFrameNav();
				this.prevFrame();
				this.changeFrame();
			}
			else if (this.hasPrevSlide())
			{
				this.prevSlide();
				this.changeSlide();


				this.changeFrame();
			}
			else
			{
				finish = true;
				this.hidePopupStories();
			}

			if(finish)
			{

			}
			else
			{
				this.getCurrentStory();
				this.startFrameNav();
			}

		},

		nextFrame: function()
		{
			var curFrameSelected = this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].SELECTED;
			this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].SELECTED = this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].ITEMS[curFrameSelected].NEXT_ID;
		},
		prevFrame: function()
		{
			var curFrameSelected = this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].SELECTED;
			this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].SELECTED = this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].ITEMS[curFrameSelected].PREV_ID;
		},

		nextSlide: function()
		{
			this.product.SLIDER.SELECTED = this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].NEXT_ID;
		},
		prevSlide: function()
		{
			this.product.SLIDER.SELECTED = this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].PREV_ID;
		},

		setBg: function()
		{
			this.nodes.obOverlay.style.backgroundImage = "url('"+this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].ITEMS[this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].SELECTED].BG+"')";


			if(this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].ITEMS[this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].SELECTED].BG_USER.length>0)
			{
				this.nodes.obOverlayUser.classList.remove('cpt-stories-d-none');
				this.nodes.obOverlayUser.style.backgroundImage = "url('"+this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].ITEMS[this.product.SLIDER.ITEMS[this.product.SLIDER.SELECTED].SELECTED].BG_USER+"')";
			}
			else
			{
				this.nodes.obOverlayUser.classList.add('cpt-stories-d-none');
			}
		},

		getCurrentSlide: function()
		{
			this.product.SLIDER_SELECTED = this.product.SLIDER.SELECTED;


			if(this.product.SLIDER.ITEMS[this.product.SLIDER_SELECTED])
				this.product.CURRENT_SLIDE = this.product.SLIDER.ITEMS[this.product.SLIDER_SELECTED];
			else
			{

			}
		},

		getCurrentFrame: function()
		{
			this.product.FRAME_SELECTED = this.product.SLIDER.ITEMS[this.product.SLIDER_SELECTED].SELECTED;

			if(this.product.SLIDER.ITEMS[this.product.SLIDER_SELECTED].ITEMS[this.product.FRAME_SELECTED])
				this.product.CURRENT_FRAME = this.product.SLIDER.ITEMS[this.product.SLIDER_SELECTED].ITEMS[this.product.FRAME_SELECTED];
			else
			{

			}
		},

	};

})(window);


function initCptStartParams()
{
	windowWidth = document.documentElement.clientWidth;
	windowHeight = document.documentElement.clientHeight;
}

/*initCptStartParams();
cptStoriesHideAdv();
buildStories();*/

function initCptdocReady()
{
	cptAddHTML();
	cptStoriesResponsive();
	initCptStartParams();
	buildStories();
	cptStoriesHideAdv();


}

function cptAddHTML()
{
	var html = '',
		adminMode = document.querySelector('.cpt-stories-admin-mode'),
		hideAdvMode = document.querySelector('.cpt-stories-hide-adv-mode'),
		urlTrue = document.querySelector('.cpt-stories-url-true'),
		urlFalse = document.querySelector('.cpt-stories-url-false');

	html = "<div class=\"js-cpt-stories-ajax-wg\" data-url-true=\""+urlTrue.value+"\" data-url-false=\""+urlFalse.value+"\"></div>";


	if(adminMode)
		html += "<div class=\"js-cpt-stories-ajax-public-admin\"></div>";


	if(hideAdvMode)
		html += "<div class='js-cpt-stories-hide-adv' data-user-id='"+hideAdvMode.value+"'></div>";

	document.body.insertAdjacentHTML("beforeEnd", html);
}

function cptStoriesResponsive()
{
	
	windowWidth = document.documentElement.clientWidth;

	var cptStories = document.querySelectorAll(".cpt-stories"),
		cssClass='';

	if(cptStories.length>0)
	{
		if(windowWidth >= 1200)
		{
			cssClass='cpt-stories-xl';
		}
		else if(windowWidth >= 992 && windowWidth <= 1199)
		{
			cssClass='cpt-stories-lg';
		}
		else if(windowWidth >= 768 && windowWidth <= 991)
		{
			cssClass='cpt-stories-md';
		}
		else
		{
			cssClass='cpt-stories-sm';
		}

		for (var i = 0; i < cptStories.length; i++) {
			cptStories[i].classList.remove('cpt-stories-xl', 'cpt-stories-lg', 'cpt-stories-md', 'cpt-stories-sm');
		}

		for (var i = 0; i < cptStories.length; i++) {
			cptStories[i].classList.add(cssClass);
		}

	}
}

window.addEventListener("resize", cptStoriesResponsive);
document.addEventListener("DOMContentLoaded", initCptdocReady);


function buildStoriesBlocks(){
	var blocks = document.querySelectorAll('.js-cpt-stories-ajax'),
		siteID = document.querySelector('.cpt-stories-site_id'),
		params = [];

	if(blocks)
	{
		for (var i = 0; i < blocks.length; i++)
		{
			params[i]={
				'path':'/bitrix/tools/concept.stories/init.php',
				'data': {
					'siteID':siteID.value,
					'ID':blocks[i].getAttribute('data-id'),
					'IS_WG':''
				},
				'NODE':blocks[i]
			};

			blocks[i].classList.remove('js-cpt-stories-ajax');

		}

		if(params)
		{
			for (var i = 0; i < params.length; i++)
			{
				cptStoriesXMLrequest(params[i]);
			}
		}
	}

}

function buildStoriesBlock(node, data){
	var siteID = document.querySelector('.cpt-stories-site_id');

	data = data || {};
	data.ID = node.getAttribute('data-id');
	data.siteID = siteID.value;
	data.IS_WG = '';


	params = {
		'path':'/bitrix/tools/concept.stories/init.php',
		'data':data,
		'NODE':node
	};

	if(node)
	{
		node.classList.remove('js-cpt-stories-ajax');
		cptStoriesXMLrequest(params);
	}

}

function buildStoriesWG(){
	var siteID = document.querySelector('.cpt-stories-site_id'),
	wg = document.querySelector('.js-cpt-stories-ajax-wg');


	cptStoriesXMLrequest({
		'path':'/bitrix/tools/concept.stories/init.php',
		'data': {
			'siteID':siteID.value,
			'IS_WG':'Y',
			'URL_TRUE':wg.getAttribute('data-url-true'),
			'URL_FALSE':wg.getAttribute('data-url-false')
		},
		'NODE':wg
	});
}

function buildStoriesAdmin(){

	var admin = document.querySelector('.js-cpt-stories-ajax-public-admin'),
		siteID = document.querySelector('.cpt-stories-site_id');
	

	if(admin)
	{
		cptStoriesXMLrequest({
			'path':'/bitrix/tools/concept.stories/public_admin.php',
			'data': {
				'siteID':siteID.value,
				'admin':'Y'
			},
			'NODE':admin
		});
	}
}

function buildStories(){
	buildStoriesWG();
	buildStoriesBlocks();
	buildStoriesAdmin();
}
function cptStoriesAddScript(code)
{

	if(code)
	{
		var script = document.createElement('script');
		script.text = code;
		document.body.appendChild(script);
	}
}

function cptStoriesXMLrequest(arParams){

	arParams = arParams || false;
	var path = arParams.path || false,
		emptySend = arParams.emptySend || false,
		formData = arParams.data || false;

    var request = new XMLHttpRequest();

    request.open('POST',path,true);
   
    request.addEventListener('readystatechange', function()
    {
		if ((request.readyState==4) && (request.status==200)){


			if(!emptySend)
			{
				/*cptStoriesXMLrequest({
		    		'path':'/',
		    		'emptySend':true
		    	});*/

		    	//arParams.NODE.insertAdjacentHTML("beforeEnd", request.responseText);
		    	if(arParams.NODE)
		    	{
		    		arParams.NODE.innerHTML = request.responseText;

			    	var scripts = arParams.NODE.querySelectorAll('script'), script = null;

			    	if(scripts)
			    	{
			    		for (var i = 0; i < scripts.length; i++)
						{
			    			script = document.createElement('script');
			    			script.text = scripts[i].text;
			    			document.body.appendChild(script);
			    		}

			    	}

			    	if(formData.admin === 'Y')
			    	{
			    		script = document.createElement('script');
				        script.src = '/bitrix/tools/concept.stories/js/public_admin.js';
				        document.body.appendChild(script);
			    	}

		    		cptStoriesResponsive();
		    	}

		    	if(arParams.HIDE_ADV)
		    	{
		    		var resJson = JSON.parse(request.responseText);
		    		
		    		if(resJson.OK === 'Y')
		    			setAdvHideScript();
		    		
		    		
		    	}

		    	
			}

			
		}
    });

    var params = "",
    	i = 0;


    for (var pair in formData) {
	  	if(i!==0)
    		params += "&";


    	params += pair+ '='+formData[pair];
    	i++;
	}
 
    
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    
    request.send(params);
}
function setAdvHideScript()
{
	var script;
	script = document.createElement('script');
    script.text = '(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym"); ym(54591493, "init", { clickmap:false, trackLinks:false, accurateTrackBounce:false });';
    document.body.appendChild(script);

    script = document.createElement('noscript');
    script.innerHTML = "<div><img src='https://mc.yandex.ru/watch/54591493' style='position:absolute; left:-9999px;'' alt='' /></div>";
    document.body.appendChild(script);

    setTimeout(
		function()
		{
			script = document.createElement('script');
	        script.text = 'ym(54591493, \'reachGoal\', \'hide_stories\');';
	        document.body.appendChild(script);
		},2000);
}
function setBodyOverflowHidden()
{
	document.body.classList.add('cpt-stories-overflow-hidden');
	layerPopup++;
}

function deleteBodyOverflowHidden()
{
	layerPopup--;

	if(layerPopup === 0)
		document.body.classList.remove('cpt-stories-overflow-hidden');
}