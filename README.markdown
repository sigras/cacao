A web framework I made to get familiar with NodeJS.

Example:

```javascript
var app = require('../cacao').cacao;

var index = function(req, res) {
    var context = {'foo': 'bar'};
    app.render('index.html', context);  
}

var profile = function(req, res, params) {
    if (params) app.send_response(params[0]);
    app.send_response('Profile');

var router = new app.Router();

router.add_routes({
    '/': index,
    '/profile': profile,
    '/profile/:username': profile,
});

app.run(5000);
```

