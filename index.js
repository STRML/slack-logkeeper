var app = require('express')();
var bodyParser = require('body-parser');
var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;
var path = require('path');
var mkdirp = require('mkdirp');
var streams = {};

// Constants
var PORT = process.env.PORT || 4000;
var OUTPUT_PATH = process.env.OUTPUT_PATH || 'logs';

// Server setup
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Routing
app.post('/', function (req, res) {
  var outputPath = path.join(OUTPUT_PATH, req.body.team_domain, '#' + req.body.channel_name, getYMD() + '.txt');
  mkdirp(path.dirname(outputPath), function(err) {
    if (err) return console.error(err);
    var stream = streams[outputPath] || (streams[outputPath] = fs.createWriteStream(outputPath, {'flags': 'a'}));
    stream.write(sprintf("[%s] <%s> %s\n", getTime(), req.body.user_name, req.body.text));
    console.log(req.body);
  });
});

// Utils
function getYMD() {
  var dt = new Date();
  return sprintf("%04d-%02d-%02d", dt.getUTCFullYear(), (dt.getUTCMonth() + 1), dt.getUTCDate());
}

function getTime() {
  var dt = new Date();
  return sprintf("%02d:%02d:%02d", dt.getUTCHours(), dt.getUTCMinutes(), dt.getUTCSeconds());
}

app.listen(PORT);
console.log("Listening on port %d", PORT);
