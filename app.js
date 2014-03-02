var express = require('express'),
    lookup = require('./npm_repo').lookup;

var app = express();

app.use(express.logger('dev'));

function errorHandler(err, req, res, next){
  console.log(err.message);
  res.status(404).send("There was an error: " + err.message);
}

app.get("/:packageName", lookup, errorHandler);

var port = Number(process.env.PORT || 5000);
app.listen(port);
console.log("Listening on port " + port);
