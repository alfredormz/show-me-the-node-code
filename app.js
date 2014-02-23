var express = require('express'),
    lookup = require('./npm_repo').lookup,
    error_handler = require('./npm_repo').error_handler;

var app = express();

app.use(express.logger('dev'));

app.get("/:package_name", lookup, error_handler);

var port = Number(process.env.PORT || 5000);
app.listen(port);
console.log("Listening on port " + port);
