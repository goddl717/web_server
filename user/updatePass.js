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
 
//여기서 부터 비밀번호 변경.
//비밀번호 변경.
//입력값으로 id 와 new password 를 만들자.

var updatePass = function(id,newpass,callback){
    console.log('updatePass가 호출됨');
    pool.getConnection(function(err,conn){
    if (err){
        if(conn){
            conn.release();
        }
    callback(err,null);
    return;
    }
    console.log('데이터베이스 연결 스레드 아이디 : '+ conn.threadId); 
    var exec = conn.query('update user1 set user_password =? where user_id=?',[newpass,id],function(err,result){
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
    console.log('addUser 호출');
    var paraId=req.body.id || req.query.id;
    var paraPass = req.body.newpassword || req.query.newpassword;
    console.log('요청 파라미터 '+paraId+paraPass);
    if (pool){
        updatePass(paraId,paraPass,function(err,updatePass){
            if (err){
                console.log('사용자 변경 중 오류'+err.stack);
                //res.writeHead('200',{'Content-type' :'text/html;charset=utf8'});
                // res.write('추가중 오류');
                res.send({state:2});
                res.end();
                return;
            }

            if (updatePass){
                console.dir(updatePass);
                console.dir(updatePass.changedRows);
                if (updatePass.changedRows==0)
                {
                    res.json({'state': 0});
                    res.end();

              
              }else {
                console.log('update! ');
                res.send({'state':1});
                //res.writeHead('200',{'Content-type' :'text/html:charset=utf8'});
                //res.write('추가성공');
                //var jsonDatas = JSON.stringify({'state' : 1});
                //res.write(jsonDatas);
                // res.json(temp);
                res.end();
              }
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