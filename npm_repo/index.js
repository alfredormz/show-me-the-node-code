var request = require('request'),
    cheerio = require('cheerio');

var simple_cache = exports.simple_cache = {};

function extract_url(content){
  var $ = cheerio.load(content);
  return $(".metadata tr:contains('Repository') a").attr("href") ||
         $(".metadata tr:contains('Homepage') a").attr("href");
}

exports.lookup = function(req, res, next){
  var package_name = req.params.package_name,
      npm_url = "https://www.npmjs.org/package/" + package_name;

  if(simple_cache[package_name]){
    console.log("Cache hit for " + package_name);
    res.redirect(simple_cache[package_name]);
    return
  }

  request(npm_url, function(error, response, body){

    if(error) { next(error); }

    var url = extract_url(body);

    console.log("Cache miss for " + package_name);
    simple_cache[package_name] = url;
    url ? res.redirect(url) :
          next(new Error("repo " + package_name + " not found"));
  });
}

exports.error_handler = function(err, req, res, next){
  console.log(err.message);
  res.status(404).send("There was an error: " + err.message);
}

