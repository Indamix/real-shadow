/*!
 * Real Shadow v1.4.1
 * http://indamix.github.io/real-shadow
 *
 * (c) 2012-2015 Ivan Indamix
 * Licensed under the MIT license
 * https://raw.github.com/Indamix/real-shadow/master/license.txt
 */
(function(window, undefined) {
  'use strict';

  var SHAPES = {
    DEFAULT: {
      length: 7,
      opacity: .05
    },

    DROP: {
      length: 4,
      opacity: .2
    },

    FLAT: {
      length: 40,
      opacity: 1
    }
  };

  var nMax = 2.3,
      power = .8,
      k = 1 / 1500,
      pi = Math.PI,
      els = [],
      hasMoveListener;

  function api(nodes, options) {
    if (this !== window && this !== undefined) {
      options = nodes;
      nodes = this;
    }

    var config = getConfig(options);

    for (var i = 0; i < nodes.length; ++i) {
      els.push(createElement(nodes[i], config));
    }

    if (!hasMoveListener) {
      if (config.followMouse !== false && config.angle === undefined) {
        document.body.addEventListener('mousemove', api.frame);
        hasMoveListener = true;
      }
      window.addEventListener('resize', api.update);
    }

    api.frame();

    return nodes;
  }

  function getConfig(options) {
    options = options || {};

    var shape =
        options.style === 'flat' ? SHAPES.FLAT :
        options.type  === 'drop' ? SHAPES.DROP : SHAPES.DEFAULT;

    var normalization = {
      inset  : options.inset ? 'inset' : '',
      inverse: options.inverse ? -1 : 1
    };

    return assign({}, options, shape, normalization);
  }

  function createElement(node, options) {
    return assign({
      node: node,
      color: node.getAttribute('data-shadow-color') || '0,0,0'
    }, getCenter(node), options);
  }

  api.reset = function () {
    els = [];
    document.body.removeEventListener('mousemove', api.frame);
    window.removeEventListener('resize', api.update);
    hasMoveListener = false;
  };

  api.update = function () {
    var i = els.length,
        el;
    while (i--) {
      el = els[i];
      assign(el, getCenter(el.node));
    }

    api.frame();
  };

  api.frame = function (event) {
    if (!event) {
      event = {
        pageX: window.innerWidth >> 1,
        pageY: 0
      };
    }

    var i = els.length,
        el;
    while (i--) {
      el = els[i];

      var x = (el.pageX === undefined ? event.pageX : el.pageX) - el.x,
          y = (el.pageY === undefined ? event.pageY : el.pageY) - el.y,
          n = Math.pow(x * x + y * y, power) * k + 1;

      if (n > nMax) n = nMax;

      render(el, el.angle === undefined ? Math.atan2(x, y) - pi : el.angle, n);
    }
  };

  function render(el, angle, n) {
    var shadows = new Array(el.length - 1),
        dx = Math.sin(angle),
        dy = Math.cos(angle),
        r;

    for (var i = 1; i < el.length; ++i) {
      r = ( el.style === 'flat' ? i : Math.pow(i, n) ) * el.inverse;
      shadows[i - 1] =
        ( r * dx | 0 ) + 'px '  +
        ( r * dy | 0 ) + 'px '  +
        ( el.style === 'flat' ? 0 : Math.pow(i, 1.7) | 0 ) +
        'px rgba(' + el.color + ',' + el.opacity + ')' +
        el.inset;
    }

    if (el.type === 'drop') {
      el.node.style.filter =
      el.node.style.webkitFilter = 'drop-shadow(' + shadows.join(') drop-shadow(') + ')';
    } else {
      el.node.style[el.type === 'text' ? 'textShadow' : 'boxShadow'] = shadows.join(',');
    }
  }

  /*
   * Utils
   */

  function getCenter(el) {
    var x = el.clientWidth  >> 1,
        y = el.clientHeight >> 1;
    do {
      x += el.offsetLeft;
      y += el.offsetTop;
    } while (el = el.offsetParent);
    return {x: x, y: y};
  }

  var assign = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
    return target;
  };

  /*
   * Exporting
   */

  var exported = false;

  if (typeof window.jQuery === 'function') {
    $.fn.realshadow = api;
    exported = true;
  }

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return api;
    });
    exported = true;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
    exported = true;
  }

  if (!exported) {
    window.realshadow = api;
  }

})(window);