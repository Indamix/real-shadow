/*!
 * Real Shadow v1.2.1
 * https://github.com/Indamix/real-shadow
 *
 * Copyright 2012, Ivan Indamix
 * Licensed under the MIT license
 * https://raw.github.com/Indamix/real-shadow/master/license.txt
 */
(function(window, undefined) {

    var settings = {
            followMouse: true,
            length: 7
        },
        nMax = 2.3,
        power = .8,
        k = 1 / 1500,
        pi = Math.PI,
        els = [],
        exported = false;

    if (typeof window.jQuery === 'function') {
        $.fn.realshadow = init;
        $.fn.realshadow.update = update;
        exported = true;
    }

    if (typeof define !== 'undefined' && define.amd) {
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

    function init(elements, options) {
        if (this !== window) {
            options = elements;
            elements = this;
        }

        for (var i in options) {
            settings[i] = options[i];
        }

        if (!els.length) {
            if (settings.followMouse) {
                document.body.addEventListener('mousemove', frame);
            }
            window.addEventListener('resize', update);
        }

        for (i = 0; i < elements.length; ++i) add(elements[i]);
        frame();
        return elements;
    }

    function add(el) {
        var c = el.getAttribute('rel'),
            p = {
                dom: el,
                x: el.offsetLeft + (el.clientWidth  >> 1),
                y: el.offsetTop  + (el.clientHeight >> 1)
            };

        if (c) {
            p.c = {
                r: c.indexOf('r') !== -1,
                g: c.indexOf('g') !== -1,
                b: c.indexOf('b') !== -1
            };
        } else {
            if (settings.c) p.c = settings.c;
        }

        p.inset = settings.inset ? 'inset' : '';
        p.inverse = settings.inverse ? -1 : 1;

        els.push(p);
    }

    init.reset = function () {
        els = [];
        document.body.removeEventListener('mousemove', frame);
        window.removeEventListener('resize', update);
    };

    function update() {
        var i = els.length,
            el, $el;

        while (i--) {
            el = els[i];
            $el = el.dom;
            el.x = $el.offsetLeft + ($el.clientWidth  >> 1);
            el.y = $el.offsetTop  + ($el.clientHeight >> 1);
        }

        frame();
    }

    function castShadows(el, angle, n, length) {
        var shadows = new Array(length - 1),
            cos = Math.cos(angle),
            sin = Math.sin(angle),
            r;

        for (var i = 1; i < length; ++i) {
            r = Math.pow(i, n) * el.inverse;
            shadows[i - 1] =
                ( r * sin | 0 ) + 'px '  +
                ( r * cos | 0 ) + 'px '  +
                ( Math.pow(i, 1.7) | 0 ) +
                'px rgba(' +
                    (el.c ?
                        (el.c.r ? 100 : 0) + ',' +
                        (el.c.g ? 100 : 0) + ',' +
                        (el.c.b ? 100 : 0) + ','
                    :
                        '0,0,0,'
                    ) +
                '.05)' + el.inset;
        }

        el.dom.style.boxShadow = shadows.join(',');
    }

    function frame(e) {
        if (e === undefined) e = {
            pageX: settings.pageX !== undefined ? settings.pageX : window.innerWidth >> 1,
            pageY: settings.pageY !== undefined ? settings.pageY : 0
        };

        var i = els.length,
            el;

        while (i--) {
            el = els[i];

            var x = e.pageX - el.x,
                y = e.pageY - el.y,
                n = Math.pow(x * x + y * y, power) * k + 1;

            if (n > nMax) n = nMax;

            castShadows(
                el,
                Math.atan2(x, y) - pi,
                n,
                settings.length
            );
        }
    }

})(this);