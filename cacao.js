var http = require('http');
var util = require('util');
var fs = require('fs');
var M = require('mustache');
var _ = require('./underscore-min.js');

var Cacao = {
    run: function(port, host) {
        var port = port || 5000;
        var host = host || '127.0.0.1';
        http.createServer(Cacao.handle_request).listen(port, host);
        util.log('Running Cacao on ' + host + ':' + port);
    },
    handle_request: function(req, res) {
        var url = req.url;
        util.log(req.url + ' ' + req.method);

        Cacao.__proto__.res = res;
        Cacao.__proto__.req = req;

        //if (typeof handler !== 'function') Cacao.handle_error('URL not found!');

        var rv = router.loadUrl(url);

        var handler = rv.handler.callback;
        var params = rv.param;

        handler(req, res, params);
    },
    handle_error: function(err) {
        var html = "<html><body><p>" + err + "</p></body></html>";
        Cacao.send_response(html)
    },
    render: function(file, context) {
        fs.readFile(file, 'utf8', function(err, data) {
            if (err) throw err;
            
            var html_string = data.toString();
            var html = M.to_html(html_string, context);

            Cacao.send_response(html);
        });
    },
    send_response: function(body, status_code, content_type) {
        Cacao.res.writeHead((status_code || 200), {'Content-Type': (content_type || 'text/html')});
        Cacao.res.write(body);
        Cacao.res.end();
    },
    sendJSON: function(json) {
        var json = JSON.stringify(json);
        Cacao.send_response(json, 200, 'application/json');
    }
}

Cacao.Router = function() {
    /* Router functionality taken from Backbone.js */

    var namedParam    = /:\w+/g;
    var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

    var handlers = [];
    var routes = [];

    var add_routes = function(router) {
        for (var route in router) {
            routes.unshift([route, router[route]]);
        }
        for (var i = 0, l = routes.length; i < l; i++) {
            var route = _routeToRegExp(routes[i][0]);
            handlers.unshift({route: route, callback: routes[i][1]});
        }
    }

    var _routeToRegExp = function(route) {
        route = route.replace(escapeRegExp, '\\$&')
                     .replace(namedParam, '([^\/]+)');
        return new RegExp('^' + route + '$');
    }

    var _extractParameters = function(route, fragment) {
        return route.exec(fragment).slice(1);
    }

    var loadUrl = function(url) {
        var rv = {};
        var fragment = url;
        var matched = _.any(handlers, function(handler) {
            if (handler.route.test(fragment)) {
                var param = _extractParameters(handler.route, fragment);
                rv.handler = handler;
                rv.param = param
                return true;
            }
        });
        return rv;
    }

    return {
        add_routes: add_routes,
        loadUrl: loadUrl
    }
}

exports.cacao = Cacao;