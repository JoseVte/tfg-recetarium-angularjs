var port = Number(process.env.PORT || 8001);

var express = require('express');
var favicon = require('serve-favicon');
var app = express();

app.use(express.static(__dirname + '/app'));
app.use(favicon(__dirname + '/app/assets/img/favicon.png'));
app.get('*', function(req, res) {
    res.sendFile(__dirname + '/app/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
