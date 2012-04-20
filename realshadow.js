/*! Real Shadow | https://github.com/Indamix/real-shadow */

var shadows = (function(undefined){
	var shadows = function($els, options){
			init($els, options);
			// TODO add fn(height) to pass shape form
		},
		settings,
		pi = Math.PI,
		els = [];

	function init($els, options){
		settings = $.extend({}, options, settings);
		if (!els.length) $(document.body).mousemove(frame);
		add($els);
		frame({
			pageX: settings.pageX !== undefined ? settings.pageX : $(window).width() >> 1,
			pageY: settings.pageY !== undefined ? settings.pageY : 0
		});
	}

	function add($els){
		$.each($els, function(i, el){
			var $el = $(el),
				offset = $el.offset(),
				p = {
					dom: el,
					x: offset.left + ($el.outerWidth()  >> 1),
					y: offset.top  + ($el.outerHeight() >> 1)
				},
				c = $(el).attr('rel');

			if (c)
				p.c = {
					r: c.indexOf('r') !== -1,
					g: c.indexOf('g') !== -1,
					b: c.indexOf('b') !== -1
				}
			else
				if (settings.c) p.c = settings.c;

			els.push(p);

		})
		// log('els',els)
	}

	function castShadows(el, angle, n, height){
		height = height || 7;
		// n = n || 2;
		var shadows = [],
			cos = Math.cos(angle),
			sin = Math.sin(angle),
			r;
		for (var i = 0; i < height; ++i) {
			r = Math.pow(i, n);
			// TODO      add ---^ + shadow distance
			shadows.push(
				( r * sin >> 0 ) + 'px '  +
				( r * cos >> 0 ) + 'px '  +
				( Math.pow(i, 1.7) >> 0 ) +
				'px rgba(' +
				(el.c ?
					(el.c.r ? 100 : 0) + ',' +
					(el.c.g ? 100 : 0) + ',' +
					(el.c.b ? 100 : 0) + ','
				:
					'0,0,0,'
				) +
				'.05)'
			);
		}

		el.dom.style.boxShadow = shadows.join(',');
	}

	var params = {
		nMax: 2.3,
		pow: .8,
		div: 1500
	}

	function frame(e){
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
				n
			);
		}
	}

	shadows.frame=frame;

	return shadows;

})();