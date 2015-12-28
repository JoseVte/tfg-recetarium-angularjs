var port = Number(process.env.PORT || 8000);

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/app'));
app.get('*', function(req, res) {
    res.sendFile(__dirname + '/app/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
