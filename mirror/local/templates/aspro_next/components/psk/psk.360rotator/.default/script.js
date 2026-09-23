(function (window) {
	'use strict';
	if (window.psk_360_rotator) {
		return;
	}
	window.psk_360_rotator = function (arParams) {
		
		this.errorCode = 0;
		this.options = {};
		this.options.showStartStopButton = arParams.showStartStopButton || false;
		this.options.scroll = arParams.scroll || false;
		this.options.vertical = arParams.vertical || false;
		this.options.cycle = arParams.cycle==false?false:true;
		this.options.start = arParams.start || 0;
		this.options.speed = arParams.speed || 50;
		this.options.areaId = arParams.areaId  || false;
		
		this.options.element = arParams.element || undefined;
		this.autoplay = arParams.autoplay || false;
		this.options.playSpeed = arParams.playSpeed || 100;
		this.options.sensitivity = ((0<arParams.sensitivity)&&(arParams.sensitivity<1000))?arParams.sensitivity:100;
		this.counter = 0;
		if (0 === this.errorCode) {
			this.Init();
		}
	};
	window.psk_360_rotator.prototype = {
		'Init' : function () {
			this.el = document.getElementById(this.options.element);
			
			this.loader = document.createElement('div');
			this.loader.className = 'psk_360_loader';
			this.el.appendChild(this.loader);
			
			this.calcLength()
			
			this.movable = false;
			this.loaded = [];
			this.errored = [];
			this.erroredID = [];
			
			this.callbacks = {
				'ready':undefined,
				//'ready':function(e,b){console.log(e);console.log(b),console.log('ready')},
				'change':undefined,
			};
			this.scrollEvents = [
				'wheel',
				'mousewheel',
				'scroll',
				'DOMMouseScroll'
			];
			this.loadImages();
		},
		'calcLength':function(){
			this.length = this.el.getElementsByTagName('img').length;
			if(this.length<1){
				console.log('psk_360_rotator: no images, unable to start');
				return false;
			}
			if(this.options.start>this.length){
				this.options.start=this.length-1;
			}
			this.pre   = {
				'Y':null,
				'X':null,
				'frame':this.options.start?this.options.start:0
			};
		},
		'onEventListener':function(target, event, fn){
			if (target.addEventListener) {
				target.addEventListener(event, fn, false);
			}else{
				target.attachEvent('on' + event, function() {
					fn.call(target, window.event);
				});
			}
		},
		'preMove':function(e){
			if (this.startStop == e.target) {
				return;
			}
			this.stop();
			e.preventDefault();
			e = e.type === 'touchstart' ? e.changedTouches[0] : e;
			this.movable = true;
			if(this.options.vertical){
				this.pre.Y = e.clientY - this.el.offsetTop;
			}else{
				this.pre.X = e.clientX - this.el.offsetLeft;
			}
		},
		'normalize':function(cur){
			if (cur < 0) {
				cur = this.options.cycle ? (cur % this.length)+this.length : 0;
			}else if (cur > this.length - 1) {
				cur = this.options.cycle ? (cur % this.length) : this.length - 1;
			}
			return cur;
		},
		'isMove':function(e){
			if (this.startStop == e.target) {
				return;
			}
			if (this.movable) {
				e.preventDefault();
				e = e.type === 'touchmove' ? e.changedTouches[0] : e;
				this.offset = (this.options.vertical) ? ((e.clientY - this.el.offsetTop) - this.pre.Y) : ((e.clientX - this.el.offsetLeft) - this.pre.X);
				this.step = this.width / this.length/(this.options.sensitivity/100);
				this.previous = this.current;
				this.offset = Math.floor(this.offset / this.step);
				//if (this.offset !== this.current) {
					this.current = this.normalize(this.pre.frame + this.offset);
					//if (this.previous !== this.current) {
						this.el.getElementsByTagName('img')[this.previous].style.display = 'none';
						this.el.getElementsByTagName('img')[this.current].style.display = 'block';

						if (typeof this.callbacks.change === 'function') {
							this.callbacks.change(this.current, this.length);
						}
					//}
				//}
			}
		},
		'stopMove':function(e){
			if (this.startStop == e.target) {
				return;
			}
			e.preventDefault(e);
			this.movable = false;
			this.pre.frame = this.current;
		},
		'scrollMove':function(e){
			if (this.startStop == e.target) {
				return;
			}
			this.stop();
			e.preventDefault();
			var delta = e.deltaY || e.detail || (-e.wheelDelta);
			delta = delta / Math.abs(delta);
			this.current = this.normalize(this.current + delta);
			this.el.getElementsByTagName('img')[this.pre.frame].style.display = 'none';
			this.el.getElementsByTagName('img')[this.current].style.display = 'block';
			this.pre.frame = this.current;
			if (typeof this.callbacks.change === 'function') {
				this.callbacks.change(this.current, this.length);
			}
		},
		'initEvents':function(){
			if (this.loader) {
				this.loader.style.display = 'none';
			}
			if (this.errored.length > 0) {
				console.log('psk_360_rotator: these files are not found')
				console.log(this.errored)
			}
			var start = this.normalize(this.options.start);
			this.el.getElementsByTagName('img')[start].style.display = 'block';
			this.current = start;
			if ('ontouchstart' in window || navigator.msMaxTouchPoints) {
				//if (this.options.mouse || this.options.scroll) {
					this.onEventListener(this.el, 'touchstart', this.preMove.bind(this));
					this.onEventListener(this.el, 'touchmove', this.isMove.bind(this));
					this.onEventListener(this.el, 'touchend', this.stopMove.bind(this));
				//}
			} else {
				//if (this.options.mouse) {
					this.onEventListener(this.el, 'mousedown', this.preMove.bind(this));
					this.onEventListener(this.el, 'mousemove', this.isMove.bind(this));
					this.onEventListener(document, 'mouseup', this.stopMove.bind(this));
				//}
				if (this.options.scroll) {
					for (var e = 0; e < this.scrollEvents.length; e++) {
						if ('on' + this.scrollEvents[e] in window) {
							this.onEventListener(this.el, this.scrollEvents[e], (this.scrollMove).bind(this));
							break;
						}
					}
				}
			}
			if(this.options.showStartStopButton){
				this.startStop = document.createElement('div');
				this.startStop.className = this.startStop.className+" psk_360_startStop";
				
				this.el.appendChild(this.startStop);
				this.startStop.addEventListener("click", this.clickStartStop.bind(this))
			}
			if (this.autoplay) {
				if(this.startStop){
					this.startStop.className = this.startStop.className+" psk_360_startStop_play";
				}
				this.turnInterval();
			}
			if (typeof this.callbacks.ready === 'function') {
				this.callbacks.ready(this.errored);
			}
			
		},
		'loadImagesEvents':function () {
			this.img.onload = function(e) {
				this.loaded.push(e.target.src);
				this.allImagesLoaded();
			}.bind(this);
			this.img.onerror = function(e) {
				this.errored.push(e.target.src);
				this.el.removeChild(e.target);
				this.allImagesLoaded();
			}.bind(this);

		},
		'allImagesLoaded':function(){
			this.counter++;
			if ( this.counter === this.length ) {
				if(this.calcLength()!=false){
					this.initEvents()
					this.width  = this.width || this.el.clientWidth;
				}
			}
		},
		'loadImages':function () {
			if (this.loader) {
				this.loader.style.display = 'block';
			}
			for (var i = 0; i < this.length; i++) {
				this.img = this.el.getElementsByTagName('img')[i];
				this.img.setAttribute('src', this.img.getAttribute('data-src'));
				this.img.removeAttribute('data-src');
				this.loadImagesEvents();
			}
		},
		'setFrame':function (i) {
			this.el.getElementsByTagName('img')[this.current].style.display = 'none';
			this.el.getElementsByTagName('img')[i].style.display = 'block';
			this.pre.frame = this.current = i;
		},
		'turnInterval':function() {
			if (this.autoplay) {
				this.setFrame(this.normalize(this.current+1));
				setTimeout(this.turnInterval.bind(this), this.options.playSpeed);
			}
		},
		'go':function(i) {
			if (i !== this.current) {
				this.setFrame(i);
				if (typeof this.callbacks.change === 'function') {
					this.callbacks.change(current, length);
				}
			}
		},
		'clickStartStop':function() {
			if(this.autoplay){
				this.stop()
			}else{
				this.play()
			}
		},
		'play':function() {
			if(this.autoplay == false){
				this.autoplay = true;
				if(this.startStop){
					this.startStop.className = this.startStop.className+" psk_360_startStop_play";
				}
				this.turnInterval();
			}
		},
		'stop':function() {
			if(this.startStop){
				this.removeClass(this.startStop,'psk_360_startStop_play')
			}
			this.autoplay = false;
		},
		'removeClass':function(elem,cls) {
			var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
			elem.className=elem.className.replace(reg,'');
		},
	}
})(window);