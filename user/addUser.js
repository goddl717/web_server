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

var addUser = function(name,id,password,age,sex,callback){
    console.log('사용자가 호출됨');

    pool.getConnection(function(err,conn){
    if (err){
        if(conn){
            conn.release();
        }
   
    callback(err,null);
    return;
    }
    console.log('데이터베이스 연결 스레드 아이디 : '+ conn.threadId);

    var data = { user_name :name ,user_id : id, user_password : password , user_age:age, user_sex:sex };

    var exec = conn.query('insert into user1 set?',data,function(err,result){
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

router.post('/',function(req,res,next){
    console.log('addUser 호출');

    var paraName = req.body.name || req.query.name;
    var paraId=req.body.id || req.query.id;
    var paraPass = req.body.password || req.query.password;
    var paraAge = req.body.age || req.query.age;
    var paraSex = req.body.sex || req.query.sex;

    console.log('요청 파라미터 '+paraName+paraId+paraSex);

    if (pool){
        addUser(paraName,paraId,paraPass,paraAge,paraSex,function(err,addUser){
            if (err){
                console.log('사용자 추가 중 오류'+err.stack);
                //res.writeHead('200',{'Content-type' :'text/html;charset=utf8'});
                // res.write('추가중 오류');
                res.send({state:2});
                res.end();
                return;
            }

            if (addUser){

                console.dir(addUser);
                console.log('inserted ');
                res.send({'state':1});
                //res.writeHead('200',{'Content-type' :'text/html:charset=utf8'});
                //res.write('추가성공');
                //var jsonDatas = JSON.stringify({'state' : 1});
                //res.write(jsonDatas);
                // res.json(temp);
                res.end();
            }else {
                //res.writeHead('200',{'Content-type' :'text/html:charset=utf8'});
              //  res.send('추가 실패');
               // var temp ={state : 0};
                res.json({'state': 0});
               res.end();
            }
        });
        }
        else {
           // res.writeHead('200',{'Content-type' :'text/html:charset=utf8'});
            //res.send("데이터베이스 오류");
            var temp ={state : 3};
            res.json(temp);
            res.end();
        }

    });

module.exports = router;
