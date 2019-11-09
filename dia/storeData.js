//기본 모듈
var express = require('express');
//미들웨어
var bodyParser = require('body-parser');
var mysql = require('mysql');
//파일 업로드용 미들웨어
var multer =require('multer');
var {PythonShell} = require('python-shell');


var upload = multer({dest:'dataset/display/img'});

var options = {
    mode: 'text',
    pythonPath: '',
    pythonOptions: ['-u'],
    scriptPath: '',
    args: ['value1', 'value2', 'value3']
  };

  var pool = mysql.createPool({
    connectionLimit :10,
     host : 'localhost',
     user : 'root',
     password : 'eorn',
     port : 3306,
     database : 'hang'
 })

var router = express.Router();


router.use(bodyParser.urlencoded({extended: false}));

router.post('/',upload.single('profile'),function(req,res){
   //1 파일을 업로드 함.
    var num = req.body.num || req.query.num;
    var file = req.body.profile || req.query.profile;
    console.log(num);
    console.log(file);

    if (num){
    //여기서 파이썬 코드 실행
    PythonShell.run('test.py', options, function (err, results) {
        if (err) {
            throw err;
        }
       else {
               //var temp = "123 123 123 123"
               //console.log('results: %j', results);
               
                //results = results.replace("'","");
                var temp_str = results;

                temp_str =temp_str.toString().replace(/\"/g, "");

                console.log('results: %j', temp_str);
                
                var data = {imgtext:temp_str}
                var exec = pool.query('insert into label_'+num+'_pos set ?',data,function(err,rows){
                   console.log(exec.sql);
                if (err)
                {
                    console.log(err);
                    console.log("sql문 시 오류");
                }
                console.log(rows);
                //res.json(rows);
                var MAX = 10;
                if (rows.insertId > MAX)
                    {
                       
                        var exec1 = pool.query('delete from label_'+num+'_pos where num ='+[rows.insertId - MAX],function(err1,rows1){
                            if (err)
                            {
                                console.log(err1);
                            }
                            console.log(exec1.sql);
                            console.log(rows1);
                            console.log("delete!");
                        });

                    }
                res.send({"state":"1"});
                res.end();
                
            });
       }
    });

  
    }
    else {
        res.send({"state":"0"});
        res.end();
    }    
})



   
module.exports = router;
