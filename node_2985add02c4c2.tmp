var http = require('http');
var fs = require('fs');
/*
  NodeJS Required for this server
*/

/*
  This function will determine the MultiPurpose Internet Mail Extension of the requested file.
  See RFC 6838 for more information
  https://tools.ietf.org/html/rfc6838
*/
function parseMIME(request) {
  console.log(request);
  var offset = request.lastIndexOf('.');
  if(offset == -1) {
    return 'text/plain';
  }
  switch(request.substr(offset)) {
    case '.html': return 'text/html';
    case '.js': return 'text/js';
    case '.png': return 'image/png';
    case '.css': return 'text/css';
    case '.xml': return 'Application/xml';
    default: return 'text/plain';
  } 
}

var server = http.createServer(function (request, response) {
  var file = request.url == '/' ? './index.html' : './' + request.url;
  fs.readFile(file, function(error, data) {
    if(!error) {
      var mime = parseMIME(file);
      console.log(mime);
      response.setHeader('Content-Type', mime);
      response.end(data);
    } else {
      console.log('File not found: ' + request.url);
      response.writeHead(404, "Not found");
      response.end();
    }
  });
});
server.listen(8080);