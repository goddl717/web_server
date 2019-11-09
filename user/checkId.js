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
 

var authUser = function(id,password,callback){
    console.log('authUser 호출됨');
    pool.getConnection(function(err,conn){
        if(err){
        {
            if(conn){
                conn.release();
            }
        }
        callback(err,null);
        return;   
        }
    console.log('데이터베이스 연결 스레드 아이디 : ',conn.threadId);
    var columns = ['user_id','user_name','user_age'];
    var tablename = 'user1';
    var exec = conn.query("select ?? from ?? where user_id = ? and user_password = ?",[columns,tablename,id,password],function(err,rows){
        conn.release();
        console.log('실행대상 SQL :'+exec.sql);
        if(rows.length > 0){
            console.log('아이디 : 패스워드가 일치하는 사람이 있음'+id+password);
            callback(null,rows);
        }
        else {
            console.log('일치하는 사용자를 찾지 못함');
            callback(null,null);
        }
    });
} 
)};
router.post('/',function(req,res,next){
    console.log('/checkId 호출됨');
    var paraId = req.body.id || req.query.id;
    var paraPassword = req.body.password || req.query.password;
    console.log('요청된 파라미터 :'+paraId+paraPassword);
    if (pool){
        authUser(paraId,paraPassword,function(err,rows){
            if(err)
            {
                console.log('사용자 로그인 중 오류 발생 :'+ err.stack);
                res.send({state:0});
                res.end();
                return;
            }

            if(rows){
                console.dir(rows);
                var username = rows[0].name;
                res.send({state:1});
                res.end();
            }
            else {
                res.send({state:0});
                res.end();

            }
        })
    }
});
module.exports = router;
