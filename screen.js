var express = require('express')
var cors = require('cors')
var app = express()
var path = require('path');
var passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var {PythonShell} = require('python-shell');
var http = require('http'); 
var fs = require('fs'); // 파일 읽기, 쓰기 등 을 할 수 있는 모듈
var app = express();
app.use(bodyParser.urlencoded({extended: false}));


var addUserRouter = require('./user/addUser');
var loginUserRouter = require('./user/checkId');
var initDiaRouter = require('./dia/initDia');
var updatePassRouter = require('./user/updatePass');
var pythonRouter = require('./pyth/ImageToText')
var storeRouter = require('./dia/storeData');
var storeNegativeRouter = require('./dia/storeDataNegative');
//var screenRouter = require('./screen/screen');

//var storeTextRouter = require('./pyth/storeText');


var pool = mysql.createPool({
   connectionLimit :10,
    host : 'localhost',
    user : 'root',
    password : 'eorn',
    port : 3306,
    database : 'hang'
})

//파일 분리.
app.use('/user/addUser',addUserRouter);
app.use('/user/checkId',loginUserRouter);
app.use('/dia/initDia',initDiaRouter);
app.use('/user/updatePass',updatePassRouter);
app.use('/pyth/ImageToText',pythonRouter);
app.use('/dia/storeData',storeRouter);
app.use('/dia/storeDataNegative',storeNegativeRouter);
//app.use('/screen/screen',screenRouter);

app.use(session({ secret: 'SECRET_CODE', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors())
app.use('/assets',express.static('assets'))



app.get('/login', function (req, res, next) {
  res.sendFile(path.join(__dirname ,'/index.html'));
})

app.get('/regist', function (req, res, next) {
    console.log("regist!");
    res.sendFile(path.join(__dirname ,'/regist.html'));
})

app.listen(3000, function () {
  console.log('CORS-enabled web server listening on port 3000')
})