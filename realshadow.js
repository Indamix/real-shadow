/*!
 * Real Shadow v1.3.4
 * http://indamix.github.io/real-shadow
 *
 * (c) 2012-2014 Ivan Indamix
 * Licensed under the MIT license
 * https://raw.github.com/Indamix/real-shadow/master/license.txt
 */
(function(window, undefined) {
  'use strict';

  var nMax = 2.3,
      power = .8,
      k = 1 / 1500,
      pi = Math.PI,
      els = [],
      hasMoveListener, isFilterSupported;

  function init(elements, options) {
    if (this !== window && this !== undefined) {
      options = elements;
      elements = this;
    }

    options = options || {};
    for (var i = 0; i < elements.length; ++i) add(elements[i], options);

    if (!hasMoveListener) {
      if (options.followMouse !== false && options.angle === undefined) {
        document.body.addEventListener('mousemove', init.frame);
        hasMoveListener = true;
      }
      window.addEventListener('resize', init.update);
    }
    init.frame();

    return elements;
  }

  function add(el, settings) {
    var center = getCenter(el);
    el = {
      node   : el,
      x      : center.x,
      y      : center.y,
      c      : el.getAttribute('data-shadow-color') || settings.color,
      inset  : settings.inset ? 'inset' : '',
      inverse: settings.inverse ? -1 : 1
    };

    if (settings.angle !== undefined) {
      el.angle = settings.angle;
    } else {
      if (settings.pageX !== undefined) el.pageX = settings.pageX;
      if (settings.pageY !== undefined) el.pageY = settings.pageY;
    }
    el.type = settings.type;
    if (settings.type === 'drop') {
      if (isFilterSupported === undefined) {
        isFilterSupported = hasFilterSupport('webkit');
      }
      el.length  = settings.length  || 4;
      el.opacity = settings.opacity || .2;
    } else {
      el.length  = settings.length  || 7;
      el.opacity = settings.opacity || .05;
    }
    if (settings.style === 'flat') {
      el.style   = settings.style;
      el.length  = settings.length  || 40;
      el.opacity = settings.opacity || 1;
    }

    els.push(el);
  }

  init.reset = function () {
    els = [];
    document.body.removeEventListener('mousemove', init.frame);
    window.removeEventListener('resize', init.update);
    hasMoveListener = false;
  };

  init.update = function () {
    var i = els.length,
        el;
    while (i--) {
      el = els[i];
      var center = getCenter(el.node);
      el.x = center.x;
      el.y = center.y;
    }

    init.frame();
  };

  init.frame = function (e) {
    if (!e) e = {
      pageX: window.innerWidth >> 1,
      pageY: 0
    };
    var i = els.length,
        el;

    while (i--) {
      el = els[i];

      var x = (el.pageX === undefined ? e.pageX : el.pageX) - el.x,
          y = (el.pageY === undefined ? e.pageY : el.pageY) - el.y,
          n = Math.pow(x * x + y * y, power) * k + 1;

      if (n > nMax) n = nMax;

      if (el.type === 'drop' && !isFilterSupported) {
        renderSVG(el, x, y, n);
      } else {
        render(el, el.angle === undefined ? Math.atan2(x, y) - pi : el.angle, n);
      }
    }
  };

  function render(el, angle, n) {
    var shadows = new Array(el.length - 1),
        cos = Math.cos(angle),
        sin = Math.sin(angle),
        r;

    for (var i = 1; i < el.length; ++i) {
      r = ( el.style === 'flat' ? i : Math.pow(i, n) ) * el.inverse;
      shadows[i - 1] =
        ( r * sin | 0 ) + 'px '  +
        ( r * cos | 0 ) + 'px '  +
        ( el.style === 'flat' ? 0 : Math.pow(i, 1.7) | 0 ) +
        'px rgba(' + (el.c || '0,0,0') + ',' + el.opacity + ')' +
        el.inset;
    }

    if (el.type === 'drop') {
      el.node.style.webkitFilter = 'drop-shadow(' + shadows.join(') drop-shadow(') + ')';
    } else {
      el.node.style[el.type === 'text' ? 'textShadow' : 'boxShadow'] = shadows.join(',');
    }
  }

  function renderSVG(el, x, y, n) {
    if (!el.filter) {
      var id = 'real-shadow-' + Math.random().toString(36).substr(2),
          d = new DOMParser().parseFromString(svgTpl(id), 'application/xml');

      el.filter = {
        offset: d.getElementsByTagName('feOffset')[0],
        blur  : d.getElementsByTagName('feGaussianBlur')[0],
        color : d.getElementsByTagName('feFlood')[0]
      };

      document.body.appendChild(d.children[0]);
      el.node.style.filter = 'url(#' + id + ')';
    }

    el.filter.offset.setAttribute('dx', dist(x));
    el.filter.offset.setAttribute('dy', dist(y));
    el.filter.blur.setAttribute('stdDeviation', n * 2);
    el.filter.color.setAttribute('flood-color', 'rgba(0,0,0,' + (.6 - n / 8) + ')');
  }

  function svgTpl(id) {
    return (
    '<svg height="0" xmlns="http://www.w3.org/2000/svg">' +
      '<filter id="' + id + '">' +
        '<feGaussianBlur in="SourceAlpha"/>' +
        '<feOffset result="b"/>' +
        '<feFlood/>' +
        '<feComposite in2="b" operator="in"/>' +
        '<feMerge>' +
          '<feMergeNode/>' +
          '<feMergeNode in="SourceGraphic"/>' +
        '</feMerge>' +
      '</filter>' +
    '</svg>'
    );
  }

  function dist(t) {
    var sign = t === 0 ? 0 : t < 0 ? 1 : -1;
    return sign * Math.pow(Math.abs(t), 1 / 3);
  }

  function hasFilterSupport(prefix) {
    prefix = prefix ? '-' + prefix + '-' : '';
    var el = document.createElement('div');
    el.style.cssText = prefix + 'filter:drop-shadow(0 0 0 #000)';
    return el.style.length > 0;
  }

  function getCenter(el) {
    var x = el.clientWidth  >> 1,
        y = el.clientHeight >> 1;
    do {
      x += el.offsetLeft;
      y += el.offsetTop;
    } while (el = el.offsetParent);
    return {x: x, y: y};
  }


  var exported = false;

  if (typeof window.jQuery === 'function') {
    $.fn.realshadow = init;
    exported = true;
  }

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return init;
    });
    exported = true;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = init;
    exported = true;
  }

  if (!exported) {
    window.realshadow = init;
  }

})(window);