var request = require('request'),
    cheerio = require('cheerio');


function extract_url(content){
  var $ = cheerio.load(content);
  return $(".metadata tr:contains('Repository') a").attr("href") ||
         $(".metadata tr:contains('Homepage') a").attr("href");
}

exports.lookup = function(req, res, next){
  var package_name = req.params.package_name,
      npm_url = "https://www.npmjs.org/package/" + package_name;

  request(npm_url, function(error, response, body){

    if(error) { next(error); }

    var url = extract_url(body);
    url ? res.redirect(301, url) :
          next(new Error("repo " + package_name + " not found"));

  });
}

exports.error_handler = function(err, req, res, next){
  console.log(err.message);
  res.status(404).send("There was an error: " + err.message);
}

