var http = require('http');
var fs = require('fs');
var qs = require('querystring');

var data = {
    player: "N/A",
    score: 0,
    scope: "game-expo"
  };
var entry = JSON.stringify(data);

var options = {
    hostname: '173.230.153.123',
    port: 8181,
    path: '/0',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }
};
for(var i = 0; i < 9; i++) {
    var req = http.request(options, (res) => {
        var dat = '';
        res.on('data', (chunk) => {
          dat += chunk;
        });
        res.on('end', (chunk) => {
          console.log("FINISHED");
        });
        res.on('error', (error) => {});
    });
    req.write(entry);
    req.end();
}