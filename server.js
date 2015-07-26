var WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({port: 3434});

wss.broadcast = function(data) {
    for(var i in this.clients) {
        this.clients[i].send(data);
    }
};

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: %s', message);
        wss.broadcast(message);
    });
});

var express = require("express");
var app = express();
app.use(express.bodyParser());
/* serves main page */
app.get("/", function(req, res) {
    res.sendfile('index.html');
});

/* serves all the static files */
app.get(/^(.+)$/, function(req, res) {
    //console.log('static file request : ' + req.params);
    res.sendfile(__dirname + req.params[0]);
});

var port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log("Listening on " + port);
});



/* */
/*
 var thrift = require('thrift'); 
 
 var transport = thrift.TBufferedTransport(); 
 var protocol = thrift.TBinaryProtocol(); 
 
 var Calculator = require('./gen-nodejs/Calculator.js'), 
 ttypes = require('./gen-nodejs/star_types'); 
 
 var connection = thrift.createConnection("10.81.12.187", 9090); 
 *//* 
  var connection = thrift.createConnection("10.81.12.187", 9090, { 
  transport : transport, 
  protocol : protocol 
  });*/

//var client = thrift.createClient(Calculator, connection); 
/* 
 client.add(1, function(err, response) {
 if (err) {
 console.error(err);
 } else {
 if (err) {
 console.error(err);
 } else {
 console.log(response);
 }
 }
 });
 */
/*
 connection.on('error', function(err) {
 alert("connection error");
 });*/
