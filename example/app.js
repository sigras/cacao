var app = require('../cacao').cacao;

var home = function(req, res) {
    var context = {'foo': 'bar'};
    return app.render('index.html', context);
}

app.routes = {
    '/home': home,
}

app.run_server(5000);