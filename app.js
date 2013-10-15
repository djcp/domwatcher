var http = require('http');
var url = require('url');
var $ = require('jquery').create();

var server = http.createServer();

function get_parameters(req) {
  var url_parts = url.parse(req.url, true);
  return url_parts.query;
}

function handleRequest(req, res) {
  var query = get_parameters(req);
  var content = 'nuthing';
  var data = '';

  if( ("url" in query) && ("css" in query) ){
    http.get(query['url'], function(response){
      response.on('data', function(chunk){
        data += chunk
      });
      response.on('end', function(){
        res.writeHead(200, { 'Content-Type': 'application/json'});
        var results = [];
        $.each($(data).find(query['css']), function(index, element){
          results.push({ 'result': $(element).text() });
        });
        res.write(JSON.stringify(results));
        res.end();
      });
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json'});
    res.write(
        JSON.stringify(
          { 'error': 'Please pass a URL and a jQuery compatible selector via GET parameters, thusly: ' + process.env.HOST + '/?url=http%3A%2F%2Fthoughtbot.com%2F&css=h2' })
        );
    res.end();
  }
}

server.on('request', handleRequest);

var port = process.env.PORT || 8080;

server.listen(port);
