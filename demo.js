/*
 * This 'app' has been quickly built only to demonstrate the features of Real Shadow
 * To explore the well-structured apps, check out CoreJS http://corejs.github.io/
 */
(function () {

    var box = function () {

        realshadow.reset();

        var shapes = ['rect', 'circle', 'round', 'ur', 'll'],
            colors = ['', 'r', 'g', 'b', 'rgb', 'rg', 'gb', 'br'],
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
                html += '<span rel="' +
                    colors[(i * size + j) % colors.length] +
                    '" class="realshadow block ' +
                    shapes[(i * size + j) % shapes.length] +
                    ' c' +
                    colors[(i * size + j) % colors.length] +
                '"></span>';
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

        realshadow.reset();

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


    var $container = document.getElementById('demo');

    (function() {

        var routes = {
                box    : box,
                drop   : drop,
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
            routes[route](options);
        }

    })();

})();