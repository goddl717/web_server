var express = require('express')
var cors = require('cors')
var app = express()
var path = require('path');

app.use(cors())
app.use('/assets',express.static('assets'))

app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname ,'/index.html'));
})

app.get('/regist', function (req, res, next) {
    console.log("regist!");
    
    res.sendFile(path.join(__dirname ,'/regist.html'));
})

app.listen(3000, function () {
  console.log('CORS-enabled web server listening on port 3000')
})