var app = require('../cacao').cacao;

var index = function(req, res) {
    context = {'foo': 'universe'};
    app.render('index.html', context);
}

var profile = function(req, res, params) {
    if (params) app.send_response(params[0]);

    app.send_response('profile');
}

var favicon = function(req, res) {
    app.send_response('');
}

router = new app.Router();

router.add_routes({
    '/': index,
    '/profile': profile,
    '/profile/:user': profile,
    '/favicon.ico': favicon
})

app.run(5000)