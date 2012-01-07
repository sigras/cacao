This is a very simple framework for NodeJS.

Example:

```javascript
var app = require('../cacao').cacao;

var home = function(req, res) {
var context = {'foo': 'bar'};
return app.render('index.html', context);
}

app.routes = {
'/home': home,
}

app.run_server(5000);
```

As you can see, it's very simple and lots of things are still missing, so it's obvious not to use this in a production environment.
