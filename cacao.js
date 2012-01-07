var http = require('http');
var fs = require('fs');
var M = require('mustache');

var Cacao = {
    dispatch_request: function(req, res) {
        /* Matches the URL and returns the
           return value of the view or error handler
        */
        var url = req.url;
        controller = Cacao.routes[url];
        if (controller) {
            return this.Response(controller(req, res));
        } else {
            return this.Response('Page not found.');
        }
        
    },
    render: function(file, context) {
        var data = fs.readFileSync(file, 'utf8');
        html = M.to_html(data, context);
        return html

        // This Doesn't work. Always returns 'undefined'.
        // Not sure how to keep it asynchronous
        // and make it work without changing structure 
        // of framework.
        /*
        fs.readFile(file, function(err, data) {
            if (err) {
                return 'Error reading file';
            } else {
                var html_string = data.toString();
                var html = M.to_html(html_string, context);
                console.log('html: ' + html);
                return html
            }

        })
        */
    },
    run_server: function(port) {
        http.createServer(function(req, res) {
            // TODO: log info about every req: date, user_agent etc...
            view_func = Cacao.dispatch_request(req, res);

            res.writeHead((view_func.status_code), {
                'Content-Type': view_func.content_type
            });

            res.write(view_func.controller);
            res.end();
        }).listen(port);
        console.log('Server running on port: ' + port);

    }
}

Cacao.__proto__.Response = function(controller) {
    var response_object = {
        'controller': controller,
        'status_code': 200,
        'content_type': 'text/html'
    }
    if (controller === 'Page not found.') {
        response_object.controller = 'Page not found';
        response_object.status_code = 404;
    }
    return response_object;

    var is_JSON = function() {
        // Check if return value is JSON
        return;
    }
}

exports.cacao = Cacao;