var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio');

var app = express();

app.use(express.logger('dev'));

function lookup(package_name, callback){
  var npm_url = "https://www.npmjs.org/package/" + package_name;

  request(npm_url, function(error, response, body){

    if(!error && response.statusCode == 200){
      var $ = cheerio.load(body);
      var url = $(".metadata tr:contains('Repository') a").attr("href") ||
                $(".metadata tr:contains('Homepage') a").attr("href");

      callback(null, url);
    } else {
      return callback("Error");
    }
  });

}

app.get("/:package_name", function(req, res){
  var package_name = req.params.package_name;

  lookup(package_name, function(error, url){
    if(!error && url) {
      res.redirect(301, url);
    } else {
      res.status(404).send("Repo for " + package_name + " not found");
    }
  });
});

var port = Number(process.env.PORT || 5000);
app.listen(port);
console.log("Listening on port " + port);
