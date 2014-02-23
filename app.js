var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio');

var app = express();

app.use(express.logger('dev'));

function extract_url(content){
  var $ = cheerio.load(content);
  return $(".metadata tr:contains('Repository') a").attr("href") ||
         $(".metadata tr:contains('Homepage') a").attr("href");
}

function lookup(req, res, next){
  var package_name = req.params.package_name,
      npm_url = "https://www.npmjs.org/package/" + package_name;

  request(npm_url, function(error, response, body){

    if(!error){
      var url = extract_url(body);

      url ? res.redirect(301, url) :
            res.status(404).send("Repo for " + package_name + " not found");

    } else {
      next(error);
    }

  });

}

app.get("/:package_name", lookup);

var port = Number(process.env.PORT || 5000);
app.listen(port);
console.log("Listening on port " + port);
