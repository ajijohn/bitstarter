
//modiefied web js
var  express = require("express");
var fs = require("fs");
var app = express.createServer(express.logger());

var outb = "";

app.get('/', function(request, response) {

outb = fs.readFileSync("index.html",'utf-8');

response.end(outb);

});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});





