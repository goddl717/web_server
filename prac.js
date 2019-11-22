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

//app.use('/pyth/StoreText',storeTextRouter);


/*
//사용자를 등록하는 함수.
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
app.post('/addUser',function(req,res){
    console.log('addUser 호출');

    var paraName = req.body.name || req.qery.name;
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

    */

//로그인
/*
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
app.post('/checkId',function(req,res){
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
*/
/*
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

app.post('/iniDiagnosis',function(req,res){
    console.log('iniDiagnosis 호출');
    var paraName = req.body.name || req.qery.name;
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

    */

//여기서 부터 비밀번호 변경.
//비밀번호 변경.
//입력값으로 id 와 new password 를 만들자.
/*
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
/*
app.post('/updatePass',function(req,res){
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
                console.log('update! ');
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

    */
/*
//파이썬 실행시키기.
var options = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: ['value1', 'value2', 'value3']
      };
//안에 있는 파일들에 대해서 텍스트파일을 생성.
//파이썬 파일불러오기.

//저장을 받은 것들을 데이터베이스에 저장해야한다.
//진료번호를 받아서
app.post('/ImageToText',function(req,res){

    PythonShell.run('test.py', options, function (err, results) {
        if (err) throw err;
        console.log('results: %j', results);

      });

});
*/


app.listen(8080,function(){
    console.log('listening 8080!');
});


