var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var {PythonShell} = require('python-shell');
var router = express.Router();
router.use(bodyParser.urlencoded({extended: false}));
var pool = mysql.createPool({
   connectionLimit :10,
    host : 'localhost',
    user : 'root',
    password : 'eorn',
    port : 3306,
    database : 'hang'
})
//파이썬 실행시키기.
var options = {
    mode: 'text',
    pythonPath: '',
    pythonOptions: ['-u'],
    scriptPath: '',
    args: ['value1', 'value2', 'value3']
  };
  
router.post('/',function(req,res){
});
module.exports = router;
