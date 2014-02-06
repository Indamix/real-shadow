/*
 * This 'app' has been quickly built only to demonstrate the features of Real Shadow
 * To explore the well-structured apps, check out CoreJS http://corejs.github.io/
 */

// rAF polyfill
(function (w) {
  var lastTime = 0,
      vendors = ['webkit', 'moz'];
  for (var x = 0; x < vendors.length && !w.requestAnimationFrame; ++x) {
    w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame'];
    w.cancelAnimationFrame = w[vendors[x] + 'CancelAnimationFrame'] || w[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!w.requestAnimationFrame)
    w.requestAnimationFrame = function (callback) {
      var currTime = new Date().getTime(),
          timeToCall = Math.max(0, 16 - (currTime - lastTime)),
          id = w.setTimeout(function () {
            callback(currTime + timeToCall);
          },
          timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!w.cancelAnimationFrame)
    w.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
}(window));

(function () {

  var box = function () {

    var shapes = ['rect', 'circle', 'round', 'ur', 'll'],
        colors = ['0,0,70', '100,0,0', '0,100,0', '0,0,100', '100,100,100', '100,100,0', '0,100,100', '100,0,100'],
        colorRe = /100/g,
        size = 6,
        html = '',
        options = {
          inset: false,
          inverse: false
        },
        i, j;

    for (i = 0; i < size; ++i) {
      html += '<p>';
      for (j = 0; j < size; ++j)
        html += '<span data-shadow-color="' +
          colors[(i * size + j) % colors.length] +
          '" class="realshadow block ' +
          shapes[(i * size + j) % shapes.length] +
          '" style="background:rgba(' +
          colors[(i * size + j) % colors.length].replace(colorRe, '255') +
        ',.5)"></span>';
      html += '</p>';
    }

    for (i in options) {
      if (location.hash.indexOf(i) !== -1) options[i] = true;
    }

    $container.innerHTML =
      '<div class="sub nav">' +
        '<label>' +
          '<input type="checkbox" id="inset"' + (options.inset ? ' checked' : '') + '/>' +
          'Inset Shadows' +
        '</label>' +
        '<label>' +
          '<input type="checkbox" id="inverse"' + (options.inverse ? ' checked' : '') + '/>' +
          'Inverse Direction' +
        '</label>' +
      '</div>' +
      '<div class="wrapper">' + html + '</div>' +
      '<a class="big" href="http://corejs.github.io/">Check my new project, CoreJS<a/>';

    document.body.addEventListener('change', function (e) {
      options[e.target.id] = e.target.checked;
      var s = '';
      for (var i in options) {
        if (options[i]) s += ',' + i;
      }
      location.hash = location.hash.replace(/\/[^/]*$/, '') + '/' + s.substr(1);
    });

    realshadow(document.getElementsByClassName('realshadow'), options);
    realshadow(document.getElementsByClassName('big'), options);

  };


  var drop = function(tab) {

    tab = tab || 'A';

    $container.innerHTML =
      '<div class="sub nav">' +
        '<a id="A"' + (tab === 'A' ? 'class="current"' : '') + '>Example A</a>' +
        '<a id="B"' + (tab === 'B' ? 'class="current"' : '') + '>Example B</a>' +
      '</div>' +
      (tab === 'A' ?
        '<div id="exampleA">' +
          '<h2>Shadows can be any shape. Any.</h2>' +
          '<p>Shadow shape repeats the element transparency</p>' +
          '<div class="tooltip"></div>' +
          '<img src="i/window.png"/>' +
          '<img src="i/phone.png"/>' +
          '<img src="i/snowflake.png"/>' +
        '</div>'
      :
        '<div id="exampleB">' +
          '<a href="http://corejs.github.io/"><img src="i/corejs.png"/></a>' +
          '<div class="top panel"></div>' +
          '<div class="right panel"></div>' +
          '<div class="bottom panel"></div>' +
          '<div class="left panel"></div>' +
        '</div>'
      ) +
      '<div id="colors"></div>';

    var $colors = document.getElementById('colors'),
        s = 'Pick a color<br/><div style="background:#fff"></div>';
    for (var i = 12; i--;) {
      s += '<div style="background:hsl(' + i * 30 + ',100%,50%)"></div>';
    }
    $colors.innerHTML = s;
    $colors.addEventListener('mouseover', function (e) {
      if (e.target.id === 'colors') return;
      document.body.style.backgroundColor = e.target.style.backgroundColor;
    });

    document.getElementsByClassName('sub')[0].addEventListener('click', function (e) {
      location.hash = location.hash.replace(/\/[^/]*$/, '') + '/' + e.target.id;
    });

    realshadow(document.getElementsByTagName('img'), {type: 'drop'});
    realshadow(document.getElementsByClassName('tooltip'), {type: 'drop'});
    realshadow(document.getElementById('colors').children, {length: 4, opacity: .1});

  };

  var text = function () {

    var text = 'The outside world is a projection, you put it there. It is not happening out there, it is happening inside your head. It is, in fact, a dream, exactly like when you fall asleep. We need to see, we need to perceive, we need to dream actively, because this is the only way we can take this huge universe and put it inside a very tiny head. We fold it, make an image, and then project it out.';

    $container.innerHTML =
      tags('h3', 'Text Shadows') +
      '<br/>' +
      '<div class="fold">' +
        '<span>' + text + '</span>' +
      '</div>' +
      tags('h4', 'WE FOLD IT');

    realshadow(document.getElementsByTagName('h3'), {type: 'text'});
    var $fold = document.getElementsByClassName('fold')[0];
    realshadow($fold.getElementsByTagName('span'), {type: 'text', opacity: .2, length: 3});
    realshadow(document.getElementsByTagName('h4'), {type: 'text', color: '100,100,0'});

  };

  var flat = function () {

    var s = 'FLAT SHADOWS';
    $container.innerHTML =
      '<div id="flat">' +
        [tags('span', s), tags('i', s), tags('b', s), tags('u', s)].join('<br/>') +
      '</div>' +
      '<div id="box">' +
        '' +
      '</div>';

    var $flat = document.getElementById('flat');
    realshadow($flat.getElementsByTagName('span'), {type: 'text', style: 'flat', length: 40, color: '255,160,0'});
    realshadow($flat.getElementsByTagName('i'), {type: 'text', style: 'flat', length: 40, color: '100,100,255'});
    realshadow($flat.getElementsByTagName('b'), {type: 'text', style: 'flat', length: 40, color: '100,200,0'});
    realshadow($flat.getElementsByTagName('u'), {type: 'text', style: 'flat', length: 40, color: '255,100,100'});

  };

  var moveLight = (function () {
    var cx, cy, r, hasMouseMoved;

    return function () {
      cx = window.innerWidth  >> 1;
      cy = window.innerHeight >> 1;
      r = Math.min(cx, cy);
      hasMouseMoved = false;
      document.body.addEventListener('mousemove', stop);
      frame();
    };

    function frame() {
      var a = new Date / 300;
      realshadow.frame({
        pageX: cx + r * Math.cos(a) | 0,
        pageY: cy + r * Math.sin(a) | 0
      });
      !hasMouseMoved && setTimeout(frame, 16);
    }

    function stop() {
      document.body.removeEventListener('mousemove', stop);
      hasMouseMoved = true;
    }
  })();

  function tags(tag, text) {
    return '<' + tag + '>' + text.split('').join('</' + tag + '><' + tag + '>') + '</' + tag + '>';
  }


  var $container = document.getElementById('demo');

  (function() {

    var routes = {
        box    : box,
        drop   : drop,
        text   : text,
        flat   : flat,
        default: 'box'
      },
      $navigation = document.getElementById('navigation'),
      html = '';

    for (var i in routes) {
      if (i === 'default') continue;
      html += '<a href="#/' + i + '">' + i + '</a>';
    }
    $navigation.innerHTML = html;

    window.addEventListener('hashchange', check);
    check();

    function check() {
      var route = location.hash.replace(/^#\//, '').split('/');
      for (var i in routes) {
        if (i === route[0]) {
          setRoute(i, route[1]);
          return;
        }
      }
      setRoute(routes['default']);
    }

    function setRoute(route, options) {
      document.body.className = route;
      location.hash = '/' + route + '/' + (options || '');
      var items = $navigation.children;
      for (var i = items.length; i--;) {
        items[i].className = items[i].href.replace(/^.*#\//, '') === route ? 'current' : '';
      }

      realshadow.reset();
      routes[route](options);
      moveLight();
    }

  })();

})();