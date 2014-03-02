var request = require('request'),
    cheerio = require('cheerio');

var _cache = exports._cache = {};

exports.lookup = function(req, res, next){
  var packageName = req.params.packageName,
      npm_url = "https://www.npmjs.org/package/" + packageName;

  if(!_cache[packageName]) {
    console.log("Cache missing for " + packageName);

    request(npm_url, function(error, response, body){
      if(error) { next(error); }

      var url = extract_url(body);
      if(url){
        _cache[packageName] = url;
        res.redirect(url);
      } else {
        next(new Error("repo " + packageName + " not found"));
      }
    });

  } else {
    console.log("Cache hit for " + packageName);
    res.redirect(_cache[packageName]);
  }
}

function extract_url(content){
  var $ = cheerio.load(content);
  return $(".metadata tr:contains('Repository') a").attr("href") ||
         $(".metadata tr:contains('Homepage') a").attr("href");
}
