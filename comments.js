// Create web server, using Node.js
// Run: node comments.js
// Access: http://localhost:3000/

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var comments = [];

function renderForm(response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write('<html><head><title>Comments</title></head>');
  response.write('<body><h1>Comments</h1>');
  response.write('<form method="POST" action="/"><textarea name="comment" rows="5" cols="60"></textarea><br>');
  response.write('<input type="submit" value="Submit"></form>');
  response.write('<h2>Previous comments</h2>');
  comments.forEach(function(comment) {
    response.write('<p>' + comment + '</p>');
  });
  response.write('</body></html>');
  response.end();
}

function render404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('404 Not Found\n');
  response.end();
}

function render500(response) {
  response.writeHead(500, {'Content-Type': 'text/plain'});
  response.write('500 Internal Server Error\n');
  response.end();
}

http.createServer(function (request, response) {
  if (request.method === 'GET') {
    var path = url.parse(request.url).pathname;
    if (path === '/') {
      renderForm(response);
    } else {
      render404(response);
    }
  } else if (request.method === 'POST') {
    var data = '';
    request.on('data', function(chunk) {
      data += chunk;
    });
    request.on('end', function() {
      var comment = qs.parse(data).comment;
      comments.push(comment);
      renderForm(response);
    });
  } else {
    render404(response);
  }
}).listen(3000);
console.log('Server running at http://localhost:3000/');