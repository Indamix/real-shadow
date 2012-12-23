/*!
 * Real Shadow v1.1.2
 * https://github.com/Indamix/real-shadow
 *
 * Copyright 2012, Ivan Indamix
 * Licensed under the MIT license
 * https://raw.github.com/Indamix/real-shadow/master/license.txt
 */
(function($, window, undefined){

	// TODO add fn(height) to pass shape form
	var settings = {
			followMouse: true,
			length: 7,
			intensity: 100
		},
		$window = $(window),
		pi = Math.PI,
		els = [];

	$.fn.realshadow = function(options){
		$.extend(settings, options);
		if (!els.length && settings.followMouse) $(document.body).mousemove(frame);
		$window.resize(update);
		$.each(this, add);
		frame();
		return this;
	};

	$.fn.realshadow.update = update;

	function add(i, el){
		var $el = $(el),
			offset = $el.offset(),
			c = $el.attr('rel'),
			p = {
				dom: el,
				x: offset.left + ($el.outerWidth () >> 1),
				y: offset.top  + ($el.outerHeight() >> 1)
			};

		if (c)
			p.c = {
				r: c.indexOf('r') !== -1,
				g: c.indexOf('g') !== -1,
				b: c.indexOf('b') !== -1
			}
		else
			if (settings.c) p.c = settings.c;

		p.inset = settings.inset ? 'inset' : '';

		els.push(p);
	}

	function update(){
		var i = els.length,
			offset, el, $el;

		while (i--) {
			el = els[i];
			$el = $(el.dom);
			offset = $el.offset();
			el.x = offset.left + ($el.outerWidth () >> 1);
			el.y = offset.top  + ($el.outerHeight() >> 1);
		}

		frame();
	}

	function castShadows(el, angle, n, length){
		var shadows = [],
			cos = Math.cos(angle),
			sin = Math.sin(angle),
			r;
		for (var i = 1; i < length; ++i) {
			r = Math.pow(i, n);
			// TODO      add ---^ + shadow distance
			shadows.push(
				( r * sin >> 0 ) + 'px '  +
				( r * cos >> 0 ) + 'px '  +
				( Math.pow(i, 1.7) >> 0 ) +
				'px rgba(' +
				(el.c ?
					(el.c.r ? ( intensity * (el.c.r / 256 )) : 0) + ',' +
					(el.c.g ? ( intensity * (el.c.g / 256 ) : 0) + ',' +
					(el.c.b ? ( intensity * (el.c.b / 256 ) : 0) + ','
				:
					'0,0,0,'
				) +
				'.05)' + el.inset
			);
		}

		el.dom.style.boxShadow = shadows.join(',');
	}

	var params = {
		nMax: 2.3,
		pow: .8,
		div: 1500
	};

	function frame(e){
		if (e === undefined) e = {
			pageX: settings.pageX !== undefined ? settings.pageX : $window.width() >> 1,
			pageY: settings.pageY !== undefined ? settings.pageY : 0
		};

		var i = els.length,
			el;

		while (i--) {
			el = els[i];

			var x = e.pageX - els[i].x,
				y = e.pageY - els[i].y,
				n = Math.pow(x * x + y * y, params.pow)
			n = n / params.div + 1; // TODO n = f(obj.size, distance)

			if (n > params.nMax) n = params.nMax;

			castShadows(
				el,
				Math.atan2(x, y) - pi,
				n,
				settings.length
			);
		}
	}

})(jQuery, this);
