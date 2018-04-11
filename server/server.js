var http = require('http');
var fs = require('fs');
var qs = require('querystring');
/*
  NodeJS Required for this server
*/

/*
  This function will determine the MultiPurpose Internet Mail Extension of the requested file.
  See RFC 6838 for more information
  https://tools.ietf.org/html/rfc6838
*/
function parseMIME(request) {
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
  if(request.method == 'POST') {
    var body = '';
    if(request.url === '/score') {
      request.on('data', (chunk) => {
        body += chunk;
      });
      request.on('end', () =>{
        var options = {
          hostname: '173.230.153.123',
          port: 8181,
          path: '/0',
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          }
        };
        var req = http.request(options, (res) => {
          var dat = '';
          res.on('data', (chunk) => {
            dat += chunk;
          });
          res.on('end', (chunk) => {
            console.log("FINISHED: " + dat);
            response.end(dat);
          });
          res.on('error', (error) => {});
        });
        console.log(body);
        req.write(body);
        req.end();
      });
    }
  } else if(request.method == 'GET') {
    if(request.url === '/score') {
      var body = '';
      var options = {
        hostname: '173.230.153.123',
        port: 8181,
        path: '/0',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
      };
      http.get(options, (res) => {
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          response.end(body);
        });
      });
    } else {
      var file = request.url == '/' ? '../index.html' : '../' + request.url;
      fs.readFile(file, function(error, data) {
        if(!error) {
          var mime = parseMIME(file);
          response.setHeader('Content-Type', mime);
          response.end(data);
        } else {
          console.log('File not found: ' + request.url);
          response.writeHead(404, "Not found");
          response.end();
        }
      });
    }
  }
});
server.listen(8080);