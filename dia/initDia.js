var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();
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

var today = function(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) {
        dd='0'+dd
    } 
    if(mm<10) {
        mm='0'+mm
    } 
    today = yyyy+'-'+mm+'-'+dd;
    return today;
}

//diagnosis;
//이름을 주면 날짜는 자동으로 진료번호도 자동으로 만들어서 데이터베이스에 저장..
//그리고 num 으로 진료 번호를 반환.
var initDiagnosis = function(name,callback){
    console.log('initDiagnosis 실행');
    pool.getConnection(function(err,conn){
    if (err){
        if(conn){
            conn.release();
        }
   
    callback(err,null);
    return;
    }
    console.log('데이터 베이스 연결 스레드 아이디 : '+ conn.threadId);
    var ttoday = today();
    var data = { dia_name :name ,dia_date :ttoday};
    var exec = conn.query('insert into diagnosis set?',data,function(err,result){
        conn.release();
        console.log('실행 대상 SQL :'+ exec.sql);

        if (err){
            console.log('sql 실행시 오류 ');
            console.dir(err);
            callback(err,null);
            return ;
        }
        callback(null,result);      
    })
});
}

router.post('/',function(req,res){
    console.log('iniDiagnosis 호출');
    var paraName = req.body.name || req.query.name;
    console.log('요청 파라미터: '+paraName);
    if (pool){
        initDiagnosis(paraName,function(err,initDiagnosis){
            if (err){
                console.log('진료 추가 중 오류'+err.stack);
                res.send({state:2});
                res.end();
                return;
            }
            if (initDiagnosis){
                console.dir(initDiagnosis);
                console.log('inserted!');
                console.log(initDiagnosis.insertId);
                var MAX = 10;
                if (initDiagnosis.insertId >= MAX)
                {
                    console.log("delete from diagnosis where dia_id ="+(parseInt(initDiagnosis.insertId)-MAX));
                    pool.query("delete from diagnosis where dia_id =?",[parseInt(initDiagnosis.insertId)-MAX], function(err, rows, fields){
                    if(err)console.log(err);
                    console.log('delete!');
                });
                }
                res.send({'num':initDiagnosis.insertId})
                res.end();
            }else {
                res.json({'num': -1});
                res.end();
            }
        });
        }
        else {
            var temp ={state : 3};
            res.json(temp);
            res.end();
        }
    });


    module.exports = router;
